from datetime import date

from pydantic import BaseModel, ConfigDict


class DailyStatsBase(BaseModel):
    user_id: int = 1
    stat_date: date
    puzzles_solved: int = 0
    puzzles_correct: int = 0
    repertoire_reviewed: int = 0
    repertoire_accuracy: float | None = None
    games_analyzed: int = 0
    streak_days: int = 0


class DailyStatsCreate(DailyStatsBase):
    model_config = ConfigDict(from_attributes=True)


class DailyStatsRead(DailyStatsBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StatsSummary(BaseModel):
    total_puzzles: int
    total_correct: int
    accuracy: float
    total_repertoire_nodes: int
    total_games: int
    current_streak: int
    longest_streak: int
    rating_estimate: int | None = None


class StreakData(BaseModel):
    current: int
    longest: int
    history: list[dict]


class RatingProgress(BaseModel):
    dates: list[str]
    ratings: list[int]


class PuzzleStats(BaseModel):
    by_theme: dict[str, int]
    by_difficulty: dict[int, int]
    by_phase: dict[str, int]
    recent_accuracy: float
