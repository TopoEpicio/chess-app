from app.chess_domain.phase import PhaseDetector
from app.chess_domain.types import GamePhase


class TestPhaseDetector:
    def test_opening_for_low_move_count(self):
        result = PhaseDetector.detect(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 8
        )
        assert result == GamePhase.OPENING

    def test_endgame_when_few_non_pawn_pieces(self):
        result = PhaseDetector.detect("4k3/8/8/8/8/8/8/4K3 w - - 0 1", 30)
        assert result == GamePhase.ENDGAME

    def test_middlegame_for_typical_position(self):
        result = PhaseDetector.detect(
            "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
            15,
        )
        assert result == GamePhase.MIDDLEGAME
