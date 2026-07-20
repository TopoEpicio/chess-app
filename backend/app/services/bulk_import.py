import re
from typing import Literal

import chess

THEME_ALIASES = {
    "backrank_mate": "back_rank_mate",
    "arab_mate": "arabian_mate",
}


def _normalize_theme(raw: str) -> str:
    snake = re.sub(r"(?<!^)(?=[A-Z])", "_", raw).lower()
    return THEME_ALIASES.get(snake, snake)


def _auto_detect_theme(fen: str, solution: list[str], fallback: str) -> str:
    """Auto-detect checkmate; return fallback if nothing is detected."""
    try:
        board = chess.Board(fen)
        for uci in solution:
            try:
                board.push_uci(uci)
            except Exception:
                return fallback
        if board.is_checkmate():
            return "checkmate"
    except Exception:
        pass
    return fallback


def detect_block_type(text: str) -> Literal["puzzle", "game", "unknown"]:
    lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
    if not lines:
        return "unknown"

    first = lines[0]
    if first.startswith("["):
        return "game"

    for line in lines:
        if line.startswith("fen:"):
            return "puzzle"

    if re.search(r"\b\d+\s*[\.…]\.?\s*", text):
        return "game"

    if first.startswith("#") and len(lines) > 1:
        second = lines[1]
        if second.startswith("fen:"):
            return "puzzle"
        if re.search(r"\b\d+\s*[\.…]\.?\s*", second):
            return "game"

    return "unknown"


def split_blocks(content: str) -> list[str]:
    raw = re.split(r"\n\s*\n", content.strip())
    return [b.strip() for b in raw if b.strip()]


def parse_puzzle_block(text: str) -> dict | None:
    lines = [line.strip() for line in text.strip().split("\n")]
    data: dict[str, str] = {}
    for line in lines:
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()

    if "fen" not in data:
        return None

    solution_raw = data.get("moves") or data.get("solution", "")
    tokens = solution_raw.replace(".", " ").split()
    solution = [t for t in tokens if not t.isdigit()]

    difficulty_raw = data.get("difficulty", "5")
    try:
        difficulty = int(difficulty_raw)
    except ValueError:
        difficulty = 5

    theme_raw = data.get("theme")
    if theme_raw:
        themes = [_normalize_theme(t.strip()) for t in theme_raw.split(",") if t.strip()]
    else:
        guessed = _auto_detect_theme(data["fen"], solution, "fork")
        themes = [guessed]

    return {
        "fen": data["fen"],
        "solution": solution,
        "theme": themes,
        "difficulty": difficulty,
        "phase": data.get("phase", "middlegame"),
        "source": "manual",
        "user_id": 1,
    }
