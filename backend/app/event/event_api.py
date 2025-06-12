from app.event import BaseEvent, EventAttendance
from app.event.event import Event
from fastapi import FastAPI, APIRouter, Depends

event = Event()

event_router = APIRouter(
    prefix="/api/events",
    tags=["events"],
)

@event_router.get("/")
def get_all_event():
    event_data = event.get_all_events()
    return event_data

@event_router.get("/get_event/{uid}")
def get_single_event(uid: str):
    event_data = event.get_event(uid)
    return event_data

@event_router.post("/add_event")
def add_event(eventObject: BaseEvent):
    return event.add_event(eventObject)

@event_router.put("/update_event/{uid}")
def update_event(uid: str, eventObject: BaseEvent):
    eventObject.id = uid
    return event.update_event(eventObject)

@event_router.get("/get_event_attendance/{uid}")
def get_event_attendance(uid: str):
    event_data = event.get_event_attendance(uid)
    return event_data

@event_router.post("/add_event_attendance")
def add_event(event_attendance: EventAttendance):
    return event.add_attendance(event_attendance)

@event_router.put("/update_event_attendance/{uid}")
def update_event_attendance(uid: str, event_attendance: EventAttendance):
    event_attendance.id = uid
    return event.update_event_attendance(event_attendance)
