from enum import Enum

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


class PostCreate(BaseModel):
    description: str = Field(min_length=1, max_length=2000)
    category: PostCategory
    image_id: int

    class Config:
        from_attributes = True
