from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select, Result, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from core.models import Post, User, Comment, PostLike
from .schemas import PostCreate, CommentCreate


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


async def get_post_by_id(
    session: AsyncSession,
    post_id: int,
    curr_user_id: int,
):
    stmt = (
        select(Post)
        .where(Post.id == post_id)
        .options(
            selectinload(Post.author).selectinload(User.avatar),
            selectinload(Post.image),
            selectinload(Post.likes),
            selectinload(Post.comments)
            .selectinload(Comment.author)
            .selectinload(User.avatar),
            selectinload(Post.comments),
        )
    )
    result: Result = await session.execute(stmt)

    post = result.scalars().one()

    return post


async def create_like(
    session: AsyncSession,
    curr_user_id: int,
    post_id: int,
):
    stmt = select(PostLike).where(
        PostLike.user_id == curr_user_id,
        PostLike.post_id == post_id,
    )

    result: Result = await session.execute(stmt)

    like = result.scalar_one_or_none()

    if like:
        raise HTTPException(status_code=400, detail="already liked")

    post_like = PostLike(
        user_id=curr_user_id,
        post_id=post_id,
    )

    session.add(post_like)

    await session.commit()

    await session.refresh(post_like)

    return post_like


async def delete_like(
    session: AsyncSession,
    curr_user_id: int,
    post_id: int,
):
    stmt = select(PostLike).where(
        PostLike.user_id == curr_user_id,
        PostLike.post_id == post_id,
    )

    result: Result = await session.execute(stmt)

    like = result.scalar_one_or_none()

    if like is None:
        raise HTTPException(status_code=400, detail="Ви вже видалили лайк")

    await session.delete(like)
    await session.refresh(like)


async def create_comment(
    session: AsyncSession,
    curr_user_id: int,
    post_id: int,
    comment_text: CommentCreate,
):
    comment = Comment(user_id=curr_user_id, post_id=post_id, text=comment_text.text)

    session.add(comment)

    await session.commit()

    await session.refresh(comment)

    return comment


async def delete_comment(
    session: AsyncSession,
    curr_user_id: int,
    comment_id: int,
):
    stmt = delete(Comment).where(
        Comment.user_id == curr_user_id,
        Comment.id == comment_id,
    )
    result = await session.execute(stmt)
    await session.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Комментарий не найден или у вас нет прав на его удаление",
        )
