from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import GameAnalysis
from app.models.puzzle import Puzzle
from app.services.bulk_import import detect_block_type, parse_puzzle_block, split_blocks
from app.services.pgn_import import get_existing_game_keys, pgn_key, populate_game_headers

router = APIRouter(tags=["import"])


@router.post("/preview")
def preview_blocks(content: str = Body(embed=True)):
    blocks = []
    for i, block in enumerate(split_blocks(content)):
        btype = detect_block_type(block)
        lines = [line.strip() for line in block.strip().split("\n") if line.strip()]
        name = lines[0].lstrip("# ").strip() if lines else ""
        preview = block.strip()[:80]
        blocks.append({"index": i, "type": btype, "name": name, "preview": preview})
    return {"blocks": blocks}


@router.post("/bulk")
def import_bulk(
    content: str = Body(embed=True),
    types: dict[str, str] = Body(embed=True),
    db: Session = Depends(get_db),
):
    if not content.strip():
        raise HTTPException(400, "Content is empty")

    blocks = split_blocks(content)
    puzzles_imported = 0
    puzzles_errors: list[str] = []
    games_imported = 0
    games_errors: list[str] = []
    games_skipped = 0
    existing_game_keys = get_existing_game_keys(1, db)

    for i, block in enumerate(blocks):
        btype = types.get(str(i))
        if btype == "puzzle":
            parsed = parse_puzzle_block(block)
            if parsed is None:
                puzzles_errors.append(f"Block {i}: invalid puzzle format")
                continue
            try:
                puzzle = Puzzle(**parsed)
                db.add(puzzle)
                db.commit()
                puzzles_imported += 1
            except Exception as e:
                puzzles_errors.append(f"Block {i}: {str(e)}")
        elif btype == "game":
            if pgn_key(block) in existing_game_keys:
                games_skipped += 1
                continue
            try:
                game = GameAnalysis(user_id=1, pgn=block)
                populate_game_headers(game)
                db.add(game)
                db.commit()
                existing_game_keys.add(pgn_key(block))
                games_imported += 1
            except Exception as e:
                games_errors.append(f"Block {i}: {str(e)}")

    return {
        "puzzles": {"imported": puzzles_imported, "errors": puzzles_errors},
        "games": {"imported": games_imported, "errors": games_errors, "skipped": games_skipped},
        "total": puzzles_imported + games_imported,
    }
