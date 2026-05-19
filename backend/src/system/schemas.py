from pydantic import BaseModel, Field


class ImagePublic(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    nickname: str
    avatar: ImagePublic | None = None

    class Config:
        from_attributes = True


class ReadFeedback(BaseModel):
    rate: int
    description: str
    user: UserPublic

    class Config:
        from_attributes = True


class CreateFeedback(BaseModel):
    rate: int = Field(..., ge=1, le=5)
    description: str = Field(..., min_length=30, max_length=500)

    class Config:
        from_attributes = True
