import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import TIMESTAMP, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr, relationship
from src.database import Base, TableNameMixin

int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]
str_255_not_null = Annotated[str, mapped_column(String(255), nullable=False)]
str_unique_not_null = Annotated[str, mapped_column(String(255), unique=True, nullable=False)]
text_not_null = Annotated[str, mapped_column(Text, nullable=False)]
timestamp_now = Annotated[datetime, mapped_column(TIMESTAMP, server_default=func.now())]
date_now = Annotated[date, mapped_column(Date, server_default=func.now())]

class UserRole(enum.Enum):
    user = 'user'
    admin = 'admin'

class User(Base, TableNameMixin):
    id: Mapped[int_pk]
    email: Mapped[str_unique_not_null]
    hashed_password: Mapped[str_255_not_null]
    role: Mapped[UserRole] = mapped_column(ENUM(UserRole), default=UserRole.user)
    created_at: Mapped[timestamp_now]
    
    user_profile: Mapped["UserProfile"] = relationship(back_populates="user", uselist=False)
    user_settings: Mapped["UserSettings"] = relationship(back_populates="user", uselist=False)
    knowledge_base_articles: Mapped[list["KnowledgeBaseArticle"]] = relationship(back_populates="author")
    
    aquariums: Mapped[list["Aquarium"]] = relationship(back_populates="user")
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
    likes: Mapped[list["Like"]] = relationship(back_populates="user")
    tasks: Mapped[list["Task"]] = relationship(back_populates="user")
    
    followed: Mapped[list["Follow"]] = relationship(
        foreign_keys="Follow.follower_id", back_populates="follower"
    )
    followers: Mapped[list["Follow"]] = relationship(
        foreign_keys="Follow.following_id", back_populates="following"
    )


class UserProfile(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    nickname: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(100))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))

    user = relationship("User", back_populates="user_profile", uselist=False)

class UserSettings(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    theme: Mapped[ThemeType] = mapped_column(ENUM(ThemeType), default=ThemeType.light)
    language: Mapped[str] = mapped_column(String(5), default='ua')
    temperature_unit: Mapped[TempUnit] = mapped_column(ENUM(TempUnit), default=TempUnit.C)
    volume_unit: Mapped[VolumeUnit] = mapped_column(ENUM(VolumeUnit), default=VolumeUnit.L)

    user = relationship("User", back_populates="user_settings", uselist=False)