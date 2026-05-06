import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(tags=["Uploads"])


@router.post("/upload-image/")
def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Тільки JPEG, PNG або WEBP")

    try:
        result = cloudinary.uploader.upload(file.file, folder="aqua_projects")
        return {"image_url": result.get("secure_url")}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка Cloudinary: {str(e)}")
