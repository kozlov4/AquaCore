from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import (
    SortByArticleType,
    ArticleCardResponse,
    ArticleDetailResponse,
    ArticleCategoriesResponse,
    ArticleDraftCardResponse,
    ArticleUpdate,
    ArticleDraftCreate,
    ArticlePublishCreate,
)

router = APIRouter(prefix="/articles", tags=["Articles"])


@router.get(
    "",
    response_model=list[ArticleCardResponse],
)
async def get_articles_route(
    target_type: SortByArticleType = SortByArticleType.all,
    search_text: str | None = None,
    category_ids: list[int] = Query(default=[]),
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_articles(
        target_type=target_type,
        search_text=search_text,
        category_ids=category_ids,
        user_id=user_id,
        session=session,
    )


@router.get(
    "/categories",
    response_model=list[ArticleCategoriesResponse],
    dependencies=[Depends(get_current_user)],
)
async def get_article_categories_route(
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_article_categories(session=session)


@router.get(
    "/draft",
    response_model=list[ArticleDraftCardResponse],
)
async def get_draft_articles_route(
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_id: int = Depends(get_current_user),
):
    return await service.get_draft_articles(session=session, user_id=user_id)


@router.get(
    "/{article_id}",
    response_model=ArticleDetailResponse,
)
async def read_article_route(
    article_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    article = await service.get_article_by_id(article_id=article_id, session=session)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена"
        )

    if article.status != "PUBLISHED" and article.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас немає прав дивитися цієї чернетки",
        )

    return article


@router.post(
    "",
    response_model=ArticleDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_article_route(
    article_in: ArticlePublishCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_article(
        session=session,
        user_id=user_id,
        article_in=article_in,
        is_draft=False,
    )


@router.post(
    "/draft",
    response_model=ArticleDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_draft_article_route(
    article_in: ArticleDraftCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_article(
        session=session,
        user_id=user_id,
        article_in=article_in,
        is_draft=True,
    )


@router.delete("/{article_id}")
async def delete_article_route(
    article_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_article(
        session=session,
        article_id=article_id,
        user_id=user_id,
    )


@router.put(
    "/{article_id}",
    response_model=ArticleDetailResponse,
)
async def update_article_route(
    article_id: int,
    article_in: ArticleUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_article(
        session=session,
        article_id=article_id,
        user_id=user_id,
        article_in=article_in,
    )
