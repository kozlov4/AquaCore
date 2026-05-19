from typing import Optional

from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from core.models import Post
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
    feedbacks = result.scalars().all()

    return list(feedbacks)


async def create_post(session: AsyncSession, curr_user_id: int, post_in: PostCreate):
    post = Post(user_id=curr_user_id, **post_in.model_dump())
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post
