from pydantic import BaseModel, EmailStr, Field

class UserRegistration(BaseModel):
  email:EmailStr
  password:str = Field(min_length=8, max_length=100)
  class Config:
        from_attributes = True



