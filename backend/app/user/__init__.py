from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    uid: Optional[str] = None
    email: str
    name: str
    age: Optional[str] = None

class UserResponse(BaseModel):
    data: UserCreate