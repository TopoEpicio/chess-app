from dataclasses import dataclass, field
from enum import StrEnum


class PuzzleTheme(StrEnum):
    FORK = "fork"
    PIN = "pin"
    SKEWER = "skewer"
    DOUBLE_ATTACK = "double_attack"
    CHECKMATE = "checkmate"
    HANGING_PIECE = "hanging_piece"
    DISCOVERED_ATTACK = "discovered_attack"


class GamePhase(StrEnum):
    OPENING = "opening"
    MIDDLEGAME = "middlegame"
    ENDGAME = "endgame"


@dataclass
class TacticalMoment:
    fen_before: str
    winning_move_san: str
    theme: PuzzleTheme
    solution: list[str] = field(default_factory=list)
    difficulty: int = 5
    phase: GamePhase = GamePhase.MIDDLEGAME
