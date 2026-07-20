from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(tags=["recal"])


def _svc(db: Session):
    from fastapi import HTTPException

    class _SVC:
        def get(self, user_id: int = 1, limit: int = 50):
            raise HTTPException(404, "Not implemented - recal")

        def get_by_id(self, id: int):
            raise HTTPException(404, "Not implemented - recal")

        def delete(self, id: int):
            raise HTTPException(404, "Not implemented - recal")

        def export_json(self):
            raise HTTPException(404, "Not implemented - recal")

        def export_pgn(self):
            raise HTTPException(404, "Not implemented - recal")

    return _svc(db)


@router.get("/")
def get(user_id: int = 1, limit: int = 50, db: Session = Depends(get_db)):
    return _svc(db).get(user_id, limit)


@router.get("/{game_id}")
def get_by_id(game_id: int, db: Session = Depends(get_db)):
    return _svc(db).get_by_id(game_id)


@router.delete("/{game_id}")
def delete(game_id: int, db: Session = Depends(get_db)):
    return _svc(db).delete(game_id)


@router.get("/export/json")
def export_json():
    return _svc(db).export_json()


@router.get("/export/pgn")
def export_pgn():
    return _svc(db).export_pgn()
