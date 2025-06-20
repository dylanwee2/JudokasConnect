import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.user.user_api import user_router
from app.event.event_api import event_router
from app.exercises.exercise_api import exercises_router
from app.discussion.discussion_api import discussion_router
from app.video_analysis.video_analysis_api import video_analysis_router

app = FastAPI()

# Allow local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(event_router)
app.include_router(discussion_router)
app.include_router(exercises_router)
app.include_router(video_analysis_router)
