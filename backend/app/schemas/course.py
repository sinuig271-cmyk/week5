from pydantic import BaseModel


class CourseOut(BaseModel):
    id: int
    title: str
    week_number: int
    description: str
    model_config = {"from_attributes": True}


class SectionOut(BaseModel):
    id: int
    order: int
    title: str
    is_free: bool
    model_config = {"from_attributes": True}


class SectionContentOut(BaseModel):
    id: int
    title: str
    content_md: str
    model_config = {"from_attributes": True}
