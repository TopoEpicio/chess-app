from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class GameAnalysisBase(BaseModel):
    user_id: int = 1
    white: str | None = None
    black: str | None = None
    eco: str | None = None
    event_date: date | None = None
    opening_name: str | None = None
    pgn: str
    engine_depth: int = Field(default=18, ge=10, le=30)
    multipv: int = Field(default=3, ge=1, le=10)


class GameAnalysisCreate(GameAnalysisBase):
    model_config = ConfigDict(from_attributes=True)


class GameAnalysisRead(BaseModel):
    id: int
    user_id: int = 1
    white: str | None = None
    black: str | None = None
    result: str | None = None
    eco: str | None = None
    event_date: str | None = None
    opening_name: str | None = None
    pgn: str
    analyzed_pgn: str | None = None
    player_rating: int | None = None
    opponent: str | None = None
    created_at: str | None = None
    engine_depth: int = Field(default=18, ge=10, le=30)
    multipv: int = Field(default=3, ge=1, le=10)
    status: str = "completed"
    total_moves: int = 0
    inaccuracies: int = 0
    mistakes: int = 0
    blunders: int = 0

    model_config = ConfigDict(from_attributes=True)


class GameSummary(BaseModel):
    id: int
    white: str | None = None
    black: str | None = None
    result: str | None = None
    eco: str | None = None
    date: str | None = None
    opening_name: str | None = None
    num_moves: int = 0
    created_at: str = ""


class KeyMomentBase(BaseModel):
    analysis_id: int
    move_number: int
    fen_before: str
    fen_after: str
    classification: str
    eval_before: int | None = None
    eval_after: int | None = None
    best_move: str | None = None
    played_move: str | None = None
    explanation: str | None = None


class KeyMomentRead(KeyMomentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class AnalysisRequest(BaseModel):
    pgn: str = Field(..., alias="pgn_text")
    user_id: int = 1
    depth: int = Field(default=18, ge=10, le=30)
    multipv: int = Field(default=3, ge=1, le=10)
    analyze_all: bool = False

    model_config = ConfigDict(populate_by_name=True)


class AnalysisProgress(BaseModel):
    status: str
    current_move: int
    total_moves: int
    estimated_remaining_seconds: float | None = None


class EngineLine(BaseModel):
    move: str
    centipawn: int | None = None
    mate: int | None = None
    pv: list[str] = Field(default_factory=list)


class CoachFeedback(BaseModel):
    move_number: int
    classification: str
    explanation: str
    best_move: str
    played_move: str
    eval_swing: int
