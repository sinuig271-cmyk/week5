from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    picture: str
    plan: str

    model_config = {"from_attributes": True}
