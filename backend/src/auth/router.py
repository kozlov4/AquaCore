from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth.service import create_access_token
from src.auth.service import create_user, get_current_user, authenticate_user
from src.auth.schemas import UserRegistration


router = APIRouter(tags=['Auth 🔐'], prefix=  "/auth")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def register_user(
    new_user: UserRegistration,
    db: db_dependency
):
    return await create_user(db=db, new_user=new_user)


@router.post("/login/")
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(db, form_data.username, form_data.password)
    
    token = create_access_token(
        subject=user.email,
        id=user.id,
        role=user.role.value,
        expires_delta=timedelta(minutes=30),
        
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user.email,
    }

# TODO /auth/change-password /auth/change-email