from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text

from app.database import Base


class GameAnalysis(Base):
    __tablename__ = "game_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    pgn = Column(Text, nullable=False)
    analyzed_pgn = Column(Text, nullable=True)
    result = Column(String(8), nullable=True)
    white = Column(String(128), nullable=True)
    black = Column(String(128), nullable=True)
    eco = Column(String(8), nullable=True)
    event_date = Column(String(16), nullable=True)
    opening_name = Column(String(128), nullable=True)
    player_rating = Column(Integer, nullable=True)
    opponent = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class KeyMoment(Base):
    __tablename__ = "key_moments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    game_id = Column(Integer, ForeignKey("game_analyses.id"), nullable=False)
    fen = Column(String(128), nullable=False)
    move_san = Column(String(16), nullable=False)
    moment_type = Column(String(16), nullable=False)
    eval_before = Column(Float, nullable=True)
    eval_after = Column(Float, nullable=True)
    explanation = Column(Text, default="")
