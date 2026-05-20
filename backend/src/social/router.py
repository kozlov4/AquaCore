from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users.dependencies import get_current_user
from . import service
from .schemas import (
    PostCategory,
    PostCardResponse,
    PostCreate,
    UsersCardResponse,
    PostResponse,
    CommentCreate,
    ReadNotificationsResponse,
    CreateReport,
    UserUpdateMeRequest,
    UserResponse,
    ChangePasswordRequest,
    ReadMyProfileResponse,
)

router = APIRouter(prefix="/social", tags=["Social"])


@router.get("/my_profile/", response_model=ReadMyProfileResponse)
async def get_my_profile(
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_my_profile(
        session=session,
        curr_user_id=curr_user_id,
    )


@router.get("/posts/", response_model=list[PostCardResponse])
async def get_posts(
    limit: int = Query(default=8, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    category: PostCategory = Query(
        default=PostCategory.all_posts, description="Сортування постів за категоріями"
    ),
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_posts(
        session=session,
        limit=limit,
        offset=offset,
        category=category,
        curr_user_id=curr_user_id,
    )


@router.get("/notifications/", response_model=list[ReadNotificationsResponse])
async def get_notifications(
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_notifications(
        session=session,
        curr_user_id=curr_user_id,
    )


@router.get("/{post_id}/", response_model=PostResponse)
async def get_post_by_id(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_post_by_id(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.get("/users/", response_model=list[UsersCardResponse])
async def search_users(
    curr_user_id=Depends(get_current_user),
    search_text: str | None = None,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.search_users(
        session=session,
        search_text=search_text,
        curr_user_id=curr_user_id,
    )


@router.post("/create/", status_code=status.HTTP_201_CREATED, response_model=PostCreate)
async def create_post(
    post_in: PostCreate,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_post(
        session=session,
        post_in=post_in,
        curr_user_id=curr_user_id,
    )


@router.patch("/change_password/", status_code=status.HTTP_200_OK)
async def change_password(
    request: ChangePasswordRequest,
    curr_user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    await service.change_password(
        session=session,
        request=request,
        curr_user_id=curr_user_id,
    )
    return {"message": "Пароль успішно змінено"}


@router.post("/{post_id}/like/", status_code=status.HTTP_201_CREATED)
async def create_like(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_like(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.post("/{post_id}/comment/", status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_text: CommentCreate,
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_comment(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
        comment_text=comment_text,
    )


@router.post("/report/", status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: CreateReport,
    curr_user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_report(
        session=session,
        curr_user_id=curr_user_id,
        report_data=report_data,
    )


@router.post("/{post_id}/save/", status_code=status.HTTP_201_CREATED)
async def save_post(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.save_post(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.patch("/me/", response_model=UserResponse)
async def update_my_profile(
    user_in: UserUpdateMeRequest,
    current_user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_my_profile(
        session=session, current_user_id=current_user_id, user_in=user_in
    )


@router.delete("/{post_id}/like/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_like(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_like(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.delete("/comment/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    await service.delete_comment(
        comment_id=comment_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.delete("/save/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_save_post(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    await service.delete_save_post(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )
