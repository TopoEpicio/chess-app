
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

COLOR_CODE_PATTERN = "^(green|yellow|red|blue)$"


class RepertoireNodeCreate(BaseModel):
    repertoire_id: int
    parent_id: int | None = None
    fen: str = Field(..., min_length=1, max_length=128)
    move_san: str = Field(..., min_length=1, max_length=16)
    annotation: str = Field(default="", max_length=2000)
    color_code: str = Field(default="green", pattern=COLOR_CODE_PATTERN)
    depth: int = 0
    eco_code: str | None = Field(default=None, max_length=8)

    model_config = ConfigDict(from_attributes=True)


class RepertoireNodeUpdate(BaseModel):
    parent_id: int | None = None
    fen: str | None = Field(default=None, min_length=1, max_length=128)
    move_san: str | None = Field(default=None, min_length=1, max_length=16)
    annotation: str | None = Field(default=None, max_length=2000)
    color_code: str | None = Field(default=None, pattern=COLOR_CODE_PATTERN)
    depth: int | None = None
    eco_code: str | None = Field(default=None, max_length=8)


class RepertoireNodeRead(BaseModel):
    id: int
    repertoire_id: int
    parent_id: int | None = None
    fen: str
    move_san: str
    annotation: str | None = None
    color_code: str | None = None
    depth: int | None = None
    eco_code: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class RepertoireBulkNode(BaseModel):
    temp_id: str | None = None
    parent_temp_id: str | None = None
    parent_id: int | None = None
    fen: str = Field(..., min_length=1, max_length=128)
    move_san: str = Field(..., min_length=1, max_length=16)
    annotation: str = Field(default="", max_length=2000)
    color_code: str = Field(default="green", pattern=COLOR_CODE_PATTERN)
    depth: int = 0
    eco_code: str | None = Field(default=None, max_length=8)

    @field_validator("temp_id")
    @classmethod
    def validate_temp_id(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("temp_id cannot be blank")
        return value


class RepertoireBulkCreate(BaseModel):
    repertoire_id: int
    nodes: list[RepertoireBulkNode] = Field(..., min_length=1)


class RepertoireBulkResult(BaseModel):
    repertoire_id: int
    created: int
    nodes: list[RepertoireNodeRead]
    id_map: dict[str, int]

    model_config = ConfigDict(from_attributes=True)


class RepertoireTreeRead(BaseModel):
    id: int
    name: str
    color: str
    fen: str | None
    moves: list[str]
    comment: str | None
    order: int
    children: list["RepertoireTreeRead"] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class RepertoireImportRequest(BaseModel):
    pgn: str = Field(..., min_length=10)
    name: str = Field(..., min_length=1, max_length=255)
    color: str = Field(..., pattern="^(white|black)$")
    replace_existing: bool = False


class RepertoireExportRequest(BaseModel):
    repertoire_id: int
    format: str = Field(default="pgn", pattern="^(pgn|text|json)$")


class QuizRequest(BaseModel):
    repertoire_id: int
    max_questions: int = Field(default=10, ge=1, le=50)
    difficulty_range: tuple[int, int] = (1, 10)


class QuizQuestion(BaseModel):
    node_id: int
    position_fen: str
    correct_moves: list[str]
    explanation: str | None = None


class QuizAnswer(BaseModel):
    question_id: int
    moves_played: list[str]
    time_ms: int | None = None


class QuizResult(BaseModel):
    total: int
    correct: int
    accuracy: float
    details: list[dict]
