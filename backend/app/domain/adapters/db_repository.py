from datetime import date

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.domain.protocols import TacticalMoment
from app.models.puzzle import Puzzle, PuzzleAttempt
from app.models.stats import DailyStats

PUZZLE_CATEGORIES = {
    "phases": ["opening", "middlegame", "endgame", "rook_endgame", "bishop_endgame", "pawn_endgame", "knight_endgame", "queen_endgame", "queen_rook_endgame"],
    "motifs": ["fork", "pin", "skewer", "double_attack", "discovered_attack", "double_check", "exposed_king", "hanging_piece", "kingside_attack", "sacrifice", "trapped_piece", "advanced_pawn"],
    "mates": ["mate_in_1", "mate_in_2", "mate_in_3", "mate_in_4", "mate_in_5", "checkmate"],
    "mate-themes": ["back_rank_mate", "smothered_mate", "anastasia_mate", "arabian_mate", "boden_mate", "opera_mate", "hook_mate", "vukovic_mate", "double_bishop_mate", "epaulette_mate", "corner_mate"],
}

PHASE_THEMES = {"opening", "middlegame", "endgame"}


class SqlAlchemyPuzzleRepository:
    def __init__(self, db: Session):
        self.db = db

    def _ensure_daily_stats(self, user_id: int) -> DailyStats:
        today = date.today()
        stats = self.db.query(DailyStats).filter(
            DailyStats.user_id == user_id,
            DailyStats.stat_date == today,
        ).first()
        if not stats:
            stats = DailyStats(user_id=user_id, stat_date=today)
            self.db.add(stats)
            self.db.commit()
            self.db.refresh(stats)
        return stats

    def save(self, moment: TacticalMoment, game_id: int, user_id: int = 1) -> dict:
        puzzle = Puzzle(
            user_id=user_id,
            fen=moment.fen_before,
            solution=moment.solution,
            theme=[moment.theme],
            difficulty=moment.difficulty,
            phase=moment.phase,
            source="auto",
            source_game_id=game_id,
        )
        self.db.add(puzzle)
        self.db.commit()
        self.db.refresh(puzzle)
        return {
            "id": puzzle.id,
            "user_id": puzzle.user_id,
            "fen": puzzle.fen,
            "solution": puzzle.solution,
            "theme": puzzle.theme,
            "difficulty": puzzle.difficulty,
            "phase": puzzle.phase,
        }

    def save_puzzle_orm(self, puzzle: Puzzle) -> Puzzle:
        self.db.add(puzzle)
        self.db.commit()
        self.db.refresh(puzzle)
        return puzzle

    def find_by_id(self, puzzle_id: int) -> Puzzle | None:
        return self.db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()

    def list(
        self,
        theme: str | None = None,
        difficulty: int | None = None,
        phase: str | None = None,
        category: str | None = None,
        subcategory: str | None = None,
        page: int = 0,
        per_page: int = 50,
    ) -> list[Puzzle]:
        q = self.db.query(Puzzle)

        if subcategory and category:
            themes = PUZZLE_CATEGORIES.get(category, [])
            if subcategory in PHASE_THEMES:
                q = q.filter(Puzzle.phase == subcategory)
            elif subcategory in themes:
                q = q.filter(Puzzle.theme.contains(subcategory))
        elif category and category != "mix":
            themes = PUZZLE_CATEGORIES.get(category, [])
            phase_themes = [t for t in themes if t in PHASE_THEMES]
            other_themes = [t for t in themes if t not in PHASE_THEMES]
            filters = []
            if phase_themes:
                filters.append(Puzzle.phase.in_(phase_themes))
            if other_themes:
                filters.append(or_(*[Puzzle.theme.contains(t) for t in other_themes]))
            if filters:
                q = q.filter(or_(*filters))

        if theme:
            q = q.filter(Puzzle.theme.contains(theme))
        if difficulty:
            q = q.filter(Puzzle.difficulty == difficulty)
        if phase:
            q = q.filter(Puzzle.phase == phase)

        return q.offset(page * per_page).limit(per_page).all()

    def count_by_category(self) -> dict:
        total = self.db.query(Puzzle).count()
        result = {"mix": {"total": total, "subs": {}}}
        for cat_key, themes in PUZZLE_CATEGORIES.items():
            cat_total = 0
            subs = {}
            for theme_val in themes:
                if theme_val in PHASE_THEMES:
                    count = self.db.query(Puzzle).filter(Puzzle.phase == theme_val).count()
                else:
                    count = self.db.query(Puzzle).filter(Puzzle.theme.contains(theme_val)).count()
                subs[theme_val] = count
                cat_total += count
            result[cat_key] = {"total": cat_total, "subs": subs}
        return result

    def delete(self, puzzle_id: int) -> bool:
        puzzle = self.db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
        if not puzzle:
            return False
        self.db.query(PuzzleAttempt).filter(PuzzleAttempt.puzzle_id == puzzle_id).delete()
        self.db.delete(puzzle)
        self.db.commit()
        return True

    def save_attempt(self, attempt: PuzzleAttempt) -> PuzzleAttempt:
        self.db.add(attempt)
        stats = self._ensure_daily_stats(attempt.user_id)
        stats.puzzles_solved += 1
        if attempt.correct:
            stats.puzzles_correct += 1
        self.db.commit()
        self.db.refresh(attempt)
        return attempt
