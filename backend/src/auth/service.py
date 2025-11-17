import os
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
from jose import jwt, JWTError
from starlette import status
from fastapi.security import OAuth2PasswordBearer
from src.database import get_db
from sqlalchemy.orm import Session
from src.auth.schemas import UserRegistration
from src.auth.models import Users, User_Settings, User_Profiles


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/login/")
db_dependency = Annotated[Session, Depends(get_db)]

def create_access_token(subject: str, id: int, expires_delta: timedelta):
    encode = {'sub': subject, 'id': id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'user_id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')


async def create_user(db:db_dependency, new_user: UserRegistration):
    get_user_by_email(db=db, email = new_user.email)
    
    create_user_model = Users(
        email = new_user.email,
        hashed_password = bcrypt_context.hash(new_user.password) 
    )

    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)


    user_settings = User_Settings(
        user_id=create_user_model.id 
    )
    db.add(user_settings)


    user_profile = User_Profiles(
        user_id=create_user_model.id,
        nickname=None,
        first_name=None,
        last_name=None
    )
    db.add(user_profile)

    db.commit()

    token = create_access_token(
        subject=create_user_model.email,
        id=create_user_model.id,
        expires_delta=timedelta(minutes=30)
    )

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_name": create_user_model.email
    }


def get_user_by_email(db:db_dependency, email:str):
    existing_user = db.query(Users).filter(Users.email == email).first()
    if existing_user:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use.")