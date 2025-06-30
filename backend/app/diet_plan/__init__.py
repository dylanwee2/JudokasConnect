from pydantic import BaseModel
from typing import List, Dict, Any

class BaseDietPlan(BaseModel):
    userId: str
    calorie_goal: int
    user_summary: str
    macros: Dict[str, int]
    meals: List[Dict[str, Any]]
    totals: Dict[str, int]
    extra_tips: str
    notes: str

class PersonalDietPlanData(BaseModel):
    currentWeight : int
    targetWeight : int
    currentBMI : int
    height: int
    age: int
    goal : str
    activityLevel : str
