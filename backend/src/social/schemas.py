from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PostCategory(str, Enum):
    all_posts = "Всі пости"
    help_questions = "Допомога / Питання"
    herbalists_aquascaping = "Травники та Акваскейп"
    shrimps = "Креветочники"
    species_discussion = "Обговорення видів"
    equipment_diy = "Обладнання та DIY"
    algae_diseases = "Водорості та Хвороби"
    first_launch = "Перший запуск"


class PostCardResponse(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class AuthorResponse(BaseModel):
    id: int
    nickname: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class CommentResponse(BaseModel):
    id: int
    author: AuthorResponse
    text: str

    created_at_human: str

    class Config:
        from_attributes = True


class PostResponse(BaseModel):
    id: int

    description: str | None = None

    image_url: str | None = None

    created_at_human: str

    likes_count: int

    comments_count: int

    author: AuthorResponse

    comments: list[CommentResponse]

    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    description: Optional[str] = None
    category: PostCategory
    image_id: int

    class Config:
        from_attributes = True


class UsersCardResponse(BaseModel):
    id: int
    name: str
    nickname: str
    avatar_url: str

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
