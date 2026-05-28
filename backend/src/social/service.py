import logging
import random

logger = logging.getLogger(__name__)
from fastapi import HTTPException, status, BackgroundTasks
from fastapi_mail import MessageSchema, MessageType, FastMail
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth.utils import validate_password, hash_password
from core.config import settings
from core.models import User
from .schemas import (
    UserUpdateMeRequest,
    ChangePasswordRequest,
    ChangeEmailRequest,
    ConfirmEmailChangeRequest,
)


# async def get_posts(
#     session: AsyncSession,
#     limit: int,
#     offset: int,
#     curr_user_id: int,
#     category: PostCategory | None = None,
# ):
#     stmt = select(Post).options(joinedload(Post.image))
#
#     stmt = stmt.where(Post.user_id != curr_user_id)
#
#     if category and category != PostCategory.all_posts:
#         stmt = stmt.where(Post.category == category)
#
#     stmt = stmt.limit(limit).offset(offset)
#
#     result = await session.execute(stmt)
#
#     posts = result.scalars().unique().all()
#
#     return list(posts)


# async def create_post(session: AsyncSession, curr_user_id: int, post_in: PostCreate):
#     post = Post(user_id=curr_user_id, **post_in.model_dump())
#     session.add(post)
#     await session.commit()
#     await session.refresh(post)
#     return post


# async def search_users(
#     session: AsyncSession, curr_user_id: int, search_text: str = None
# ):
#     stmt = select(User).options(selectinload(User.avatar))
#
#     if search_text:
#         search_pattern = f"%{search_text}%"
#         stmt = stmt.where(
#             or_(User.nickname.ilike(search_pattern), User.name.ilike(search_pattern)),
#             User.id != curr_user_id,
#         )
#
#     result: Result = await session.execute(stmt)
#     users = result.scalars().all()
#
#     return list(users)

#
# async def get_post_by_id(
#     session: AsyncSession,
#     post_id: int,
#     curr_user_id: int,
# ):
#     stmt = (
#         select(Post)
#         .where(Post.id == post_id)
#         .options(
#             selectinload(Post.author).selectinload(User.avatar),
#             selectinload(Post.image),
#             selectinload(Post.likes),
#             selectinload(Post.comments)
#             .selectinload(Comment.author)
#             .selectinload(User.avatar),
#             selectinload(Post.comments),
#         )
#     )
#     result: Result = await session.execute(stmt)
#
#     post = result.scalars().first()
#     if not post:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Пост не знайден",
#         )
#     return post


# async def create_like(
#     session: AsyncSession,
#     curr_user_id: int,
#     post_id: int,
# ):
#     stmt_post = select(Post).where(Post.id == post_id)
#     post = (await session.execute(stmt_post)).scalar_one_or_none()
#
#     if not post:
#         raise HTTPException(status_code=404, detail="Пост не знайден")
#
#     stmt_like = select(PostLike).where(
#         PostLike.user_id == curr_user_id,
#         PostLike.post_id == post_id,
#     )
#     if (await session.execute(stmt_like)).scalar_one_or_none():
#         raise HTTPException(status_code=400, detail="Вже лайкнуто")
#
#     post_like = PostLike(user_id=curr_user_id, post_id=post_id)
#     session.add(post_like)
#
#     if post.user_id != curr_user_id:
#         notification = Notification(
#             user_id=post.user_id,
#             actor_id=curr_user_id,
#             post_id=post_id,
#             image_id=post.image_id,
#         )
#         session.add(notification)
#
#     await session.commit()
#     await session.refresh(post_like)
#
#     return post_like


