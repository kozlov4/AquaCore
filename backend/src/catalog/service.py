import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.catalog.schemas import InhabitantsCreate, InhabitantsUpdate
from src.users.service import get_user_by_id
from src.catalog.models import Catalog_Inhabitants, Catalog_Diseases


db_dependency = Annotated[Session, Depends(get_db)]

def create_new_inhabitant_in_db(db: Session, inhabitant: InhabitantsCreate, user_id: int):
    user = get_user_by_id(db, user_id)
    if user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

    new_inhabitant = Catalog_Inhabitants(
        type = inhabitant.type,
        name = inhabitant.name,
        species = inhabitant.species,
        description = inhabitant.description,
        image_url = inhabitant.image_url,
        size_cm = inhabitant.size_cm,
        aggressiveness= inhabitant.aggressiveness,
        lifespan_years = inhabitant.lifespan_years,
        feeding_frequency = inhabitant.feeding_frequency,
        feeding_type = inhabitant.feeding_type,
        min_tank_size_l = inhabitant.min_tank_size_l,
        min_water_volume_l = inhabitant.min_water_volume_l,
        aeration_needed = inhabitant.aeration_needed,
        ph_min = inhabitant.ph_min,
        ph_max = inhabitant.ph_max,
        temp_min_c = inhabitant.temp_min_c,
        temp_max_c = inhabitant.temp_max_c,
        dkh_min = inhabitant.dkh_min,
        dkh_max = inhabitant.dkh_max,
        gh_min = inhabitant.gh_min,
        gh_max = inhabitant.gh_max,
    )

    existing_new_inhabitant = (db.query(Catalog_Inhabitants)
                               .filter(Catalog_Inhabitants.name == new_inhabitant.name)
                               .first())
    if existing_new_inhabitant:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Name for inhabitant already in use')

    db.add(new_inhabitant)
    db.commit()
    db.refresh(new_inhabitant)

    return {
        "message": "Запис успішно додано",
        "new_inhabitant": new_inhabitant,
    }

def update_inhabitant_in_db(
    db: Session,
    inhabitant_id: int,
    inhabitant_data: InhabitantsUpdate,
    user_id: int
):

    user = get_user_by_id(db, user_id)
    db_inhabitant = get_inhabitant_by_id(db, inhabitant_id)

    if user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate user'
        )

    update_data = inhabitant_data.model_dump(exclude_unset=True)

    new_name = update_data.get("name")
    if new_name:
        existing = (
            db.query(Catalog_Inhabitants)
            .filter(
                func.lower(Catalog_Inhabitants.name) == new_name.lower(),
                Catalog_Inhabitants.id != db_inhabitant.id
            )
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Name for inhabitant already in use"
            )

    for key, value in update_data.items():
        setattr(db_inhabitant, key, value)

    db.commit()
    db.refresh(db_inhabitant)
    return db_inhabitant


def  get_inhabitant_by_id(db: Session, inhabitant_id: int):
   inhabitant = (db.query(Catalog_Inhabitants).
                 filter(Catalog_Inhabitants.id == inhabitant_id).
                 first())
   if inhabitant is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Inhabitant не знайдено')
   return inhabitant

def get_all_inhabitants(db: Session, user_id):
    inhabitants = db.query(Catalog_Inhabitants).all()
    return inhabitants

def get_all_diseases(db: Session, user_id):
    diseases = db.query(Catalog_Diseases).all()
    return diseases