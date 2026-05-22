from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict

from core.models import TaskType, RepeatType


class TaskCreate(BaseModel):
    aquarium_id: Optional[int] = None
    task_type: TaskType
    title: str
    notes: Optional[str] = None
    due_date: date
    repeat_type: RepeatType = RepeatType.NONE


class TaskStatusUpdate(BaseModel):
    is_completed: bool


class TaskResponse(TaskCreate):
    id: int
    is_completed: bool
    is_overdue: bool

    model_config = ConfigDict(from_attributes=True)


class TaskUpdate(TaskCreate):
    pass
