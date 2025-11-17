from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth.service import create_access_token, bcrypt_context
from src.auth.models import Users
from src.auth.service import create_user
from src.auth.schemas import UserRegistration



router = APIRouter(tags=['Register 🔐'])

db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def register_user(
    new_user: UserRegistration,
    db: db_dependency
):
    return await create_user(db=db, new_user=new_user)