from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SortByArticleType(str, Enum):
    all = "Всі статті"
    official = "Офіційні"
    community = "Спіьнота"


class AuthorResponse(BaseModel):
    id: int
    name: str
    aquariums_count: int
    model_config = ConfigDict(from_attributes=True)


class CategoryResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class ArticleCardResponse(BaseModel):
    id: int
    title: str
    excerpt: str
    is_official: bool
    reading_time_minutes: int

    author: Optional[AuthorResponse] = None

    category: Optional[CategoryResponse] = None
    cover_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ArticleDetailResponse(ArticleCardResponse):
    content: str
    created_at: datetime
    status: str


class ArticleCreate(BaseModel):
    title: str = Field(..., max_length=200)
    category_id: Optional[int] = None
    excerpt: str = ""
    content: str = ""
    image_id: Optional[int] = None


class ArticleCategoriesResponse(BaseModel):
    id: int
    name: str
    cover_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
