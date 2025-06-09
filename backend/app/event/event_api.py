from app.event import BaseEvent
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

@event_router.get("/{uid}")
def get_single_event(uid: str):
    event_data = event.get_event(uid)
    return event_data

@event_router.post("/")
def add_event(eventObject: BaseEvent):
    return event.add_event(eventObject)

@event_router.put("/{uid}")
def update_event(uid: str, eventObject: BaseEvent):
    eventObject.id = uid
    return event.update_event(eventObject)
