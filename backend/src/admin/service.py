import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.users.models import Users

db_dependency = Annotated[Session, Depends(get_db)]


def check_admin(db:db_dependency, admin_id):
    admin = db.query(Users).filter(Users.id == admin_id).first()
    if admin is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    if admin.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Only admin can access this resource',
        )
    return admin