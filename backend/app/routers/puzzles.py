from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.domain.adapters.db_repository import SqlAlchemyPuzzleRepository
from app.domain.adapters.heuristic_generator import HeuristicPuzzleGenerator
from app.models.analysis import GameAnalysis, KeyMoment
from app.models.puzzle import Puzzle, PuzzleAttempt
from app.schemas import AttemptCreate, PuzzleCreate, PuzzleOut

router = APIRouter()
_generator = HeuristicPuzzleGenerator()


def _repo(db: Session) -> SqlAlchemyPuzzleRepository:
    return SqlAlchemyPuzzleRepository(db)


@router.get("/stats/categories")
def category_stats(db: Session = Depends(get_db)):
    return _repo(db).count_by_category()


@router.get("/")
def list_puzzles(
    theme: str | None = None,
    difficulty: int | None = None,
    phase: str | None = None,
    category: str | None = None,
    subcategory: str | None = None,
    page: int = Query(0, ge=0),
    per_page: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return _repo(db).list(
        theme=theme, difficulty=difficulty, phase=phase,
        category=category, subcategory=subcategory,
        page=page, per_page=per_page,
    )


@router.get("/{puzzle_id}", response_model=PuzzleOut)
def get_puzzle(puzzle_id: int, db: Session = Depends(get_db)):
    puzzle = _repo(db).find_by_id(puzzle_id)
    if not puzzle:
        raise HTTPException(404, "Puzzle not found")
    return puzzle


@router.post("/", response_model=PuzzleOut)
def create_puzzle(data: PuzzleCreate, db: Session = Depends(get_db)):
    puzzle = Puzzle(**data.model_dump())
    return _repo(db).save_puzzle_orm(puzzle)


@router.post("/generate-from-game/{game_id}")
def generate_puzzles_from_game(
    game_id: int,
    user_id: int = 1,
    db: Session = Depends(get_db),
):
    game = db.query(GameAnalysis).filter(GameAnalysis.id == game_id).first()
    if not game:
        raise HTTPException(404, "Game not found")

    moments = db.query(KeyMoment).filter(KeyMoment.game_id == game_id).all()
    created = []

    if moments:
        items = [
            {"fen": m.fen, "move_san": m.move_san, "moment_type": m.moment_type, "eval_before": m.eval_before, "eval_after": m.eval_after}
            for m in moments
        ]
        tactical_moments = _generator.generate_moments_from_key_moments(items)
    else:
        tactical_moments = _generator.generate_moments(game.pgn)

    repo = _repo(db)
    seen_fens = set()
    for moment in tactical_moments:
        if moment.fen_before in seen_fens:
            continue
        seen_fens.add(moment.fen_before)
        created.append(repo.save(moment, game_id, user_id))

    return created


@router.delete("/{puzzle_id}")
def delete_puzzle(puzzle_id: int, db: Session = Depends(get_db)):
    if not _repo(db).delete(puzzle_id):
        raise HTTPException(404, "Puzzle not found")
    return {"ok": True}


@router.post("/attempt")
def submit_attempt(data: AttemptCreate, db: Session = Depends(get_db)):
    attempt = PuzzleAttempt(**data.model_dump(exclude={"moves_played"}))
    return _repo(db).save_attempt(attempt)
