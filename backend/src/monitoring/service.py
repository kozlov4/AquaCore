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
from src.aquariums.service import get_aquarium
from src.monitoring.schemas import ManualDataCreate
from src.monitoring.models import Manual_Measurements

db_dependency = Annotated[Session, Depends(get_db)]

def create_manual_measurement(db: Session, data: ManualDataCreate, aquarium_id: int, user_id:int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)
    user = get_user_by_id(db=db, user_id=user_id)

    if aquarium.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете вносити тетси в чужі акваріуми"
        )
    
    new_manual_measurement = Manual_Measurements(
        aquarium_id=aquarium.id,
        ammonia=data.ammonia,
        nitrite=data.nitrite,
        nitrate=data.nitrate,
        gh=data.gh,
        kh=data.kh,
        phosphate=data.phosphate
    )


    db.add(new_manual_measurement)
    db.commit()
    db.refresh(new_manual_measurement)

    return {
        "message": "Тести успішно додані",
        "measurement": new_manual_measurement
    }


#get_measurements(db: Session, aquarium_id: int)