from fastapi import HTTPException
from sqlalchemy import select, Result, or_, delete, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from core.models import Post, User, Comment, PostLike, SavedPost, Notification
from .schemas import PostCreate, CommentCreate, PostCategory


async def get_posts(
    session: AsyncSession,
    limit: int,
    offset: int,
    curr_user_id: int,
    category: PostCategory | None = None,
):
    stmt = select(Post).options(joinedload(Post.image))

    stmt = stmt.where(Post.user_id != curr_user_id)

    if category and category != PostCategory.all_posts:
        stmt = stmt.where(Post.category == category)

    stmt = stmt.limit(limit).offset(offset)

    result = await session.execute(stmt)

    posts = result.scalars().unique().all()

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
    stmt_post = select(Post).where(Post.id == post_id)
    post = (await session.execute(stmt_post)).scalar_one_or_none()

    if not post:
        raise HTTPException(status_code=404, detail="Пост не знайден")

    stmt_like = select(PostLike).where(
        PostLike.user_id == curr_user_id,
        PostLike.post_id == post_id,
    )
    if (await session.execute(stmt_like)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Вже лайкнуто")

    post_like = PostLike(user_id=curr_user_id, post_id=post_id)
    session.add(post_like)

    if post.user_id != curr_user_id:
        notification = Notification(
            user_id=post.user_id,
            actor_id=curr_user_id,
            post_id=post_id,
            image_id=post.image_id,
        )
        session.add(notification)

    await session.commit()
    await session.refresh(post_like)

    return post_like


async def delete_like(
    session: AsyncSession,
    curr_user_id: int,
    post_id: int,
):
    stmt_unlike = delete(PostLike).where(
        PostLike.user_id == curr_user_id,
        PostLike.post_id == post_id,
    )
    await session.execute(stmt_unlike)

    stmt_del_notif = delete(Notification).where(
        Notification.actor_id == curr_user_id,
        Notification.post_id == post_id,
    )
    await session.execute(stmt_del_notif)

    await session.commit()


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


async def save_post(session: AsyncSession, curr_user_id: int, post_id: int):

    stmt = select(SavedPost).where(
        SavedPost.user_id == curr_user_id, SavedPost.post_id == post_id
    )

    result: Result = await session.execute(stmt)

    post = result.scalar_one_or_none()

    if post:
        raise HTTPException(
            status_code=400, detail="Ви вже додали цей поост до збережених"
        )

    saved_post = SavedPost(user_id=curr_user_id, post_id=post_id)
    session.add(saved_post)

    await session.commit()

    await session.refresh(saved_post)

    return saved_post


async def delete_save_post(
    session: AsyncSession,
    curr_user_id: int,
    post_id: int,
):
    stmt = delete(SavedPost).where(
        SavedPost.user_id == curr_user_id,
        SavedPost.post_id == post_id,
    )
    result = await session.execute(stmt)
    await session.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Пост не знайден",
        )


async def get_notifications(session: AsyncSession, curr_user_id: int):
    stmt = (
        select(Notification)
        .where(Notification.user_id == curr_user_id)
        .order_by(desc(Notification.created_at))
        .options(
            selectinload(Notification.author).selectinload(User.avatar),
            selectinload(Notification.image),
        )
    )

    result = await session.execute(stmt)
    notifications = result.scalars().all()

    return list(notifications)
