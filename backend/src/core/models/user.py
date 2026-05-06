from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .aquarium import Aquarium
    from .post import Post
    from .system import Feedback


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    nickname: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    myself: Mapped[str | None] = mapped_column(Text)
    password_hash: Mapped[str] = mapped_column(String(255))

    avatar_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))

    @property
    def aquariums_count(self) -> int:
        return len(self.aquariums) if self.aquariums else 0

    avatar: Mapped["Image"] = relationship()
    aquariums: Mapped[list["Aquarium"]] = relationship(back_populates="owner")
    posts: Mapped[list["Post"]] = relationship(back_populates="author")
    feedback: Mapped["Feedback"] = relationship(back_populates="user")


class Follower(Base):
    __tablename__ = "followers"

    follower_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    followed_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Block(Base):
    __tablename__ = "blocks"

    blocker_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    blocked_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
