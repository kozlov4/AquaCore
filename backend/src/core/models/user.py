from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .aquarium import Aquarium
    from .post import Post
    from .system import Feedback, Notification
    from .post import UserGallery, UserDairy


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    nickname: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    myself: Mapped[str | None] = mapped_column(Text)
    password_hash: Mapped[str] = mapped_column(String(255))
    reset_code: Mapped[Optional[str]] = mapped_column(String(8))
    reset_code_expire: Mapped[datetime] = mapped_column(nullable=True)
    new_email_candidate: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_reset_code: Mapped[str | None] = mapped_column(String(6), nullable=True)
    avatar_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))

    @property
    def aquariums_count(self) -> int:
        return len(self.aquariums) if self.aquariums else 0

    @property
    def avatar_url(self) -> str | None:
        if self.avatar:
            return self.avatar.image_url
        return None

    @property
    def posts_count(self) -> int:
        return len(self.posts) if self.posts else 0

    avatar: Mapped["Image"] = relationship()
    aquariums: Mapped[list["Aquarium"]] = relationship(back_populates="owner")
    posts: Mapped[list["Post"]] = relationship(back_populates="author")
    feedback: Mapped["Feedback"] = relationship(back_populates="user")
    gallery: Mapped[list["UserGallery"]] = relationship(back_populates="author")
    diary: Mapped[list["UserDairy"]] = relationship(back_populates="author")
    notifications: Mapped[list["Notification"]] = relationship(
        foreign_keys="[Notification.user_id]",  # Явно говорим искать по user_id
        back_populates="recipient",
        cascade="all, delete-orphan",
    )


class Block(Base):
    __tablename__ = "blocks"

    blocker_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    blocked_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
