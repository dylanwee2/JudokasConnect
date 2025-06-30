from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    uid: Optional[str] = None
    email: str
    username: str
    age: Optional[str] = None
    bio: Optional[str] = None
    school: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    data: UserCreate