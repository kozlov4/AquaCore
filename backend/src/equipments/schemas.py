# from datetime import date
# from typing import Optional
#
# from pydantic import ConfigDict, BaseModel
#
#
# class EquipmentCreate(BaseModel):
#     category: str
#     name: str
#     installation_date: date
#     specifications: Optional[str] = None
#     maintenance_interval_days: Optional[int] = None
#
#
# class EquipmentResponse(EquipmentCreate):
#     id: int
#     days_until_maintenance: Optional[int] = None
#
#     model_config = ConfigDict(from_attributes=True)
