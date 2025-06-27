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
    
    def get_subexercises(self, id):
        doc = db.collection("exercises").document(id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Exercise with ID {id} not found")

        data = doc.to_dict()
        subexercises = data.get("list_exercises", [])
        return subexercises
    
    def add_exercise(self, exercise):
        if not exercise or not isinstance(exercise, dict):
            raise HTTPException(status_code=400, detail="Invalid exercise data")

        # Step 1: Add the exercise and let Firestore generate the ID
        doc_ref = db.collection("exercises").add(exercise)
        doc_id = doc_ref[1].id  # .add() returns (write_result, document_reference)

        # Step 2: Add the generated ID into the exercise data
        exercise["id"] = doc_id

        # Step 3: Update the document to include its own ID
        db.collection("exercises").document(doc_id).update({"id": doc_id})

        return {"message": f"Exercise added successfully with ID {doc_id}", "id": doc_id}
    
    def get_exercise_by_id(self, id):
        doc = db.collection("exercises").document(id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Exercise with ID {id} not found")
        return doc.to_dict()

