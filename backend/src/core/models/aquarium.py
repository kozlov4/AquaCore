import enum
from datetime import date
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Index
from sqlalchemy import String, Float, ForeignKey, DateTime, Integer, Date
from sqlalchemy import Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .base import Image
    from .user import User
    from .post import UserGallery
    from .post import UserDairy
    from .encyclopedia import Species


class Aquarium(Base):
    __tablename__ = "aquariums"

    name: Mapped[str] = mapped_column(String(100))
    volume: Mapped[float] = mapped_column(Float)  # В литрах
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    type: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50))

    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    water_change_interval_days: Mapped[int] = mapped_column(
        Integer, default=7, server_default="7"
    )
    water_change_percentage: Mapped[int] = mapped_column(
        Integer, default=30, server_default="30"
    )

    owner: Mapped["User"] = relationship(back_populates="aquariums")
    image: Mapped["Image"] = relationship()

    gallery: Mapped[list["UserGallery"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )
    diary: Mapped[list["UserDairy"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )
    inhabitants: Mapped[list["AquariumInhabitant"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )
    water_tests: Mapped[list["WaterTest"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )

    water_changes: Mapped[list["WaterChangeLog"]] = relationship(
        back_populates="aquarium", cascade="all, delete-orphan"
    )

    @property
    def image_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None

    @property
    def next_water_change_date(self) -> date | None:
        from datetime import timedelta

        if not self.water_change_interval_days:
            return None

        if self.water_changes:
            last_change = max(log.change_date for log in self.water_changes)
        else:
            last_change = (
                self.created_at.date() if hasattr(self, "created_at") else date.today()
            )

        return last_change + timedelta(days=self.water_change_interval_days)


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


class WaterTest(Base):
    __tablename__ = "water_tests"

    __table_args__ = (
        Index(
            "idx_water_tests_aquarium_date",
            "aquarium_id",
            "test_date",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    aquarium_id: Mapped[int] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE")
    )

    test_date: Mapped[date] = mapped_column(Date)

    ph: Mapped[float | None] = mapped_column(Float, nullable=True)
    gh: Mapped[float | None] = mapped_column(Float, nullable=True)
    kh: Mapped[float | None] = mapped_column(Float, nullable=True)

    nh3: Mapped[float | None] = mapped_column(Float, nullable=True)
    no2: Mapped[float | None] = mapped_column(Float, nullable=True)
    no3: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    aquarium: Mapped["Aquarium"] = relationship(back_populates="water_tests")


class ChangeType(str, enum.Enum):
    PLANNED = "Планова підміна"
    EMERGENCY = "Екстрена підміна"


class WaterChangeLog(Base):
    __tablename__ = "water_change_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    aquarium_id: Mapped[int] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE")
    )

    change_type: Mapped[ChangeType] = mapped_column(
        SQLEnum(ChangeType), default=ChangeType.PLANNED
    )

    percentage: Mapped[int] = mapped_column(Integer)
    change_date: Mapped[date] = mapped_column(Date, default=date.today)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    aquarium: Mapped["Aquarium"] = relationship(back_populates="water_changes")
