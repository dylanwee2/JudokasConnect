import os
import json
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore

if "FIREBASE_SERVICE_ACCOUNT" in os.environ:
    # We're running on Render – load from env variable
    service_account_info = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
    cred = credentials.Certificate(service_account_info)
else:
    # Local development – load from file path
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cred_path = os.path.join(base_dir, "..", "env", "judokasconnect-firebase-adminsdk-fbsvc-5e47eff3a2.json")
    cred = credentials.Certificate(cred_path)

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(cred)
db = firestore.client()