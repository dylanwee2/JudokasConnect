import os
import google.generativeai as genai
from fastapi import HTTPException, APIRouter
from dotenv import load_dotenv
from app.diet_plan.diet_plan import PersonalDietPlanData, BaseDietPlan
from app.diet_plan.diet_plan import Diet_plan

diet_plan = Diet_plan()

# Load environment variables
load_dotenv()

diet_plan_router = APIRouter(
    prefix="/api/diet_plan",
    tags=["diet_plan"],
)

# Set your API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@diet_plan_router.get("/get_user_diet_plan/{uid}")
def get_diet_plan(uid: str):
    user_diet_plan = diet_plan.get_user_diet_plan(uid)
    return user_diet_plan

@diet_plan_router.post("/get_new_diet_plan")
def get_new_diet_plan(diet_plan_object: PersonalDietPlanData):
    user_data = diet_plan_object.dict()

    prompt = f"""
    You are a meal planning assistant. Based on the following user data, generate a structured, daily meal plan in JSON format.

    User data:
    {user_data}

    🧠 Required Output Format:
    Return a JSON object with the following **exact top-level keys**:
    - "calorie_goal"
    - "user_summary"
    - "macros" (must include "protein", "carbs", "fat")
    - "meals" (array of 3 meals: each with "name", "time", "items", and "calories")
    - "totals" (must include "calories", "protein", "carbs", "fat")
    - "extra_tips"
    - "notes"

    ⚠️ Strict format rules:
    - Use **lowerCamelCase** for all keys (e.g., "calorie_goal", not "calorieGoal").
    - Each meal must have:
    - "name" (e.g., "Lunch")
    - "time" (e.g., "12:30 PM")
    - "items" (array of strings, e.g., ["Grilled chicken breast", "Quinoa"])
    - "calories" (numeric)
    - All macros are in grams (e.g., protein: 140).
    - The JSON must be syntactically valid — no trailing commas or extra keys.
    - ❌ Do NOT include markdown, code blocks, or explanations.
    - ✅ Respond with **only the JSON object**.

    📌 Sample format (match structure exactly):
    {{
    calorie_goal: 2200,
    user_summary: "Personalized nutrition plan for weight loss and muscle gain",
    macros: {{ protein: 140, carbs: 220, fat: 70 }},
    meals: [
        {{
        name: "Breakfast",
        time: "7:00 AM",
        items: ["Oatmeal with berries", "Greek yogurt", "Almonds"],
        calories: 450
        }},
        {{
        name: "Lunch",
        time: "12:30 PM",
        items: ["Grilled chicken breast", "Quinoa", "Mixed vegetables"],
        calories: 650
        }},
        {{
        name: "Dinner",
        time: "7:00 PM",
        items: ["Salmon fillet", "Sweet potato", "Steamed broccoli"],
        calories: 600
        }}
    ],
    totals: {{ calories: 2200, protein: 140, carbs: 220, fat: 70 }},
    extra_tips: "Drink 8-10 glasses of water daily, Eat slowly and mindfully",
    notes: "Adjust portions based on hunger and energy levels"
    }}

    Return the meal plan in exactly this structure with different food items, but following the same format.
    """ 

    try:
        # Call Gemini AI model
        g_model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
        gemini_response = g_model.generate_content(prompt)
        print("Gemini ai response")
        print(gemini_response.text)
        return {
            "data": gemini_response.text,
        }

    except Exception as e:
        print("Error in /api/diet_plan:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@diet_plan_router.post("/add_diet_plan")
def add_diet_plan(diet_plan_object: BaseDietPlan):
    return diet_plan.add_user_diet_plan(diet_plan_object)

@diet_plan_router.put("/update_diet_plan/{uid}")
def update_diet_plan(uid: str, diet_plan_object: BaseDietPlan):
    diet_plan.id = uid
    return diet_plan.update_diet_plan(diet_plan_object)