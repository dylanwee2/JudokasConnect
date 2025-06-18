from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException
from azure.storage.blob import BlobServiceClient
from uuid import uuid4
import os
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).resolve().parent.parent.parent / "env" / ".env.local"
load_dotenv(dotenv_path=env_path)

AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
CONTAINER_NAME = "judokasconnectphoto"

if not AZURE_CONNECTION_STRING:
    raise RuntimeError("AZURE_CONNECTION_STRING is not set in the environment!")

# Initialize Azure Blob Storage client
try:
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)
    print(f"Initialized Azure BlobServiceClient for container '{CONTAINER_NAME}'")
except Exception as e:
    print(f"Error initializing BlobServiceClient: {e}")
    raise

# Create container if it doesn't exist
try:
    container_client.create_container()
    print(f"Container '{CONTAINER_NAME}' created (or already exists)")
except Exception as e:
    print(f"Container creation skipped or error: {e}")

image_router = APIRouter(
    prefix="/images",
    tags=["images"],
)

@image_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate a unique filename to avoid collisions
        filename = f"{uuid4()}_{file.filename}"

        # Upload the file to Azure Blob Storage
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file.file, overwrite=True)

        image_url = blob_client.url
        return {"url": image_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

@image_router.get("/list")
async def list_images():
    try:
        blobs = container_client.list_blobs()
        images = []
        for blob in blobs:
            blob_client = container_client.get_blob_client(blob)
            images.append({
                "name": blob.name,
                "url": blob_client.url
            })
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list images: {str(e)}")
