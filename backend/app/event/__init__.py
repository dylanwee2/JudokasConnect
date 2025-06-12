from pydantic import BaseModel
from typing import Optional

class BaseEvent(BaseModel):
    id: Optional[str] = None  # optional, will be set by the database
    title: str
    start: str
    end: str = None  # optional
    userId: str  # Created by User
    allDay: bool

class EventAttendance(BaseModel):
    id: str
    title: str
    start: str
    end: str = None  # optional
    attendingList: list[str]
    NotAttendingList: list[str]
    allDay: bool
