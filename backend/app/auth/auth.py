from fastapi import Header
from app.helpers.firebase import firebase_auth

class Auth:
    def __init__(self):
        pass

    def authenticate(self, authorization: str = Header(...)) -> str:
        """
        Authenticate a user using Firebase ID token.
        """
        if not authorization:
            raise ValueError("Authorization header is missing")

        # Extract the token from the authorization header
        token = authorization.split("Bearer ")[1]
        
        try:
            # Verify the token with Firebase
            decoded_token = firebase_auth.verify_id_token(token)
            uid: str = decoded_token.get("uid")
            return uid
        except Exception as e:
            raise ValueError(f"Authentication failed: {str(e)}")