import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.user.user_api import user_router

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