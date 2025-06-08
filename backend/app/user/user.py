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

