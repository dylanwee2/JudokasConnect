import os
import json
import google.generativeai as genai
from fastapi import HTTPException, APIRouter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

video_analysis_router = APIRouter(
    prefix="/api/diet_plan",
    tags=["diet_plan"],
)

# Set your API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@video_analysis_router.post("/")
async def generate_response():
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
        gemini_response = g_model.generate_content(
            f"Here is user data: {user_data}.\n"
            f"Create a daily meal plan with macro breakdown to support the user's goal.\n"
            f"Return ONLY a valid raw JSON object with the following keys:\n"
            f"'user_summary', 'calorie_goal', 'macros', 'meals', 'totals', 'notes', 'extra_tips'.\n"
            f"Do NOT include any markdown, backticks, or explanations. Do NOT wrap it in ```json. "
            f"Just return the JSON object — nothing else."
        )
        return {
            "data": gemini_response.text,
        }

    except Exception as e:
        print("Error in /api/diet_plan:", str(e))
        raise HTTPException(status_code=500, detail=str(e))