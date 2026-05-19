from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Text, ForeignKey, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .base import Image


class ArticleCategory(Base):
    __tablename__ = "article_categories"

    name: Mapped[str] = mapped_column(String(100))

    articles: Mapped[list["Article"]] = relationship(back_populates="category")


class Article(Base):
    __tablename__ = "articles"

    author_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    category_id: Mapped[int | None] = mapped_column(ForeignKey("article_categories.id"))
    title: Mapped[str] = mapped_column(String(200))
    excerpt: Mapped[str | None] = mapped_column(Text)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    content: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(60))
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)
    reading_time_minutes: Mapped[int] = mapped_column(Integer, default=1)

    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    published_at: Mapped[datetime | None] = mapped_column(DateTime)

    @property
    def cover_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None

    category: Mapped["ArticleCategory"] = relationship(back_populates="articles")
    author: Mapped["User"] = relationship()
    image: Mapped["Image"] = relationship()
