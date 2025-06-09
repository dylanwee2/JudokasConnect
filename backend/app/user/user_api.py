from app.user.user import User
from app.user import UserCreate, UserResponse
from fastapi import FastAPI, APIRouter, Depends
from app.auth.auth import Auth

user = User()
auth = Auth()

user_router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

@user_router.get("/{uid}")
def get_user(uid: str):
    user_data = user.get_user(uid)
    return user_data

@user_router.post("")
def create_users(userObject: UserCreate, userId: str = Depends(auth.authenticate)) -> UserResponse:
    userObject.uid = userId
    user_data = user.create_users(userObject)
    result = {
        "data": user_data
    }
    return result