# async def delete_like(
#     session: AsyncSession,
#     curr_user_id: int,
#     post_id: int,
# ):
#     stmt_unlike = delete(PostLike).where(
#         PostLike.user_id == curr_user_id,
#         PostLike.post_id == post_id,
#     )
#     await session.execute(stmt_unlike)
#
#     stmt_del_notif = delete(Notification).where(
#         Notification.actor_id == curr_user_id,
#         Notification.post_id == post_id,
#     )
#     await session.execute(stmt_del_notif)
#
#     await session.commit()
#
#
# async def create_comment(
#     session: AsyncSession,
#     curr_user_id: int,
#     post_id: int,
#     comment_text: CommentCreate,
# ):
#     comment = Comment(user_id=curr_user_id, post_id=post_id, text=comment_text.text)
#
#     session.add(comment)
#
#     await session.commit()
#
#     await session.refresh(comment)
#
#     return comment
#
#
# async def delete_comment(
#     session: AsyncSession,
#     curr_user_id: int,
#     comment_id: int,
# ):
#     stmt = delete(Comment).where(
#         Comment.user_id == curr_user_id,
#         Comment.id == comment_id,
#     )
#     result = await session.execute(stmt)
#     await session.commit()
#
#     if result.rowcount == 0:
#         raise HTTPException(
#             status_code=404,
#             detail="Комментарий не найден или у вас нет прав на его удаление",
#         )
#
#
# async def save_post(session: AsyncSession, curr_user_id: int, post_id: int):
#
#     stmt = select(SavedPost).where(
#         SavedPost.user_id == curr_user_id, SavedPost.post_id == post_id
#     )
#
#     result: Result = await session.execute(stmt)
#
#     post = result.scalar_one_or_none()
#
#     if post:
#         raise HTTPException(
#             status_code=400, detail="Ви вже додали цей поост до збережених"
#         )
#
#     saved_post = SavedPost(user_id=curr_user_id, post_id=post_id)
#     session.add(saved_post)
#
#     await session.commit()
#
#     await session.refresh(saved_post)
#
#     return saved_post
#
#
# async def delete_save_post(
#     session: AsyncSession,
#     curr_user_id: int,
#     post_id: int,
# ):
#     stmt = delete(SavedPost).where(
#         SavedPost.user_id == curr_user_id,
#         SavedPost.post_id == post_id,
#     )
#     result = await session.execute(stmt)
#     await session.commit()
#
#     if result.rowcount == 0:
#         raise HTTPException(
#             status_code=404,
#             detail="Пост не знайден",
#         )
#
#
# async def get_notifications(session: AsyncSession, curr_user_id: int):
#     stmt = (
#         select(Notification)
#         .where(Notification.user_id == curr_user_id)
#         .order_by(desc(Notification.created_at))
#         .options(
#             selectinload(Notification.author).selectinload(User.avatar),
#             selectinload(Notification.image),
#         )
#     )
#
#     result = await session.execute(stmt)
#     notifications = result.scalars().all()
#
#     return list(notifications)


# async def create_report(
#     session: AsyncSession,
#     curr_user_id: int,
#     report_data: CreateReport,
# ):
#     post_id = report_data.post_id
#     reported_user_id = report_data.reported_user_id
#
#     if post_id:
#         post = (
#             await session.execute(select(Post).where(Post.id == post_id))
#         ).scalar_one_or_none()
#
#         if not post:
#             raise HTTPException(status_code=404, detail="Пост не знайдено")
#
#         if post.user_id == curr_user_id:
#             raise HTTPException(
#                 status_code=403,
#                 detail="Не можна поскаржитися на свій пост",
#             )
#
#         stmt_dup = select(Report).where(
#             Report.reporter_id == curr_user_id,
#             Report.reported_post_id == post_id,
#         )
#
#     elif reported_user_id:
#         if reported_user_id == curr_user_id:
#             raise HTTPException(
#                 status_code=403,
#                 detail="Не можна поскаржитися на самого себе",
#             )
#
#         user = (
#             await session.execute(select(User).where(User.id == reported_user_id))
#         ).scalar_one_or_none()
#
#         if not user:
#             raise HTTPException(status_code=404, detail="Користувача не знайдено")
#
#         stmt_dup = select(Report).where(
#             Report.reporter_id == curr_user_id,
#             Report.reported_user_id == reported_user_id,
#         )
#
#     else:
#         raise HTTPException(
#             status_code=400,
#             detail="Потрібно вказати post_id або reported_user_id",
#         )
#
#     existing_report = (await session.execute(stmt_dup)).scalar_one_or_none()
#     if existing_report:
#         raise HTTPException(
#             status_code=409,
#             detail="Ви вже надсилали скаргу на цей об'єкт",
#         )
#
#     new_report = Report(
#         reporter_id=curr_user_id,
#         reported_post_id=post_id,
#         reported_user_id=reported_user_id,
#         reason=report_data.text,
#     )
#
#     session.add(new_report)
#     await session.commit()
#     await session.refresh(new_report)
#
#     return new_report


