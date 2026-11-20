from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from app.database import Base

# Compat JSON column type
try:
    from sqlalchemy.dialects.postgresql import JSON
    JSONType = JSON
except ImportError:
    JSONType = SQLiteJSON


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

    # Nuovi campi analisi
    white_accuracy = Column(Float, nullable=True)
    black_accuracy = Column(Float, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)
    analysis_status = Column(String(16), default="none")

    moves = relationship("MoveAnalysis", back_populates="game", cascade="all, delete-orphan", passive_deletes=True)


class MoveAnalysis(Base):
    __tablename__ = "move_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    game_id = Column(Integer, ForeignKey("game_analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    move_number = Column(Integer, nullable=False)
    is_white = Column(Integer, nullable=False)  # 0/1 per SQLite compat
    san = Column(String(16), nullable=False)
    fen_before = Column(String(128), nullable=False)
    fen_after = Column(String(128), nullable=False)

    played_eval = Column(Float, nullable=False)
    best_eval = Column(Float, nullable=False)
    best_move_san = Column(String(16), nullable=False)
    best_move_uci = Column(String(8), nullable=False)

    second_move_uci = Column(String(8), nullable=True)
    second_move_eval = Column(Float, nullable=True)
    third_move_uci = Column(String(8), nullable=True)
    third_move_eval = Column(Float, nullable=True)

    depth = Column(Integer, nullable=False)
    eval_swing = Column(Float, nullable=False)
    classification = Column(String(16), nullable=False)
    pvs = Column(JSONType, nullable=True)

    wp_before = Column(Float, nullable=True)
    wp_after = Column(Float, nullable=True)
    wp_best = Column(Float, nullable=True)
    wp_loss = Column(Float, nullable=True)

    game = relationship("GameAnalysis", back_populates="moves")


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
