import json
import os

import pytest
from chess import Board

from app.chess_domain.eval import PositionEvaluator
from app.chess_domain.phase import PhaseDetector

FIXTURES_PATH = os.path.join(
    os.path.dirname(__file__),
    "..", "..", "..", "shared-fixtures", "chess-domain-tests.json",
)


def load_fixtures():
    with open(FIXTURES_PATH) as f:
        return json.load(f)


class TestContract:
    @pytest.mark.parametrize("case", load_fixtures(), ids=lambda c: c["id"])
    def test_phase(self, case):
        board = Board(case["fen"])
        result = PhaseDetector.detect(case["fen"], board.fullmove_number).value
        assert result == case["expected"]["phase"]

    @pytest.mark.parametrize("case", load_fixtures(), ids=lambda c: c["id"])
    def test_eval(self, case):
        result = PositionEvaluator.evaluate(case["fen"])
        assert result == case["expected"]["eval"]
