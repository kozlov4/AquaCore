from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Disease(Base):
    __tablename__ = "diseases"

    name: Mapped[str] = mapped_column(String(150))
    target_type: Mapped[str] = mapped_column(String(50))
    danger_level: Mapped[str] = mapped_column(String(50))
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    causes_text: Mapped[str] = mapped_column(Text)

    treatment_steps: Mapped[list["TreatmentStep"]] = relationship()
    diagnostic_steps: Mapped[list["DiagnosticStep"]] = relationship()


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
