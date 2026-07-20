
from pydantic import BaseModel, ConfigDict, Field, field_validator


class RepertoireNodeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    color: str = Field(..., pattern="^(white|black)$")
    parent_id: int | None = None
    fen: str | None = None
    moves: list[str] = Field(default_factory=list)
    comment: str | None = None
    order: int = 0

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        if v not in ["white", "black"]:
            raise ValueError("Color must be 'white' or 'black'")
        return v


class RepertoireNodeCreate(RepertoireNodeBase):
    user_id: int = 1

    model_config = ConfigDict(from_attributes=True)


class RepertoireNodeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    fen: str | None = None
    moves: list[str] | None = None
    comment: str | None = None
    order: int | None = None


class RepertoireNodeRead(RepertoireNodeBase):
    id: int
    user_id: int
    created_at: str
    children_count: int = 0

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
