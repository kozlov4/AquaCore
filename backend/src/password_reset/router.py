from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi_mail import FastMail, ConnectionConfig

from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from core.config import settings
from .schemas import ForgotPasswordRequest, ResetPasswordRequest
from . import service

router = APIRouter(tags=["Reset Password"])

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
fm = FastMail(conf)


@router.post("/forgot-password/")
async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.forgot_password(
        request=request, background_tasks=background_tasks, session=session, fm=fm
    )


@router.post("/reset-password/")
async def reset_password(
    request: ResetPasswordRequest,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.reset_password(request=request, session=session)
