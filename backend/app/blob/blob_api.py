from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from azure.storage.blob import BlobServiceClient
from uuid import uuid4
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional
from app.blob import VideoFormData
from app.user.user import User

user = User()

# Load environment variables
env_path = Path(__file__).resolve().parent.parent.parent / "env" / ".env.local"
load_dotenv(dotenv_path=env_path)

AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
CONTAINER_NAME = "judokasconnectphoto"

if not AZURE_CONNECTION_STRING:
    raise RuntimeError("AZURE_CONNECTION_STRING is not set in the environment!")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(CONTAINER_NAME)

# Create container if needed
try:
    container_client.create_container()
except:
    pass  # Container already exists

image_router = APIRouter(
    prefix="/api/images",
    tags=["images"],
)

@image_router.post("/upload", response_model=VideoFormData)
async def upload_image(
    file: UploadFile = File(...),
    id: Optional[str] = Form(""),
    title: str = Form(...),
    desc: str = Form(...),
    userId: str = Form(...),
    username: str = Form(...)
):
    try:
        filename = f"{uuid4()}_{file.filename}"

        metadata = {
            "id": filename,
            "title": title,
            "desc": desc,
            "userId": userId,
            "username": username
        }
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file.file, overwrite=True, metadata=metadata)

        image_url = blob_client.url

        print("[UPLOAD SUCCESS]", title, desc, userId)

        return VideoFormData(
            id=filename,
            title=title,
            desc=desc,
            userId=userId,
            username=username,
            videoLink=image_url
        )

    except Exception as e:
        print("[UPLOAD ERROR]", e)
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

@image_router.get("/list")
async def list_images():
    try:
        blobs = container_client.list_blobs()
        images = []

        for blob in blobs:
            blob_client = container_client.get_blob_client(blob.name)
            props = blob_client.get_blob_properties()
            metadata = props.metadata or {}

            userData = user.get_user(metadata.get("userId", ""))

            images.append({
                "name": blob.name,
                "url": blob_client.url,
                "id": metadata.get("id", ""),
                "title": metadata.get("title", ""),
                "desc": metadata.get("desc", ""),
                "userId": metadata.get("userId", ""),
                "username": metadata.get("username", "")
            })

        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list images: {str(e)}")
