from app.exercises.exercise import Exercises
from fastapi import APIRouter

exercises = Exercises()

exercises_router = APIRouter(
    prefix="/api/exercises",
    tags=["exercises"],
)

@exercises_router.get("/")
def get_all_exercises():
    exercises_data = exercises.get_all_exercises()
    return exercises_data