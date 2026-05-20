from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from models import Image


class Disease(Base):
    __tablename__ = "diseases"

    name: Mapped[str] = mapped_column(String(150))
    target_type: Mapped[str] = mapped_column(String(50))
    danger_level: Mapped[str] = mapped_column(String(50))
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    causes_text: Mapped[str] = mapped_column(Text)

    tags: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")

    treatment_steps: Mapped[list["TreatmentStep"]] = relationship(
        order_by="TreatmentStep.step_number"
    )

    diagnostic_steps: Mapped[list["DiagnosticStep"]] = relationship(
        order_by="DiagnosticStep.order_index"
    )

    image: Mapped[Optional["Image"]] = relationship()

    @property
    def avatar_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None


class TreatmentStep(Base):
    __tablename__ = "treatment_steps"

    disease_id: Mapped[int] = mapped_column(ForeignKey("diseases.id"))
    step_number: Mapped[int] = mapped_column(Integer)
    text: Mapped[str] = mapped_column(String(255))
    subtext: Mapped[str | None] = mapped_column(Text)


class DiagnosticStep(Base):
    __tablename__ = "diagnostic_steps"

    disease_id: Mapped[int] = mapped_column(ForeignKey("diseases.id"))
    order_index: Mapped[int] = mapped_column(Integer)
    text: Mapped[str] = mapped_column(Text)


class Species(Base):
    __tablename__ = "species"

    category: Mapped[str] = mapped_column(String(50), index=True)
    water_type: Mapped[str] = mapped_column(String(60), index=True)
    name: Mapped[str] = mapped_column(String(150), index=True)
    scientific_name: Mapped[str | None] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(Text)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    care_level: Mapped[str] = mapped_column(String(50), index=True)
    min_volume: Mapped[int] = mapped_column(Integer, index=True)
    max_size: Mapped[str] = mapped_column(String(50))
    temperature: Mapped[str | None] = mapped_column(String(50))
    ph: Mapped[str | None] = mapped_column(String(50))
    lifespan: Mapped[str | None] = mapped_column(String(50))
    character: Mapped[str | None] = mapped_column(String(50), index=True)
    diet: Mapped[str | None] = mapped_column(String(50), index=True)
    lighting: Mapped[str | None] = mapped_column(String(50))
    co2: Mapped[str | None] = mapped_column(String(50))
    image: Mapped["Image"] = relationship()
    type: Mapped[str | None] = mapped_column(String(100))

    @property
    def image_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None
