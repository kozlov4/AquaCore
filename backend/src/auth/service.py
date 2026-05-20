import random
import string

import jwt
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import User
from .schemas import TokenInfo
from .schemas import UserRegistration, UserLogin
from .utils import hash_password, encode_jwt
from .utils import validate_password, decode_jwt


async def generate_unique_nickname(session: AsyncSession, base_name: str) -> str:
    clean_name = "".join(base_name.split()).lower() if base_name else "aquarist"

    while True:
        random_suffix = "".join(random.choices(string.digits, k=4))
        candidate_nickname = f"{clean_name}_{random_suffix}".lower()

        query = select(User).where(User.nickname == candidate_nickname).limit(1)
        result = await session.execute(query)

        if not result.scalar_one_or_none():
            return candidate_nickname


async def register_user(
    session: AsyncSession,
    user_in: UserRegistration,
) -> User:
    query = select(User).where(User.email == user_in.email).limit(1)
    result = await session.execute(query)

    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Помилка при реєстрації",
        )

    hashed_pwd = hash_password(user_in.password)

    unique_nickname = await generate_unique_nickname(session, user_in.name)

    new_user = User(
        email=user_in.email,
        name=user_in.name,
        nickname=unique_nickname,
        avatar_id=11,
        password_hash=hashed_pwd.decode("utf-8"),
    )

    session.add(new_user)
    await session.commit()

    await session.refresh(new_user)

    return new_user


async def user_login(
    session: AsyncSession,
    user_in: UserLogin,
) -> TokenInfo:
    stmt = select(User).where(User.email == user_in.email).limit(1)
    result = await session.execute(stmt)
    user: User | None = result.scalar_one_or_none()

    if not user or not validate_password(
        user_in.password,
        user.password_hash.encode("utf-8"),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Невірний email або пароль"
        )

    access_token = encode_jwt(
        payload={"sub": str(user.id), "type": "access"}, expire_minutes=15
    )
    refresh_token = encode_jwt(
        payload={"sub": str(user.id), "type": "refresh"}, expire_minutes=60 * 24 * 30
    )

    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
    )


async def refresh_access_token(session: AsyncSession, refresh_token: str) -> TokenInfo:
    try:
        payload = decode_jwt(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type"
            )

        user_id = payload.get("sub")

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сесія закінчилася.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Недійсний токен"
        )

    stmt = select(User).where(User.id == int(user_id)).limit(1)
    result = await session.execute(stmt)
    user: User | None = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    new_access_token = encode_jwt(
        payload={"sub": str(user.id), "type": "access"}, expire_minutes=15
    )
    new_refresh_token = encode_jwt(
        payload={"sub": str(user.id), "type": "refresh"}, expire_minutes=60 * 24 * 30
    )

    return TokenInfo(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="Bearer",
    )


async def process_google_user(session: AsyncSession, user_info: dict) -> TokenInfo:
    email = user_info.get("email")
    name = user_info.get("name")

    stmt = select(User).where(User.email == email).limit(1)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        unique_nickname = await generate_unique_nickname(session, name)

        random_pwd = "".join(random.choices(string.ascii_letters + string.digits, k=20))
        hashed_pwd = hash_password(random_pwd)

        user = User(
            email=email,
            name=name,
            nickname=unique_nickname,
            avatar_id=11,
            password_hash=hashed_pwd.decode("utf-8"),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    access_token = encode_jwt(
        payload={"sub": str(user.id), "type": "access"}, expire_minutes=15
    )
    refresh_token = encode_jwt(
        payload={"sub": str(user.id), "type": "refresh"}, expire_minutes=60 * 24 * 30
    )

    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
    )
