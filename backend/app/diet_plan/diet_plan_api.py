import os
import json
import google.generativeai as genai
from fastapi import HTTPException, APIRouter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

diet_plan_router = APIRouter(
    prefix="/api/diet_plan",
    tags=["diet_plan"],
)

# Set your API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@diet_plan_router.post("/")
async def generate_response():
    prompt = """
        You are an assistant tasked with generating a structured meal plan based on user health data.

        Here is the user data:
        {
        "currentWeight": 70,
        "currentHeight": 175,
        "currentBMI": 34,
        "targetWeight": 65,
        "targetBMI": 24,
        "goal": "Lose weight, gain muscle"
        }

        Create a daily meal plan to help the user achieve their goal.

        Your response MUST be a valid JSON object with these **exact** top-level keys:

        - "user_summary"
        - "calorie_goal"
        - "macros" (with "protein", "carbohydrates", and "fat")
        - "meals" (an array of objects, each with "meal", "items", and "macro_breakdown")
        - "totals" (same structure as "macros", but include "calories" too)
        - "notes"
        - "extra_tips"

        ❗ Strict formatting rules:
        - Inside each meal object, use the key "items" (❌ NOT "food" or anything else).
        - Each "macro_breakdown" must include: "protein", "carbohydrates", "fat".
        - The JSON must be syntactically correct — no trailing commas, no missing keys.
        - ❌ Do NOT include Markdown formatting, backticks, or explanations — ONLY return the raw JSON object.

        ✅ Example structure for a meal:
        {
        "meal": "Lunch (500 calories)",
        "items": [
            "Grilled chicken breast (150g)",
            "Quinoa (100g)",
            "Steamed broccoli (100g)"
        ],
        "macro_breakdown": {
            "protein": "45g",
            "carbohydrates": "50g",
            "fat": "12g"
        }
        }

        Respond only with the JSON object and make sure it's parsable without errors.
        """

    user_data = {
        "currentWeight": 70,
        "currentHeight": 175,
        "currentBMI": 34,
        "targetWeight": 65,
        "targetBMI": 24,
        "goal": "Lose weight, gain muscle"
    }
    try:
        # Call Gemini AI model
        g_model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
        gemini_response = g_model.generate_content(prompt)
        return {
            "data": gemini_response.text,
        }

    except Exception as e:
        print("Error in /api/diet_plan:", str(e))
        raise HTTPException(status_code=500, detail=str(e))