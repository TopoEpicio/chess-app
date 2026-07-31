from datetime import UTC, datetime

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session

import chess

from app.database import get_db
from app.models.analysis import GameAnalysis, KeyMoment, MoveAnalysis
from app.schemas import GameOut, GameSummary, ImportRequest
from app.schemas.analysis import (
    GameAnalysisResultOut,
    MoveAnalysisOut,
    SaveAnalysisRequest,
)
from app.services import pgn_import
router = APIRouter(tags=["analysis"])


def validate_fen_move(fen_before: str, san: str, fen_after: str) -> None:
    """Validate that a SAN move is legal from fen_before and results in fen_after."""
    try:
        board = chess.Board(fen_before)
    except ValueError as e:
        raise HTTPException(422, f"Invalid FEN in fen_before: {e}")

    # Parse the SAN move
    try:
        move = board.parse_san(san)
    except ValueError as e:
        raise HTTPException(422, f"Illegal move {san} from position: {e}")

    # Apply the move
    board.push(move)

    # Verify resulting FEN matches (normalize both for comparison)
    try:
        expected_board = chess.Board(fen_after)
    except ValueError as e:
        raise HTTPException(422, f"Invalid FEN in fen_after: {e}")

    # Compare normalized FENs (board.fen() includes move counters, so compare core parts)
    actual_fen_parts = board.fen().split()[:4]
    expected_fen_parts = expected_board.fen().split()[:4]
    if actual_fen_parts != expected_fen_parts:
        raise HTTPException(
            422,
            f"Move {san} from fen_before does not result in fen_after. "
            f"Expected: {' '.join(expected_fen_parts)}, got: {' '.join(actual_fen_parts)}"
        )


@router.post("/{game_id}/save-analysis")
def save_analysis(game_id: int, data: SaveAnalysisRequest, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")

    db.query(MoveAnalysis).filter(MoveAnalysis.game_id == game_id).delete()

    for m in data.moves:
        # Validate FEN consistency for each move
        validate_fen_move(m.fen_before, m.san, m.fen_after)

        ma = MoveAnalysis(
            game_id=game_id,
            move_number=m.move_number,
            is_white=1 if m.is_white else 0,
            san=m.san,
            fen_before=m.fen_before,
            fen_after=m.fen_after,
            played_eval=m.played_eval,
            best_eval=m.best_eval,
            best_move_san=m.best_move_san,
            best_move_uci=m.best_move_uci,
            second_move_uci=m.second_move_uci,
            second_move_eval=m.second_move_eval,
            third_move_uci=m.third_move_uci,
            third_move_eval=m.third_move_eval,
            depth=m.depth,
            eval_swing=m.eval_swing,
            classification=m.classification,
            pvs=m.pvs,
            wp_before=m.wp_before,
            wp_after=m.wp_after,
            wp_best=m.wp_best,
            wp_loss=m.wp_loss,
        )
        db.add(ma)

    game.white_accuracy = data.white_accuracy
    game.black_accuracy = data.black_accuracy
    game.analyzed_at = datetime.now(UTC)
    game.analysis_status = "done"

    db.commit()
    return {"ok": True}


@router.get("/{game_id}/analysis-result", response_model=GameAnalysisResultOut)
def get_analysis_result(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")

    moves = db.query(MoveAnalysis).filter(
        MoveAnalysis.game_id == game_id
    ).order_by(MoveAnalysis.move_number).all()

    white_moves = [m for m in moves if m.is_white == 1]
    black_moves = [m for m in moves if m.is_white == 0]

    def _count_by_class(player_moves: list) -> dict[str, int]:
        counts: dict[str, int] = {}
        for m in player_moves:
            counts[m.classification] = counts.get(m.classification, 0) + 1
        return counts

    white_counts = _count_by_class(white_moves)
    black_counts = _count_by_class(black_moves)
    total_counts = _count_by_class(moves)

    white_cpl = round(
        sum(m.eval_swing * 100 for m in white_moves) / max(len(white_moves), 1), 1
    )
    black_cpl = round(
        sum(m.eval_swing * 100 for m in black_moves) / max(len(black_moves), 1), 1
    )

    return GameAnalysisResultOut(
        game_id=game_id,
        white_accuracy=game.white_accuracy,
        black_accuracy=game.black_accuracy,
        white_cpl=white_cpl,
        black_cpl=black_cpl,
        white_classification_counts=white_counts,
        black_classification_counts=black_counts,
        total_classification_counts=total_counts,
        moves=[MoveAnalysisOut(
            move_number=m.move_number,
            is_white=m.is_white == 1,
            san=m.san,
            fen_before=m.fen_before,
            fen_after=m.fen_after,
            played_eval=m.played_eval,
            best_eval=m.best_eval,
            best_move_san=m.best_move_san,
            best_move_uci=m.best_move_uci,
            second_move_uci=m.second_move_uci,
            second_move_eval=m.second_move_eval,
            third_move_uci=m.third_move_uci,
            third_move_eval=m.third_move_eval,
            depth=m.depth,
            eval_swing=m.eval_swing,
            classification=m.classification,
            pvs=m.pvs,
            wp_before=m.wp_before,
            wp_after=m.wp_after,
            wp_best=m.wp_best,
            wp_loss=m.wp_loss,
        ) for m in moves],
        analyzed_at=game.analyzed_at.isoformat() if game.analyzed_at else None,
        status=game.analysis_status or "done",
    )


@router.delete("/{game_id}/analysis-result")
def delete_analysis_result(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")

    db.query(MoveAnalysis).filter(MoveAnalysis.game_id == game_id).delete()
    game.white_accuracy = None
    game.black_accuracy = None
    game.analyzed_at = None
    game.analysis_status = "none"
    db.commit()
    return {"ok": True}

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
