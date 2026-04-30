# models/base.py
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String


class Base(DeclarativeBase):
    __abstract__ = True
    id: Mapped[int] = mapped_column(primary_key=True)


class Image(Base):
    __tablename__ = "images"

    image_url: Mapped[str] = mapped_column(String(500))
