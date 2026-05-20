from datetime import datetime, UTC
from typing import TYPE_CHECKING

from sqlalchemy import DateTime
from sqlalchemy import String, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .user import User
    from .aquarium import Aquarium


class Post(Base):
    __tablename__ = "posts"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )

    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))

    category: Mapped[str] = mapped_column(String(50))

    author: Mapped["User"] = relationship(back_populates="posts")

    image: Mapped["Image"] = relationship()

    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )

    likes: Mapped[list["PostLike"]] = relationship(cascade="all, delete-orphan")

    @property
    def image_url(self) -> str | None:
        if self.image:
            return self.image.image_url

        return None

    @property
    def likes_count(self) -> int:
        return len(self.likes)

    @property
    def comments_count(self) -> int:
        return len(self.comments)

    @property
    def created_at_human(self) -> str:
        now = datetime.now(UTC)

        created_at = self.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)

        diff = now - created_at

        seconds = int(diff.total_seconds())

        if seconds < 60:
            return "Щойно"

        minutes = seconds // 60

        if minutes < 60:
            return f"{minutes} хв тому"

        hours = minutes // 60

        if hours < 24:
            return f"{hours} год тому"

        days = hours // 24

        return f"{days} дн тому"


class UserGallery(Base):
    __tablename__ = "user_gallery"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    aquarium_id: Mapped[int] = mapped_column(ForeignKey("aquariums.id"))
    image_id: Mapped[int] = mapped_column(ForeignKey("images.id"))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    category: Mapped[str] = mapped_column(String(50))
    signature: Mapped[str | None] = mapped_column(Text)

    image: Mapped["Image"] = relationship()
    aquarium: Mapped["Aquarium"] = relationship(back_populates="gallery")
    author: Mapped["User"] = relationship(back_populates="gallery")

    @property
    def cover_image_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None

    @property
    def aquarium_name(self) -> str | None:
        if self.aquarium:
            return self.aquarium.name
        return None


class UserDairy(Base):
    __tablename__ = "user_diary"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    aquarium_id: Mapped[int] = mapped_column(ForeignKey("aquariums.id"))
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    tag: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(100))
    observation: Mapped[str] = mapped_column(Text)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    image: Mapped["Image"] = relationship()
    aquarium: Mapped["Aquarium"] = relationship(back_populates="diary")
    author: Mapped["User"] = relationship(back_populates="diary")

    @property
    def cover_image_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None

    @property
    def aquarium_name(self) -> str | None:
        if self.aquarium:
            return self.aquarium.name
        return None


class SavedPost(Base):
    __tablename__ = "saved_posts"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    saved_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class PostLike(Base):
    __tablename__ = "post_likes"

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))


class Comment(Base):
    __tablename__ = "comments"

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )

    post: Mapped["Post"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship()

    @property
    def created_at_human(self) -> str:
        now = datetime.now(UTC)

        created_at = self.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)

        diff = now - created_at

        seconds = int(diff.total_seconds())

        if seconds < 60:
            return "Щойно"

        minutes = seconds // 60

        if minutes < 60:
            return f"{minutes} хв тому"

        hours = minutes // 60

        if hours < 24:
            return f"{hours} год тому"

        days = hours // 24

        return f"{days} дн тому"

    @property
    def likes_count(self) -> int:
        return len(self.likes)
