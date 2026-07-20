import hashlib
from io import StringIO

import chess
import chess.pgn
from pydantic import BaseModel


class MoveItem(BaseModel):
    move_number: int
    san: str
    fen: str
    is_white: bool


def _clean(val):
    return None if val in (None, "", "?", "????.??.??") else val


def populate_game_headers(game):
    """Extract PGN headers and populate model columns on a GameAnalysis instance."""
    h = parse_pgn_headers(game.pgn)
    if h:
        game.white = _clean(h.get("White"))
        game.black = _clean(h.get("Black"))
        game.eco = _clean(h.get("ECO"))
        game.event_date = _clean(h.get("Date"))
        game.opening_name = _clean(h.get("Opening"))
        result = _clean(h.get("Result"))
        if result and result != "*":
            game.result = result


def parse_pgn(pgn_text: str) -> dict | None:
    """Parse a PGN string and return structured game data."""
    game = chess.pgn.read_game(StringIO(pgn_text))
    if game is None:
        return None

    headers = dict(game.headers.items())

    moves = []
    board = game.board()
    for node in game.mainline_moves():
        san = board.san(node)
        board.push(node)
        moves.append({"fen": board.fen(), "san": san})

    return {
        "headers": headers,
        "moves": moves,
        "fen": board.fen(),
        "result": headers.get("Result", "*"),
    }


def parse_pgn_headers(pgn_text: str) -> dict:
    """Extract headers from a PGN string."""
    parsed = parse_pgn(pgn_text)
    return parsed["headers"] if parsed else {}


def parse_pgn_moves(pgn_text: str) -> list[MoveItem]:
    """Parse PGN and return list of moves with FENs."""
    parsed = parse_pgn(pgn_text)
    if not parsed:
        return []

    moves = []
    move_number = 1
    board = chess.Board()
    for move_data in parsed["moves"]:
        # We need to recalculate is_white from the board state
        san = move_data["san"]
        is_white = board.turn == chess.WHITE
        moves.append(MoveItem(
            move_number=move_number,
            san=san,
            fen=move_data["fen"],
            is_white=is_white,
        ))
        board.push_san(san)
        if is_white:
            move_number += 1

    return moves


def count_moves(pgn_text: str) -> int:
    """Count total half-moves in a PGN."""
    parsed = parse_pgn(pgn_text)
    if not parsed:
        return 0
    return len(parsed["moves"])


def extract_variations(pgn_text: str) -> list[dict]:
    """Extract main line and variations from a PGN file."""
    game = chess.pgn.read_game(StringIO(pgn_text))
    if game is None:
        return []

    variations = []
    board = game.board()

    def walk(node, board, depth=0, parent_moves=None):
        if parent_moves is None:
            parent_moves = []
        if node.move is not None:
            san = board.san(node.move)
            current_moves = parent_moves + [san]
            variations.append({
                "moves": current_moves,
                "fen": board.fen(),
            })
        if node.variations:
            for variation in node.variations:
                child_board = board.copy()
                if variation.move:
                    child_board.push(variation.move)
                walk(variation, child_board, depth + 1, current_moves if node.move else [])

    walk(game, board)
    return variations


def pgn_key(pgn: str) -> str:
    """Deterministic hash of normalized PGN for dedup."""
    return hashlib.sha256(" ".join(pgn.split()).encode()).hexdigest()


def get_existing_game_keys(user_id: int, db) -> set[str]:
    """Return set of normalized PGN hashes for all games belonging to user."""
    from app.models.analysis import GameAnalysis
    return {
        pgn_key(g.pgn)
        for g in db.query(GameAnalysis.pgn).filter(GameAnalysis.user_id == user_id).all()
    }


def fen_to_repertoire_tree(fen: str, eco: str | None = None) -> dict:
    """Convert a FEN position to a repertoire tree node structure."""
    return {
        "fen": fen,
        "eco_code": eco,
        "color_code": "green",
    }
