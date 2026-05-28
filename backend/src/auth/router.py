import urllib.parse
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.models.db_helper import db_helper
from . import service
from .schemas import UserLogin, RefreshTokenRequest
from .schemas import UserRegistration, TokenInfo
from .service import register_user, refresh_access_token

router = APIRouter(tags=["Authentication"])


FRONTEND_URL = "/aquariums"



@router.get("/google/login")
async def google_login():

    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": settings.google_client_id,
        "response_type": "code",
        "redirect_uri": settings.google_redirect_uri,
        "scope": "openid email profile",
        "access_type": "offline",
    }
    url = f"{google_auth_url}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)


@router.get("/google/callback")
async def google_callback(
    code: str,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    token_url = "https://oauth2.googleapis.com/token"

    token_data = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.google_redirect_uri,
    }

    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Google token error",
            )

        google_access_token = token_response.json().get("access_token")

        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"

        headers = {
            "Authorization": f"Bearer {google_access_token}"
        }

        user_response = await client.get(
            user_info_url,
            headers=headers,
        )

        if user_response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Google user info error",
            )

        user_info = user_response.json()

    token_info = await service.process_google_user(
        session,
        user_info,
    )

    params = urlencode({
        "access_token": token_info.access_token,
        "refresh_token": token_info.refresh_token,
        "token_type": token_info.token_type,
    })

    return RedirectResponse(
        url=f"{FRONTEND_URL}/google/callback?{params}",
        status_code=302,
    )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def user_registration(
    user_data: UserRegistration,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await register_user(session=session, user_in=user_data)


@router.post("/login")
async def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    user_data = UserLogin(email=form_data.username, password=form_data.password)
    return await service.user_login(session=session, user_in=user_data)


@router.post("/refresh", response_model=TokenInfo)
async def refresh_jwt_tokens(
    token_data: RefreshTokenRequest,
    session: AsyncSession = Depends(db_helper.session_dependency),
):

    return await refresh_access_token(
        session=session, refresh_token=token_data.refresh_token
    )
