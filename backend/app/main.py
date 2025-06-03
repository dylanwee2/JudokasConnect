import os
from typing import Union
from fastapi import FastAPI
from components import test1
import firebase_admin
from firebase_admin import credentials, firestore

app = FastAPI()

# Correct credential path handling
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(base_dir, "env", "judokasconnect-firebase-adminsdk-fbsvc-5e47eff3a2.json")

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.get("/")
def main():
    return {"Hello": "test"}

@app.get("/users")
def get_users():
    users_ref = db.collection("users")
    docs = users_ref.stream()
    return {doc.id: doc.to_dict() for doc in docs}

if __name__ == "__main__":
    test1()