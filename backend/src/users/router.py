# src/users/router.py
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.users.service import get_user_by_id, update_user_full, delete_user_by_id
from src.users.schemas import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["Users 👤"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/me/", response_model=UserRead)
def read_users_me(
    current_user: user_dependency,
    db: db_dependency
):
    return get_user_by_id(db=db, user_id=current_user.get("user_id"))

@router.put("/me/", response_model=UserRead)
def update_user(
    db:db_dependency,
    current_user: user_dependency,
    update_data: UserUpdate
):
    return update_user_full(
        db=db, 
        user_id=current_user.get("user_id"), 
        update_data=update_data)

@router.delete("/me/")
def delete_user(
    db:db_dependency,
    current_user: user_dependency,
):
    return delete_user_by_id(
        db=db, 
        user_id=current_user.get("user_id"))