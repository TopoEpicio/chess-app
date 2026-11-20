from datetime import UTC, datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    fen = Column(String(128), nullable=False)
    solution = Column(JSON, nullable=False)
    theme = Column(JSON, nullable=False, default=list)
    difficulty = Column(Integer, default=5)
    source = Column(String(16), default="auto")
    source_game_id = Column(Integer, nullable=True)
    phase = Column(String(16), default="middlegame")
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class PuzzleAttempt(Base):
    __tablename__ = "puzzle_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    puzzle_id = Column(Integer, ForeignKey("puzzles.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    correct = Column(Boolean, nullable=False)
    time_ms = Column(Integer, nullable=True)
    attempted_at = Column(DateTime, default=lambda: datetime.now(UTC))
