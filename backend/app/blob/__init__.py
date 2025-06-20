from pydantic import BaseModel
from typing import Optional

class VideoFormData(BaseModel):
    id: str
    title: str
    desc: str
    userId: str
    videoLink: str