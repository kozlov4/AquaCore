from collections import UserDict
from datetime import date
from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Float, ForeignKey, DateTime, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .user import User
    from .post import Post
    from .post import UserGallery
    from .post import UserDairy
    from .encyclopedia import Species


class Aquarium(Base):
    __tablename__ = "aquariums"

    name: Mapped[str] = mapped_column(String(100))
    volume: Mapped[float] = mapped_column(Float)  # В литрах
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    type: Mapped[str] = mapped_column(String(50))  # Прісноводний, морський і тд
    status: Mapped[str] = mapped_column(String(50))

    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship(back_populates="aquariums")
    image: Mapped["Image"] = relationship()
    posts: Mapped[list["Post"]] = relationship(back_populates="aquarium")
    gallery: Mapped[list["UserGallery"]] = relationship(back_populates="aquarium")
    diary: Mapped[list["UserDairy"]] = relationship(back_populates="aquarium")
    inhabitants: Mapped[list["AquariumInhabitant"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )


class AquariumInhabitant(Base):
    __tablename__ = "aquarium_inhabitants"

    id: Mapped[int] = mapped_column(primary_key=True)
    aquarium_id: Mapped[int] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE")
    )
    species_id: Mapped[int] = mapped_column(
        ForeignKey("species.id", ondelete="CASCADE")
    )
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    settlement_date: Mapped[date] = mapped_column(Date)

    aquarium: Mapped["Aquarium"] = relationship(back_populates="inhabitants")

    species: Mapped["Species"] = relationship()
