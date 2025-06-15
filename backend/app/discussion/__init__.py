from pydantic import BaseModel
from typing import Optional

class BaseForum(BaseModel):
    id: Optional[str] = None
    title: str
    username: str
    userId: str
    comments: Optional[list[str]] = None
    category: str
    content: str
