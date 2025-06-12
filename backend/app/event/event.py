from fastapi import HTTPException
from app.event import BaseEvent, EventAttendance
from app.helpers.firebase import db

class Event:
    def __init__(self):
        self.db = db

    def get_all_events(self):
        events_ref = db.collection("events")
        docs = events_ref.stream()
        print(docs)
        if not docs:
            raise HTTPException(status_code=404, detail="No events found")
        return [doc.to_dict() for doc in docs]

    def get_event(self, uid: str):
        doc = self.db.collection("events").document(uid).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        return doc.to_dict()
    
    def add_event(self, event: BaseEvent):
        try:
            doc_ref = self.db.collection("events").document()
            event_dict = event.dict()
            event_dict["id"] = doc_ref.id  # Assign generated ID
            doc_ref.set(event_dict)
            return event_dict
        except Exception as e:
            print(f"Error adding event: {e}")
            raise HTTPException(status_code=500, detail="Failed to add event.")
        
    def update_event(self, event: BaseEvent):
        try:
            doc_ref = self.db.collection("events").document(event.id)
            
            # Check if document exists first (optional but good practice)
            if not doc_ref.get().exists:
                raise HTTPException(status_code=404, detail="Event not found.")
            
            # Update the document fields with the event data
            doc_ref.update(event.dict())
            return event
        except Exception as e:
            print(f"Error updating event: {e}")
            raise HTTPException(status_code=500, detail="Failed to update event.")

    def get_event_attendance(self, uid: str):
        doc = self.db.collection("events_attendance").document(uid).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Event not found")
        return doc.to_dict()
        
    def add_attendance(self, event_attendance: EventAttendance):
        try:
            doc_ref = self.db.collection("events_attendance").document(event_attendance.id)
            event_attendance_dict = event_attendance.dict()
            doc_ref.set(event_attendance_dict)
            return event_attendance_dict
        except Exception as e:
            print(f"Error adding event_attendance: {e}")
            raise HTTPException(status_code=500, detail="Failed to add event_attendace.")
        
    def update_event_attendance(self, event_attendance: EventAttendance):
        try:
            doc_ref = self.db.collection("events_attendance").document(event_attendance.id)
            
            # Check if document exists first (optional but good practice)
            if not doc_ref.get().exists:
                raise HTTPException(status_code=404, detail="Event not found.")
            
            # Update the document fields with the event data
            doc_ref.update(event_attendance.dict())
            return event_attendance
        except Exception as e:
            print(f"Error updating event: {e}")
            raise HTTPException(status_code=500, detail="Failed to update event.")