async def update_my_profile(
    session: AsyncSession, current_user_id: int, user_in: UserUpdateMeRequest
):
    user = await session.get(User, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Користувача не знайдено"
        )

    update_data = user_in.model_dump(exclude_unset=True)

    if "nickname" in update_data and update_data["nickname"] != user.nickname:
        stmt = select(User).where(User.nickname == update_data["nickname"])
        existing_user = (await session.execute(stmt)).scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Цей нікнейм вже зайнятий іншим користувачем",
            )

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    await session.refresh(user)

    return user


async def change_password(
    session: AsyncSession,
    curr_user_id: int,
    request: ChangePasswordRequest,
):
    user = await session.get(User, curr_user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Користувача не знайдено",
        )

    if not validate_password(
        request.old_password,
        user.password_hash.encode("utf-8"),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Старий пароль введено неправильно",
        )

    user.password_hash = hash_password(request.new_password).decode("utf-8")

    await session.commit()


# async def get_user_profile(session: AsyncSession, target_user_id: int):
#     stmt = (
#         select(User)
#         .where(User.id == target_user_id)
#         .options(
#             selectinload(User.avatar), selectinload(User.posts).selectinload(Post.image)
#         )
#     )
#     result = await session.execute(stmt)
#
#     user_profile = result.scalar_one_or_none()
#
#     if not user_profile:
#         raise HTTPException(status_code=404, detail="Користувача не знайдено")
#
#     return user_profile


# async def get_my_saved_posts(session: AsyncSession, curr_user_id: int):
#     stmt = (
#         select(Post)
#         .join(SavedPost, SavedPost.post_id == Post.id)
#         .where(SavedPost.user_id == curr_user_id)
#         .order_by(desc(SavedPost.saved_at))
#         .options(selectinload(Post.image))
#     )
#
#     result = await session.execute(stmt)
#     saved_posts = result.scalars().all()
#
#     return list(saved_posts)


async def request_email_change(
    request: ChangeEmailRequest,
    curr_user_id: int,
    background_tasks: BackgroundTasks,
    session: AsyncSession,
    fm: FastMail,
):
    query_check = select(User).where(User.email == request.new_email)
    existing_user = await session.scalar(query_check)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ця електронна пошта вже використовується іншим користувачем",
        )

    user = await session.get(User, curr_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    verify_code = str(random.randint(100000, 999999))

    user.email_reset_code = verify_code
    user.new_email_candidate = request.new_email
    await session.commit()

    html_content = f"""
    <h2>Зміна електронної пошти</h2>
    <p>Ви запросили зміну електронної пошти. Ваш код підтвердження: <strong>{verify_code}</strong></p>
    """

    message = MessageSchema(
        subject="Код підтвердження нового Email",
        recipients=[request.new_email],
        body=html_content,
        subtype=MessageType.html,
    )

    if settings.environment.lower() == "production":
        background_tasks.add_task(fm.send_message, message)
    else:
        logger.info(f"Mock send change email code {verify_code} to {request.new_email}")

    return {"message": "Повідомлення надіслано"}


async def confirm_email_change(
    request: ConfirmEmailChangeRequest,
    curr_user_id: int,
    session: AsyncSession,
):
    user = await session.get(User, curr_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    if not user.new_email_candidate or not user.email_reset_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Запит на зміну email не знайдено",
        )

    if user.email_reset_code != request.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Невірний код підтвердження"
        )

    user.email = user.new_email_candidate

    user.new_email_candidate = None
    user.email_reset_code = None

    await session.commit()

    return {"message": "Email успішно змінено"}
