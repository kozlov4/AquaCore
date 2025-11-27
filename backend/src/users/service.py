import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.users.models import Users, User_Profiles
from src.media.models import Media
from src.aquariums.models import Aquariums
from src.users.schemas import UserUpdate
from src.monitoring.models import Activity_Log
from src.social.models import Posts
from src.tasks.models import Tasks, Task_Completions
from src.catalog.models import Knowledge_Base_Articles

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

def delete_user_by_id(db:Session, user_id:int):
    user = get_user_by_id(db=db, user_id=user_id)

    db.query(Media).filter(
            Media.attachable_type == "user_profile",
            Media.attachable_id == user_id
        ).delete(synchronize_session=False)
    

    user_aquarium_ids = db.query(Aquariums.id).filter(Aquariums.user_id == user_id).all()
    aquarium_ids = [id for (id,) in user_aquarium_ids]

    if aquarium_ids:
        db.query(Media).filter(
            Media.attachable_type == "aquarium",
            Media.attachable_id.in_(aquarium_ids)
        ).delete(synchronize_session=False)
        
        db.query(Activity_Log).filter(
            Activity_Log.aquarium_id.in_(aquarium_ids)
        ).delete(synchronize_session=False)

    user_post_ids = db.query(Posts.id).filter(Posts.user_id == user_id).all()
    post_ids = [id for (id,) in user_post_ids]

    if post_ids:
        db.query(Media).filter(
            Media.attachable_type == "post",
            Media.attachable_id.in_(post_ids)
        ).delete(synchronize_session=False)


    user_task_ids = db.query(Tasks.id).filter(Tasks.user_id == user_id).all()
    task_ids = [id for (id,) in user_task_ids]

    if task_ids:
        db.query(Task_Completions).filter(
            Task_Completions.task_id.in_(task_ids)
        ).delete(synchronize_session=False)
        db.query(Tasks).filter(
            Tasks.id.in_(task_ids)
        ).delete(synchronize_session=False)

    db.query(Knowledge_Base_Articles).filter(
            Knowledge_Base_Articles.author_id == user_id
        ).delete(synchronize_session=False)

    db.delete(user.user_profile)
    db.delete(user.user_settings)
    db.delete(user)
    db.commit()

    return {"message": "Успішне видалення"}

def get_all_users(db: Session, user_id:int):
    curr_user = get_user_by_id(db, user_id)
    if curr_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

    users = db.query(Users).all()
    return users

def user_ban(db:Session,user_id:int ,admin_id:int):
    admin = get_user_by_id(db, admin_id)
    if admin.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

    user_to_ban = get_user_by_id(db, user_id)

    user_to_ban.is_active = False
    db.commit()
    db.refresh(user_to_ban)
    return user_to_ban

