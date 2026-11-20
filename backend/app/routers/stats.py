from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.stats import DailyStats
from app.schemas import DailyStatsOut

router = APIRouter()


@router.get("/", response_model=list[DailyStatsOut])
def get_stats(user_id: int = 1, db: Session = Depends(get_db)):
    stats = db.query(DailyStats).filter(
        DailyStats.user_id == user_id
    ).order_by(DailyStats.stat_date.desc()).limit(30).all()
    return stats
