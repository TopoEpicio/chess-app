from datetime import date

from sqlalchemy import Column, Date, Float, Integer

from app.database import Base


class DailyStats(Base):
    __tablename__ = "daily_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    stat_date = Column(Date, default=date.today)
    puzzles_solved = Column(Integer, default=0)
    puzzles_correct = Column(Integer, default=0)
    repertoire_reviewed = Column(Integer, default=0)
    repertoire_accuracy = Column(Float, nullable=True)
    games_analyzed = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
