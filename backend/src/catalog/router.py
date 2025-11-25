from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.catalog.schemas import InhabitantsCreate, InhabitantsUpdate
from src.database import get_db
from src.auth.service import get_current_user
from src.catalog.service import  create_new_inhabitant_in_db, update_inhabitant_in_db

router = APIRouter(prefix="/admin/catalog/inhabitants", tags=["Inhabitants 🗒"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/", status_code=201)
async def create_new_inhabitant(
        db:db_dependency,
        inhabitant: InhabitantsCreate,
        user:user_dependency
):
    return create_new_inhabitant_in_db(
        db=db,
        inhabitant=inhabitant,
        user_id=user.get("user_id")
    )

@router.put("/{inhabitant_id}")
async def update_inhabitant(
    db:db_dependency,
    inhabitant_id:int,
    inhabitant: InhabitantsUpdate,
    user:user_dependency
):
    return update_inhabitant_in_db(
        db=db,
        inhabitant_id=inhabitant_id,
        inhabitant_data=inhabitant,
        user_id=user.get("user_id"))
