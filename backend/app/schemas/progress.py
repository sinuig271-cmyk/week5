from datetime import datetime
from pydantic import BaseModel


class ProgressIn(BaseModel):
    section_id: int


class ProgressOut(BaseModel):
    id: int
    section_id: int
    completed_at: datetime
    model_config = {"from_attributes": True}
