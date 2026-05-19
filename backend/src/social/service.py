from typing import Optional

from sqlalchemy import select, Result, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from core.models import Post, User
from .schemas import PostCreate


async def get_posts(
    session: AsyncSession,
    limit: int,
    offset: int,
    curr_user_id: int,
    category: Optional[str] = None,
):
    stmt = (
        select(Post).where(Post.user_id != curr_user_id).options(joinedload(Post.image))
    )

    if category:
        stmt = stmt.where(Post.category == category)

    stmt = stmt.limit(limit).offset(offset)

    result: Result = await session.execute(stmt)
    posts = result.scalars().all()

    return list(posts)


async def create_post(session: AsyncSession, curr_user_id: int, post_in: PostCreate):
    post = Post(user_id=curr_user_id, **post_in.model_dump())
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post


async def search_users(
    session: AsyncSession, curr_user_id: int, search_text: str = None
):
    stmt = select(User).options(selectinload(User.avatar))

    if search_text:
        search_pattern = f"%{search_text}%"
        stmt = stmt.where(
            or_(User.nickname.ilike(search_pattern), User.name.ilike(search_pattern)),
            User.id != curr_user_id,
        )

    result: Result = await session.execute(stmt)
    users = result.scalars().all()

    return list(users)
