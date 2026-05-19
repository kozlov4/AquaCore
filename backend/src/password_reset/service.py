import logging
import random
from datetime import datetime, timedelta

from fastapi import BackgroundTasks, HTTPException
from fastapi_mail import FastMail, MessageSchema, MessageType
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from auth.utils import hash_password
from core.config import settings
from core.models import User
from .schemas import ForgotPasswordRequest, ResetPasswordRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession,
    fm: FastMail,
):
    query = select(User).where(User.email == request.email)
    user = await session.scalar(query)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Користувача з таким email не знайдено",
        )

    reset_code = str(random.randint(100000, 999999))
    expire_time = datetime.utcnow() + timedelta(minutes=15)

    user.reset_code = reset_code
    user.reset_code_expire = expire_time

    await session.commit()

    html_content = f"""
    <h2>AquaCore Support</h2>
    <p>Ваш код для відновлення пароля: <strong>{reset_code}</strong></p>
    <p>Код дійсний протягом 15 хвилин.</p>
    """

    message = MessageSchema(
        subject="Відновлення пароля",
        recipients=[user.email],
        body=html_content,
        subtype=MessageType.html,
    )

    if settings.environment.lower() == "production":
        logger.info("=" * 40)
        logger.info("📧 [MOCK EMAIL SYSTEM - AQUACORE]")
        logger.info(f"To: {user.email}")
        logger.info(f"Subject: Відновлення пароля")
        logger.info(f"Code: {reset_code}")
        logger.info("=" * 40)
    else:
        background_tasks.add_task(fm.send_message, message)

    return {"message": "Код відновлення надіслано"}


async def reset_password(request: ResetPasswordRequest, session: AsyncSession):
    query = select(User).where(User.email == request.email)
    user = await session.scalar(query)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Користувача з таким email не знайдено",
        )

    if user.reset_code != request.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невірний код відновлення",
        )

    if not user.reset_code_expire:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Термін дії коду минув або він не запитувався. Спробуйте ще раз.",
        )
    if request.new_password != request.repeat_new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ви неправильно ввели повторний пароль",
        )
    current_time = datetime.utcnow()

    db_expire_time = (
        user.reset_code_expire.replace(tzinfo=None)
        if user.reset_code_expire.tzinfo
        else user.reset_code_expire
    )

    if db_expire_time < current_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Термін дії коду минув. Спробуйте ще раз.",
        )

    hashed_pwd = hash_password(request.new_password)
    user.password_hash = hashed_pwd.decode("utf-8")

    user.reset_code = None
    user.reset_code_expire = None

    await session.commit()

    return {"message": "Пароль успішно змінено"}
