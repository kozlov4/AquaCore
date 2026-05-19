from pydantic import BaseModel, EmailStr, Field


class TokenInfo(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "Bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)


class UserRegistration(BaseModel):
    name: str = Field(min_length=3, max_length=33)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)

    class Config:
        from_attributes = True
