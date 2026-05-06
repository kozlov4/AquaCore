from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import Article, ArticleCategory, User
from .schemas import SortByArticleType, ArticleCreate, ArticleCategoriesResponse


async def get_article_categories(session: AsyncSession):
    stmt = select(ArticleCategory)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_articles(
    session: AsyncSession,
    target_type: SortByArticleType,
    search_text: str | None = None,
    category_names: list[str] | None = None,
):
    stmt = select(Article).where(Article.status == "PUBLISHED")

    if target_type == SortByArticleType.community:
        stmt = stmt.where(Article.is_official == False)
    elif target_type == SortByArticleType.official:
        stmt = stmt.where(Article.is_official == True)

    if search_text:
        search_pattern = f"%{search_text}%"
        stmt = stmt.where(
            or_(
                Article.title.ilike(search_pattern),
                Article.excerpt.ilike(search_pattern),
            )
        )

    if category_names:
        stmt = stmt.join(Article.category).where(
            ArticleCategory.name.in_(category_names)
        )

    stmt = stmt.options(
        selectinload(Article.category),
        selectinload(Article.author).selectinload(User.aquariums),
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
            selectinload(Article.author).selectinload(User.aquariums),
            selectinload(Article.image),
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def create_article(
    session: AsyncSession, user_id: int, article_in: ArticleCreate
):
    new_article = Article(
        **article_in.model_dump(),
        author_id=user_id,
        is_official=False,
        status="PUBLISHED",
    )

    session.add(new_article)
    await session.commit()
    await session.refresh(new_article)

    return await get_article_by_id(new_article.id, session)
