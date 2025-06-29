from fastapi import FastAPI, HTTPException
from app.user import UserCreate
from app.helpers.firebase import db

class User:
    def __init__(self):
        self.db = db
    
    def get_user(self, uid: str):
        doc = self.db.collection("users").document(uid).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        return doc.to_dict()

    def create_users(self, user: UserCreate) -> UserCreate:
        doc_ref = self.db.collection("users").document(user.uid)
        doc_ref.set(user.dict())
        return user
    
    def update_user(self, user: UserCreate):
        try:
            doc_ref = self.db.collection("users").document(user.uid)
            
            # Check if document exists first (optional but good practice)
            if not doc_ref.get().exists:
                raise HTTPException(status_code=404, detail="User not found.")
            
            # Update the document fields with the event data
            doc_ref.update(user.dict())
            return user
        except Exception as e:
            print(f"Error updating user: {e}")
            raise HTTPException(status_code=500, detail="Failed to update user.")
        
    def delete_user(self, uid: str):
        try:
            self.db.collection("users").document(uid).delete()
        except Exception as e:
            print(f"Error delete user: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete user.")
