from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SortByArticleType(str, Enum):
    all = "Всі статті"
    official = "Офіційні"
    community = "Спіьнота"
    my_article = "Мої статті"


class AuthorResponse(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None
    aquariums_count: int
    model_config = ConfigDict(from_attributes=True)


class CategoryResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class ArticleCardResponse(BaseModel):
    id: int
    title: Optional[str] = None
    excerpt: Optional[str] = None
    is_official: bool
    reading_time_minutes: int

    author: Optional[AuthorResponse] = None

    category: Optional[CategoryResponse] = None
    cover_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ArticleDetailResponse(ArticleCardResponse):
    content: Optional[str] = None
    created_at: datetime
    status: str


class ArticlePublishCreate(BaseModel):
    title: str = Field(..., max_length=200)
    category_id: int
    excerpt: str = Field(..., max_length=500)
    content: str
    image_id: int


class ArticleDraftCreate(BaseModel):
    title: str | None = Field(None, max_length=200)
    category_id: int | None = None
    excerpt: str | None = Field(None, max_length=500)
    content: str | None = None
    image_id: int | None = None


class ArticleCategoriesResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ArticleDraftCardResponse(BaseModel):
    id: int
    title: str = None
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    category_id: Optional[int] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_id: Optional[int] = None

    is_draft: Optional[bool] = None
