from typing import List

from pydantic import BaseModel


class SpeciesItem(BaseModel):
    species_id: int
    quantity: int = 1


class AnalyzeRequest(BaseModel):
    items: List[SpeciesItem]


class ConflictDetail(BaseModel):
    type: str
    title: str
    description: str


class EcosystemRequirements(BaseModel):
    min_volume: int
    temperature: str
    ph: str


class CompatibilityResponse(BaseModel):
    status: str
    status_title: str
    status_description: str
    conflicts: List[ConflictDetail]
    requirements: EcosystemRequirements
