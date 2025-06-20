from pydantic import BaseModel
from typing import Optional

class Exercises(BaseModel):
    uid: str
    name: str
    duration: int
    calories: int
    numExercises: int
    listExercises: list[str]