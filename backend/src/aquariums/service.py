import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.aquariums.schemas import AquariumCreate, AquariumUpdate
from src.users.service import get_user_by_id
from src.aquariums.models import Aquariums
from src.users.models import Users
from src.tasks.models import Tasks
from src.media.models import Media
from src.monitoring.models import Activity_Log

db_dependency = Annotated[Session, Depends(get_db)]



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


def update_aquarium(db: Session, aquarium_id: int, aquarium_data: AquariumUpdate, user_id: int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)
    user = get_user_by_id(db=db, user_id=user_id)

    if aquarium.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете змінювати чужі акваріуми"
        )

    update_data = aquarium_data.model_dump(exclude_unset=True)

    new_name = update_data.get("name")
    if new_name:
        existing = (
            db.query(Aquariums)
            .filter(
                Aquariums.user_id == user.id,
                func.lower(Aquariums.name) == new_name.lower(),
                Aquariums.id != aquarium.id 
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Name for aquarium already in use"
            )

    for key, value in update_data.items():
        setattr(aquarium, key, value)

    db.commit()
    db.refresh(aquarium)
    return aquarium


def delete_aquarium(db: Session, aquarium_id: int, user_id:int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)
    user = get_user_by_id(db=db, user_id=user_id)

    if aquarium.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете видаляти чужі акваріуми"
        )
    

    db.query(Media).filter(
        Media.attachable_type == "aquarium",
        Media.attachable_id == aquarium_id
    ).delete(synchronize_session=False)

    db.query(Activity_Log).filter(
        Activity_Log.aquarium_id == aquarium_id
    ).delete(synchronize_session=False)

    db.query(Tasks).filter(
        Tasks.aquarium_id == aquarium_id
    ).delete(synchronize_session=False)


    db.delete(aquarium)
    db.commit()

    return {"message": f"Акваріум '{aquarium.name}' успішно видалено"}


    