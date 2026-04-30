from pydantic import BaseModel


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
    rate: int
    description: str

    class Config:
        from_attributes = True
