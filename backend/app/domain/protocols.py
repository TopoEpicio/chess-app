from typing import Protocol

from app.chess_domain.types import TacticalMoment


class PuzzleGenerator(Protocol):
    """Protocol for puzzle generation algorithms."""

    def generate_moments(
        self, game_pgn: str, min_move_number: int = 8
    ) -> list[TacticalMoment]:
        ...

    def generate_moments_from_key_moments(
        self, items: list[dict]
    ) -> list[TacticalMoment]:
        ...


class PuzzleRepository(Protocol):
    """Protocol for puzzle persistence."""

    def save(
        self,
        moment: TacticalMoment,
        game_id: int,
        user_id: int = 1,
    ) -> dict:
        ...

    def find_by_id(self, puzzle_id: int) -> dict | None:
        ...

    def list(
        self,
        theme: str | None = None,
        difficulty: int | None = None,
        phase: str | None = None,
        category: str | None = None,
        subcategory: str | None = None,
        page: int = 0,
        per_page: int = 50,
    ) -> list[dict]:
        ...

    def count_by_category(self) -> dict:
        ...

    def delete(self, puzzle_id: int) -> bool:
        ...
