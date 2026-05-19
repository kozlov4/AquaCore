from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from core.models.system import TimelineEventType


class TimelineEventResponse(BaseModel):
    id: int
    event_type: TimelineEventType
    title: str
    description: Optional[str]
    event_metadata: Optional[Dict[str, Any]]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
