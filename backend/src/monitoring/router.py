from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.users.service import get_user_by_id, update_user_full, delete_user_by_id
from src.users.schemas import UserRead, UserUpdate
from src.aquariums.service import create_aquarium, get_aquarium, get_aquariums_by_user, update_aquarium, delete_aquarium
from src.aquariums.schemas import AquariumCreate, AquariumRead,  AquariumListResponse, AquariumUpdate

from src.monitoring.service import create_manual_measurement
from src.monitoring.schemas import ManualDataCreate

router = APIRouter(prefix="/measurements", tags=["Measurements 📈"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/manual/{aquarium_id}")
async def add_manual_measurements(
  db:db_dependency,
  data:ManualDataCreate,
  aquarium_id:int,
  user:user_dependency
):
  return create_manual_measurement(db=db, data=data, aquarium_id=aquarium_id, user_id=user.get("user_id"))
