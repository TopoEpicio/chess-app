
from pydantic import BaseModel, ConfigDict, Field, field_validator


class PuzzleBase(BaseModel):
    fen: str = Field(..., description="FEN position of the puzzle")
    solution: list[str] = Field(..., min_length=1, description="Solution moves in UCI")
    theme: list[str] = Field(default_factory=list, description="Puzzle themes")
    difficulty: int = Field(default=5, ge=1, le=10, description="Difficulty 1-10")
    source: str = Field(default="manual", description="Source of puzzle")
    source_game_id: int | None = Field(default=None, description="Source game ID")
    phase: str = Field(default="middlegame", description="Game phase")

    @field_validator("phase")
    @classmethod
    def validate_phase(cls, v: str) -> str:
        allowed = ["opening", "middlegame", "endgame"]
        if v not in allowed:
            raise ValueError(f"Phase must be one of {allowed}")
        return v

    @field_validator("theme")
    @classmethod
    def validate_themes(cls, v: list[str]) -> list[str]:
        if not v:
            return ["unknown"]
        return [t.lower().strip() for t in v if t.strip()]


class PuzzleCreate(PuzzleBase):
    user_id: int = 1

    model_config = ConfigDict(from_attributes=True)


class PuzzleUpdate(BaseModel):
    fen: str | None = None
    solution: list[str] | None = None
    theme: list[str] | None = None
    difficulty: int | None = Field(default=None, ge=1, le=10)
    phase: str | None = None


class PuzzleRead(PuzzleBase):
    id: int
    user_id: int
    created_at: str
    attempt_count: int = 0
    success_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class PuzzleAttemptCreate(BaseModel):
    puzzle_id: int
    user_id: int
    correct: bool
    time_ms: int | None = Field(default=None, ge=0)
    moves_played: list[str] = Field(default_factory=list)


class PuzzleAttemptRead(BaseModel):
    id: int
    puzzle_id: int
    user_id: int
    correct: bool
    time_ms: int | None
    moves_played: list[str]
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class PuzzleFilter(BaseModel):
    theme: str | None = None
    difficulty_min: int | None = Field(default=None, ge=1, le=10)
    difficulty_max: int | None = Field(default=None, ge=1, le=10)
    phase: str | None = None
    solved: bool | None = None
    user_id: int | None = None

    model_config = ConfigDict(from_attributes=True)


class PuzzleStats(BaseModel):
    total: int
    solved: int
    by_theme: dict[str, int]
    by_difficulty: dict[int, int]
    by_phase: dict[str, int]
    streak: int
    best_streak: int
