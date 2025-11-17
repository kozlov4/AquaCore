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

class Posts(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.id', ondelete='CASCADE'))
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[timestamp_now]

    user: Mapped["Users"] = relationship(back_populates="posts")
    likes: Mapped[list["Likes"]] = relationship(back_populates="post")

class Likes(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    post_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True)
    created_at: Mapped[timestamp_now]

    user: Mapped["Users"] = relationship(back_populates="likes")
    post: Mapped["Posts"] = relationship(back_populates="likes")

class Follows(Base, TableNameMixin):
    follower_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    following_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)

    follower: Mapped["Users"] = relationship(foreign_keys=[follower_id], back_populates="followed")
    following: Mapped["Users"] = relationship(foreign_keys=[following_id], back_populates="followers")