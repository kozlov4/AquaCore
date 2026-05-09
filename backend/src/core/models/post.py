from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .user import User
    from .aquarium import Aquarium


class Post(Base):
    __tablename__ = "posts"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    aquarium_id: Mapped[int | None] = mapped_column(ForeignKey("aquariums.id"))
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    category: Mapped[str] = mapped_column(String(50))

    author: Mapped["User"] = relationship(back_populates="posts")
    aquarium: Mapped["Aquarium"] = relationship(back_populates="posts")
    image: Mapped["Image"] = relationship()
    comments: Mapped[list["Comment"]] = relationship(back_populates="post")


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
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    post: Mapped["Post"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship()


class CommentLike(Base):
    __tablename__ = "comment_likes"

    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
