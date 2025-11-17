import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.aquariums.schemas import AquariumCreate
from src.users.service import get_user_by_id
from src.aquariums.models import Aquariums
from src.users.models import Users

db_dependency = Annotated[Session, Depends(get_db)]


# 
# update_aquarium(db: Session, aquarium_id: int, aquarium_data: AquariumUpdate)
# delete_aquarium(db: Session, aquarium_id: int)


def create_aquarium(db: Session, aquarium: AquariumCreate, user_id: int):
  user = get_user_by_id(db=db, user_id=user_id)

  new_aquarium = Aquariums(
        user_id=user.id,
        name=aquarium.name,
        volume_l=aquarium.volume_l,
        length_cm=aquarium.length_cm,
        width_cm=aquarium.width_cm,
        height_cm=aquarium.height_cm,
        water_type=aquarium.water_type,
        start_date=aquarium.start_date,
        description=aquarium.description,
        ground_type=aquarium.ground_type,
        lighting_model=aquarium.lighting_model,
        filter_model=aquarium.filter_model
    )

  existing_aqua_name = (
      db.query(Aquariums)
      .filter(
          Aquariums.user_id == user.id,
          func.lower(Aquariums.name) == aquarium.name.lower(),
      )
      .first()
  )
  
  if existing_aqua_name:
      raise  HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Name for aquarium already in use')

  db.add(new_aquarium)
  db.commit()
  db.refresh(new_aquarium)

  return {
        "message": "Акваріум успішно додано",
    }

def  get_aquarium(db: Session, aquarium_id: int):
   aquarium = db.query(Aquariums).filter(Aquariums.id == aquarium_id).first()
   if aquarium is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Акваріум не знайдено')
   return aquarium

def get_aquariums_by_user(db: Session, user_id: int):
    user = get_user_by_id(db=db, user_id=user_id)

    aquariums = db.query(Aquariums).filter(Aquariums.user_id == user.id).all()
    return {"aquariums": aquariums}
