from app.chess_domain.eval import PositionEvaluator


class TestPositionEvaluator:
    def test_starting_position_is_equal(self):
        assert (
            PositionEvaluator.evaluate(
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            )
            == 0
        )

    def test_white_up_queen(self):
        result = PositionEvaluator.evaluate(
            "rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        )
        assert result > 0

    def test_black_up_queen(self):
        result = PositionEvaluator.evaluate(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1"
        )
        assert result < 0

    def test_kings_only(self):
        assert PositionEvaluator.evaluate("4k3/8/8/8/8/8/8/4K3 w - - 0 1") == 0
