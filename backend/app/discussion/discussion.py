from fastapi import HTTPException
from app.discussion import BaseForum
from app.helpers.firebase import db

class Discussion:
    def __init__(self):
        self.db = db

    def get_all_discussions(self):
        discussions_ref = db.collection("discussions")
        docs = discussions_ref.stream()
        print(docs)
        if not docs:
            raise HTTPException(status_code=404, detail="No forum found")
        return [doc.to_dict() for doc in docs]

    def get_discussion(self, uid: str):
        doc = self.db.collection("discussions").document(uid).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Forum not found")
        return doc.to_dict()
    
    def add_discussion(self, forum: BaseForum):
        try:
            doc_ref = self.db.collection("discussions").document()
            forum_dict = forum.dict()
            forum_dict["id"] = doc_ref.id  # Assign generated ID
            doc_ref.set(forum_dict)
            return forum_dict
        except Exception as e:
            print(f"Error adding event: {e}")
            raise HTTPException(status_code=500, detail="Failed to add forum.")
        
    def update_discussion(self, forum: BaseForum):
        try:
            doc_ref = self.db.collection("discussions").document(forum.id)
            
            # Check if document exists first (optional but good practice)
            if not doc_ref.get().exists:
                raise HTTPException(status_code=404, detail="Forum not found.")
            
            # Update the document fields with the event data
            doc_ref.update(forum.dict())
            return forum
        except Exception as e:
            print(f"Error updating event: {e}")
            raise HTTPException(status_code=500, detail="Failed to update forum.")
        
    def delete_discussion(self, forum_id: str):
        try:
            self.db.collection("discussions").document(forum_id).delete()
        except Exception as e:
            print(f"Error updating event: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete forum.")