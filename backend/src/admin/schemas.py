from pydantic import BaseModel

class SystemHealthResponse(BaseModel):
    total_users: int
    active_aquariums: int
    most_popular_fish: str
    message: str