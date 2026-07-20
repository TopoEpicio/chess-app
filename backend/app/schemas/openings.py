
from pydantic import BaseModel, ConfigDict, Field


class OpeningBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    side: str = Field(..., pattern="^(white|black)$")
    starting_fen: str
    eco_code: str | None = Field(default=None, pattern="^[A-E][0-9]{2}$")
    color_code: str | None = None


class OpeningCreate(OpeningBase):
    starting_node_id: int | None = None
    model_config = ConfigDict(from_attributes=True)


class OpeningUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    side: str | None = Field(default=None, pattern="^(white|black)$")
    starting_fen: str | None = None
    starting_node_id: int | None = None
    eco_code: str | None = Field(default=None, pattern="^[A-E][0-9]{2}$")
    color_code: str | None = None


class OpeningRead(OpeningBase):
    id: int
    starting_node_id: int | None = None
    node_count: int = 0
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class EcoCode(BaseModel):
    code: str
    name: str
    moves: list[str]
