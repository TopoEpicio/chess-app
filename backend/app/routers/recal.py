from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(tags=["recal"])


@router.get("/")
def get(user_id: int = 1, limit: int = 50, db: Session = Depends(get_db)):
    return []


@router.get("/export/json")
def export_json(db: Session = Depends(get_db)):
    return []


@router.get("/export/pgn")
def export_pgn(db: Session = Depends(get_db)):
    return ""


@router.get("/{game_id}")
def get_by_id(game_id: int, db: Session = Depends(get_db)):
    return {"game_id": game_id}


@router.delete("/{game_id}")
def delete(game_id: int, db: Session = Depends(get_db)):
    return {"deleted": game_id}
