import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import TIMESTAMPTZ, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr, relationship
from src.database import Base, TableNameMixin

int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]
str_255_not_null = Annotated[str, mapped_column(String(255), nullable=False)]
str_unique_not_null = Annotated[str, mapped_column(String(255), unique=True, nullable=False)]
text_not_null = Annotated[str, mapped_column(Text, nullable=False)]
timestamp_now = Annotated[datetime, mapped_column(TIMESTAMPTZ, server_default=func.now())]
date_now = Annotated[date, mapped_column(Date, server_default=func.now())]

class Post(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'))
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[timestamp_now]

    user: Mapped["User"] = relationship(back_populates="posts")
    likes: Mapped[list["Like"]] = relationship(back_populates="post")

class Like(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    post_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('post.id', ondelete='CASCADE'), primary_key=True)
    created_at: Mapped[timestamp_now]

    user: Mapped["User"] = relationship(back_populates="likes")
    post: Mapped["Post"] = relationship(back_populates="likes")

class Follow(Base, TableNameMixin):
    follower_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    following_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)

    follower: Mapped["User"] = relationship(foreign_keys=[follower_id], back_populates="followed")
    following: Mapped["User"] = relationship(foreign_keys=[following_id], back_populates="followers")