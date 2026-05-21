import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import Image
from core.models.db_helper import db_helper
from users.dependencies import get_current_user

router = APIRouter(tags=["Uploads"])


@router.post("/upload-image", dependencies=[Depends(get_current_user)])
async def upload_image(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Тільки JPEG, PNG або WEBP")

    try:
        result = cloudinary.uploader.upload(file.file, folder="aqua_projects")
        secure_url = result.get("secure_url")

        new_image = Image(image_url=secure_url)
        session.add(new_image)
        await session.commit()
        await session.refresh(new_image)

        return {"image_id": new_image.id, "image_url": secure_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")
