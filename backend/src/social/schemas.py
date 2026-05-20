from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, model_validator, EmailStr


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


class ReadNotificationsResponse(BaseModel):
    id: int
    author: AuthorResponse
    image_url: str | None


class CreateReport(BaseModel):
    text: str
    post_id: Optional[int] = None
    reported_user_id: Optional[int] = None

    @model_validator(mode="after")
    def check_target_exists(self) -> "CreateReport":
        if not self.post_id and not self.reported_user_id:
            raise ValueError("Необхідно вказати або post_id, або reported_user_id")

        if self.post_id and self.reported_user_id:
            raise ValueError(
                "Не можна поскаржитися одночасно і на пост, і на користувача"
            )

        return self


class UserUpdateMeRequest(BaseModel):
    name: Optional[str] = None
    nickname: Optional[str] = None
    myself: Optional[str] = None
    avatar_id: Optional[int] = None


class UserResponse(UserUpdateMeRequest):
    pass


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(min_length=8, max_length=100)
    new_password: str = Field(min_length=8, max_length=100)
    reply_new_password: str = Field(min_length=8, max_length=100)

    @model_validator(mode="after")
    def check_passwords_match(self) -> "ChangePasswordRequest":
        if self.new_password != self.reply_new_password:
            raise ValueError("Нові паролі не співпадають")

        if self.old_password == self.new_password:
            raise ValueError("Новий пароль не може бути таким самим, як старий")

        return self


class ReadProfileResponse(BaseModel):
    nickname: str
    posts_count: int
    myself: Optional[str] = None
    avatar_url: str
    posts: list[PostCardResponse]


class SavedPostPhotoResponse(BaseModel):
    id: int
    image_url: Optional[str] = None


class ChangeEmailRequest(BaseModel):
    new_email: EmailStr


class ConfirmEmailChangeRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)
