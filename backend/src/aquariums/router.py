from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.users.service import get_user_by_id, update_user_full, delete_user_by_id
from src.users.schemas import UserRead, UserUpdate
from src.aquariums.service import create_aquarium, get_aquarium, get_aquariums_by_user, update_aquarium, delete_aquarium
from src.aquariums.schemas import AquariumCreate, AquariumRead,  AquariumListResponse, AquariumUpdate

router = APIRouter(prefix="/aquariums", tags=["Aquariums 🪼"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=AquariumListResponse)
async def get_all_my_aquariums(
  db:db_dependency,
  user:user_dependency
):
  return get_aquariums_by_user(db=db, user_id=user.get("user_id"))

@router.get("/{aquarium_id}", response_model=AquariumRead)
async def get_aquarium_by_id(
  db:db_dependency,
  aquarium_id:int
):
  return get_aquarium(db=db, aquarium_id=aquarium_id)

@router.post("/", status_code=201)
async def create(
  db:db_dependency,
  aquarium:AquariumCreate,
  user:user_dependency
):
  return create_aquarium(db=db, aquarium=aquarium, user_id=user.get("user_id"))

@router.put("/{aquarium_id}")
async def update_my_aquarium(
  db:db_dependency,
  aquarium_id:int,
  aquarium_data: AquariumUpdate,
  user:user_dependency
):
  return update_aquarium(db=db, aquarium_id=aquarium_id, aquarium_data=aquarium_data, user_id=user.get("user_id"))

@router.delete("/{aquarium_id}")
async def delete_my_aquarium(
  db:db_dependency,
  aquarium_id:int,
  user:user_dependency
):
  return delete_aquarium(db=db, aquarium_id=aquarium_id, user_id=user.get("user_id"))