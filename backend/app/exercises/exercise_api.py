from app.exercises.exercise import Exercises
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from starlette.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR

exercises = Exercises()

exercises_router = APIRouter(
    prefix="/api/exercises",
    tags=["exercises"],
)

@exercises_router.get("")
def get_all_exercises():
    try:
        exercises_data = exercises.get_all_exercises()
        return JSONResponse(
            status_code=HTTP_200_OK,
            content=exercises_data
        )
    except Exception as e:
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@exercises_router.get("/{id}")
def get_exercises(id: str):
    try:
        exercise_data = exercises.get_exercise_by_id(id)
        return JSONResponse(
            status_code=HTTP_200_OK,
            content=exercise_data
        )
    except Exception as e:
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )
    
@exercises_router.post("/add")
def add_exercise(exercise: dict):
    try:
        exercises.add_exercise(exercise)
        return JSONResponse(
            status_code=HTTP_200_OK,
            content={"message": "Exercise added successfully"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )
