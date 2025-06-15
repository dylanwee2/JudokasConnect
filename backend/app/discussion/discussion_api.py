from app.discussion.discussion import BaseForum
from app.discussion.discussion import Discussion
from fastapi import APIRouter

discussion = Discussion()

discussion_router = APIRouter(
    prefix="/api/discussions",
    tags=["discussions"],
)

@discussion_router.get("/")
def get_all_event():
    discussions_data = discussion.get_all_discussions()
    return discussions_data

@discussion_router.get("/get_discussion/{uid}")
def get_single_event(uid: str):
    discussion_data = discussion.get_discussion(uid)
    return discussion_data

@discussion_router.post("/add_dicussion")
def add_event(forumObject: BaseForum):
    return discussion.add_discussion(forumObject)

@discussion_router.put("/update_discussion/{uid}")
def update_event(uid: str, forumObject: BaseForum):
    forumObject.id = uid
    return discussion.update_discussion(forumObject)