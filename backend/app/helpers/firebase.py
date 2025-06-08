import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore

# Correct credential path handling
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(base_dir, ".." ,"env", "judokasconnect-firebase-adminsdk-fbsvc-5e47eff3a2.json")
cred = credentials.Certificate(cred_path)

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(cred)
db = firestore.client()