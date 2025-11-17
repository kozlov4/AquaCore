import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.users.models import Users, User_Profiles

from src.users.schemas import UserUpdate

db_dependency = Annotated[Session, Depends(get_db)]


def get_user_by_id(db:db_dependency, user_id:int):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Could not validate user id')
    return user

def update_user_full(db: Session, user_id: int, update_data: UserUpdate):
    user = get_user_by_id(db=db, user_id=user_id)

    if update_data.user_profile:
        profile_data = update_data.user_profile.dict(exclude_unset=True)
        for key, value in profile_data.items():
            setattr(user.user_profile, key, value)

    if update_data.user_settings:
        settings_data = update_data.user_settings.dict(exclude_unset=True)
        for key, value in settings_data.items():
            setattr(user.user_settings, key, value)
    
    existing_nickname = (
        db.query(User_Profiles)
        .filter(
            func.lower(User_Profiles.nickname) == user.user_profile.nickname.lower(),
            User_Profiles.user_id != user.id
        )
        .first()
    )

    if existing_nickname:
        raise  HTTPException(status_code=status.HTTP_409_CONFLICT, detail='nickname already in use')

    db.commit()
    db.refresh(user)
    return user