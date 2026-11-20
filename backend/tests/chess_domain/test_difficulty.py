from app.chess_domain.difficulty import DifficultyCalculator


class TestDifficultyCalculator:
    def test_checkmate_base(self):
        assert DifficultyCalculator.calculate("checkmate", 2, False) == 6

    def test_fork_base(self):
        assert DifficultyCalculator.calculate("fork", 2, False) == 3

    def test_pin_base(self):
        assert DifficultyCalculator.calculate("pin", 2, False) == 5

    def test_capture_bonus(self):
        with_capture = DifficultyCalculator.calculate("fork", 2, True)
        without = DifficultyCalculator.calculate("fork", 2, False)
        assert with_capture == without + 1

    def test_medium_length_bonus(self):
        medium = DifficultyCalculator.calculate("fork", 4, False)
        short = DifficultyCalculator.calculate("fork", 2, False)
        assert medium == short + 2

    def test_long_length_bonus(self):
        long_ = DifficultyCalculator.calculate("fork", 6, False)
        short = DifficultyCalculator.calculate("fork", 2, False)
        assert long_ == short + 4

    def test_default_for_unknown_theme(self):
        assert DifficultyCalculator.calculate("unknown", 2, False) == 3

    def test_clamps_to_range(self):
        assert DifficultyCalculator.calculate("hanging_piece", 1, False) >= 1
        assert DifficultyCalculator.calculate("checkmate", 10, True) <= 10
