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

@user_router.put("/update_user/{uid}")
def update_user(uid: str, userObject: UserCreate, userId: str = Depends(auth.authenticate)):
    userObject.uid = uid  # Ensure the uid is set
    return user.update_user(userObject)



@user_router.delete("/delete_user/{uid}")
def delete_user(uid: str, userId: str = Depends(auth.authenticate)):
    # Update your User class to accept uid as a string
    return user.delete_user(uid)
    