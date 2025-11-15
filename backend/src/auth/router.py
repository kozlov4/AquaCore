from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth.service import create_access_token, bcrypt_context
from src.auth.models import User



router_login = APIRouter(tags=['Login 🔐'])

db_dependency = Annotated[Session, Depends(get_db)]


@router_login.get("/info")
async def get_info(db:db_dependency):
  user = db.query(User).all()
  return list[user]