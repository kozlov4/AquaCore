import os
from typing import Annotated
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.users.models import Users

db_dependency = Annotated[Session, Depends(get_db)]


def get_user_by_id(db:db_dependency, user_id:int):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Could not validate user id')
    return user