from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.users.service import get_user_by_id, update_user_full, delete_user_by_id
from src.users.schemas import UserRead, UserUpdate
from src.aquariums.service import create_aquarium
from src.aquariums.schemas import AquariumCreate

router = APIRouter(prefix="/aquariums", tags=["Aquariums 🪼"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/", status_code=201)
async def create(
  db:db_dependency,
  aquarium:AquariumCreate,
  user:user_dependency
):
  return create_aquarium(db=db, aquarium=aquarium, user_id=user.get("user_id"))