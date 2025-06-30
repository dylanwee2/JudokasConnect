from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.diet_plan import BaseDietPlan, PersonalDietPlanData
from app.helpers.firebase import db

class Diet_plan:
    def __init__(self):
        self.db = db

    def get_user_diet_plan(self, uid: str):
        doc = self.db.collection("diet_plan").document(uid).get()
        if not doc.exists:
            return JSONResponse(status_code=200, content={"diet_plan": None, "message": "Diet Plan not found"})
        return doc.to_dict()
    
    def add_user_diet_plan(self, diet_plan: PersonalDietPlanData):
        try:
            doc_ref = self.db.collection("diet_plan").document(diet_plan.userId)
            diet_plan_dict = diet_plan.dict()
            doc_ref.set(diet_plan_dict)
            return diet_plan_dict
        except Exception as e:
            print(f"Error adding event: {e}")
            raise HTTPException(status_code=500, detail="Failed to add diet plan.")
        
    def update_diet_plan(self, diet_plan: PersonalDietPlanData):
        try:
            doc_ref = self.db.collection("diet_plan").document(diet_plan.userId)
            
            # Check if document exists first (optional but good practice)
            if not doc_ref.get().exists:
                raise HTTPException(status_code=404, detail="Forum not found.")
            
            # Update the document fields with the event data
            doc_ref.update(diet_plan.dict())
            return diet_plan
        except Exception as e:
            print(f"Error updating event: {e}")
            raise HTTPException(status_code=500, detail="Failed to update forum.")