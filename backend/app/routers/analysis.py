from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import GameAnalysis, KeyMoment
from app.schemas import GameOut, GameSummary, ImportRequest
from app.services import pgn_import

router = APIRouter(tags=["analysis"])


def _svc(db: Session):
    class _SVC:
        def list(self, user_id: int, limit: int, year: str | None, white: str | None, black: str | None, result: str | None, eco: str | None, opening: str | None):
            q = db.query(GameAnalysis).filter(GameAnalysis.user_id == user_id)
            if year:
                q = q.filter(GameAnalysis.event_date.like(f"{year}%"))
            if white:
                q = q.filter(GameAnalysis.white.ilike(f"%{white}%"))
            if black:
                q = q.filter(GameAnalysis.black.ilike(f"%{black}%"))
            if result:
                q = q.filter(GameAnalysis.result == result)
            if eco:
                q = q.filter(GameAnalysis.eco.ilike(f"%{eco}%"))
            if opening:
                q = q.filter(GameAnalysis.opening_name.ilike(f"%{opening}%"))
            games = q.order_by(desc(GameAnalysis.created_at)).limit(limit).all()
            return [
                GameSummary(
                    id=g.id,
                    white=g.white,
                    black=g.black,
                    result=g.result,
                    eco=g.eco,
                    date=g.event_date,
                    opening_name=g.opening_name,
                    num_moves=pgn_import.count_moves(g.pgn),
                    created_at=g.created_at.isoformat() if g.created_at else "",
                )
                for g in games
            ]
        
        def getMoves(self, game_id: int):
            from fastapi import HTTPException
            game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
            if not game:
                raise HTTPException(404, "Game not found")
            return pgn_import.parse_pgn_moves(game.pgn)
        
        def get(self, game_id: int):
            from fastapi import HTTPException
            game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
            if not game:
                raise HTTPException(404, "Game not found")
            return game
        
        def getMoments(self, game_id: int):
            return db.query(KeyMoment).filter(KeyMoment.game_id == game_id).all()
        
        def delete(self, game_id: int):
            from fastapi import HTTPException
            game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
            if not game:
                raise HTTPException(404, "Game not found")
            db.query(KeyMoment).filter(KeyMoment.game_id == game_id).delete()
            db.delete(game)
            db.commit()
            return {"ok": True}
        
        def import_pgn(self, data: ImportRequest):
            from app.services import pgn_import
            existing = pgn_import.get_existing_game_keys(data.user_id, db)
            if pgn_import.pgn_key(data.pgn) in existing:
                return {"id": None, "message": "Game already exists", "duplicate": True}
            game = GameAnalysis(user_id=data.user_id, pgn=data.pgn)
            pgn_import.populate_game_headers(game)
            db.add(game)
            db.commit()
            db.refresh(game)
            return {"id": game.id, "message": "Game imported", "duplicate": False}

    return _svc(db)


@router.get("/")
def list_games(
    user_id: int = Query(1),
    limit: int = Query(50),
    year: str | None = Query(None),
    white: str | None = Query(None),
    black: str | None = Query(None),
    result: str | None = Query(None),
    eco: str | None = Query(None),
    opening: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(GameAnalysis).filter(GameAnalysis.user_id == user_id)
    if year:
        q = q.filter(GameAnalysis.event_date.like(f"{year}%"))
    if white:
        q = q.filter(GameAnalysis.white.ilike(f"%{white}%"))
    if black:
        q = q.filter(GameAnalysis.black.ilike(f"%{black}%"))
    if result:
        q = q.filter(GameAnalysis.result == result)
    if eco:
        q = q.filter(GameAnalysis.eco.ilike(f"%{eco}%"))
    if opening:
        q = q.filter(GameAnalysis.opening_name.ilike(f"%{opening}%"))
    games = q.order_by(desc(GameAnalysis.created_at)).limit(limit).all()
    return [
        GameSummary(
            id=g.id,
            white=g.white,
            black=g.black,
            result=g.result,
            eco=g.eco,
            date=g.event_date,
            opening_name=g.opening_name,
            num_moves=pgn_import.count_moves(g.pgn),
            created_at=g.created_at.isoformat() if g.created_at else "",
        )
        for g in games
    ]


@router.get("/{game_id}/moves")
def get_game_moves(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")
    return pgn_import.parse_pgn_moves(game.pgn)


@router.get("/{game_id}", response_model=GameOut)
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")
    return game


@router.get("/{game_id}/moments")
def get_key_moments(game_id: int, db: Session = Depends(get_db)):
    return db.query(KeyMoment).filter(KeyMoment.game_id == game_id).all()


@router.delete("/{game_id}")
def delete_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")
    db.query(KeyMoment).filter(KeyMoment.game_id == game_id).delete()
    db.delete(game)
    db.commit()
    return {"ok": True}


@router.post("/import-pgn")
async def import_pgn(
    data: ImportRequest,
    db: Session = Depends(get_db),
):
    existing = pgn_import.get_existing_game_keys(data.user_id, db)
    if pgn_import.pgn_key(data.pgn) in existing:
        return {"id": None, "message": "Game already exists", "duplicate": True}
    game = GameAnalysis(user_id=data.user_id, pgn=data.pgn)
    pgn_import.populate_game_headers(game)
    db.add(game)
    db.commit()
    db.refresh(game)
    return {"id": game.id, "message": "Game imported", "duplicate": False}


@router.post("/import-pgn-file")
async def import_pgn_file(
    file: UploadFile = File(...),
    user_id: int = Query(1),
    db: Session = Depends(get_db),
):
    content = (await file.read()).decode("utf-8")
    existing = pgn_import.get_existing_game_keys(user_id, db)
    if pgn_import.pgn_key(content) in existing:
        return {"id": None, "message": "Game already exists", "duplicate": True}
    game = GameAnalysis(user_id=user_id, pgn=content)
    pgn_import.populate_game_headers(game)
    db.add(game)
    db.commit()
    db.refresh(game)
    return {"id": game.id, "message": "Game imported", "duplicate": False}
