from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.models import Article, ArticleCategory, User
from .schemas import (
    SortByArticleType,
    ArticleUpdate,
    ArticleDraftCreate,
    ArticlePublishCreate,
)
from .utils import calculate_reading_time


async def get_article_categories(session: AsyncSession):
    stmt = select(ArticleCategory)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_draft_articles(
    session: AsyncSession,
    user_id: int = None,
):
    stmt = (
        select(Article)
        .where(
            Article.author_id == user_id,
            Article.status == "DRAFT"
        )
        .options(
            selectinload(Article.category)
        )
        .order_by(Article.created_at.desc())
    )

    result = await session.execute(stmt)
    return result.scalars().all()


async def delete_article(
    session: AsyncSession,
    user_id: int,
    article_id: int,
):
    article = await session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Стаття не знайдена")

    if article.author_id != user_id:
        raise HTTPException(status_code=403, detail="Ви не можете видалити чужу статтю")

    await session.delete(article)
    await session.commit()

    return {"message": f"Стаття '{article.title}' успішно видалена"}


async def get_articles(
    session: AsyncSession,
    target_type: SortByArticleType,
    search_text: str | None = None,
    user_id: int = None,
    category_ids: list[int] | None = None,
):
    stmt = select(Article).where(Article.status == "PUBLISHED")

    if target_type == SortByArticleType.community:
        stmt = stmt.where(Article.is_official == False)
    elif target_type == SortByArticleType.official:
        stmt = stmt.where(Article.is_official == True)
    elif target_type == SortByArticleType.my_article:
        stmt = stmt.where(Article.author_id == user_id)

    if search_text:
        search_pattern = f"%{search_text}%"
        stmt = stmt.where(
            or_(
                Article.title.ilike(search_pattern),
                Article.excerpt.ilike(search_pattern),
            )
        )

    if category_ids:
        stmt = stmt.join(Article.category).where(ArticleCategory.id.in_(category_ids))

    stmt = stmt.options(
        selectinload(Article.category),
        selectinload(Article.author).options(
            selectinload(User.aquariums),
            selectinload(User.avatar),
        ),
        selectinload(Article.image),
    )

    stmt = stmt.order_by(Article.created_at.desc())

    result = await session.execute(stmt)
    return result.scalars().all()


async def get_article_by_id(article_id: int, session: AsyncSession):
    stmt = (
        select(Article)
        .where(Article.id == article_id)
        .options(
            selectinload(Article.category),
            selectinload(Article.author).options(
                selectinload(User.aquariums),
                selectinload(User.avatar),
            ),
            selectinload(Article.image),
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def create_article(
    session: AsyncSession,
    user_id: int,
    article_in: ArticlePublishCreate | ArticleDraftCreate,
    is_draft: bool,
):
    status = "DRAFT" if is_draft else "PUBLISHED"

    content = article_in.content or ""
    reading_time = calculate_reading_time(content)

    article_data = article_in.model_dump(exclude_none=True)

    new_article = Article(
        **article_data,
        author_id=user_id,
        is_official=False,
        status=status,
        reading_time_minutes=reading_time,
    )

    if status == "PUBLISHED":
        new_article.published_at = datetime.utcnow()

    session.add(new_article)

    await session.commit()
    await session.refresh(new_article)

    return await get_article_by_id(new_article.id, session)


async def update_article(
        session: AsyncSession,
        article_id: int,
        user_id: int,
        article_in: ArticleUpdate,
):
    article = await session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")

    if article.author_id != user_id:
        raise HTTPException(
            status_code=403, detail="Вы не можете редактировать чужую статью"
        )

    update_data = article_in.model_dump(exclude_unset=True, exclude={"is_draft"})

    if "content" in update_data and update_data["content"]:
        article.reading_time_minutes = calculate_reading_time(update_data["content"])

    for key, value in update_data.items():
        setattr(article, key, value)

    if article_in.is_draft is not None:
        if article_in.is_draft == True:
            article.status = "DRAFT"
        elif article_in.is_draft == False:
            if (
                    not article.title
                    or not article.content
                    or not article.category_id
                    or not article.excerpt
                    or not article.image_id
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Для публикации статьи необходимо заполнить все поля",
                )
            article.status = "PUBLISHED"

            if not article.published_at:
                article.published_at = datetime.utcnow()

    await session.commit()
    await session.refresh(article)
    return await get_article_by_id(article.id, session)
