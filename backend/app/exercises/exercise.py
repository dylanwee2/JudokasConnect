from fastapi import FastAPI, HTTPException
from app.helpers.firebase import db

class Exercises:
    def __init__(self):
        self.db = db
    
    def get_all_exercises(self):
        exercises_ref = db.collection("exercises")
        docs = exercises_ref.stream()
        print(docs)
        if not docs:
            raise HTTPException(status_code=404, detail="No exercises found")
        return [doc.to_dict() for doc in docs]