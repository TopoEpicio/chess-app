"""Feedback loop for /api/puzzles/stats/categories 404 bug."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.domain.adapters.heuristic_generator import HeuristicPuzzleGenerator
from app.main import app
from app.models.puzzle import Puzzle

SAMPLE_PGN = """[Event "Test"]
[Site "?"]
[Date "2024.01.01"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8
14. Ng3 g6 15. Bg5 h6 16. Bd2 Bg7 17. d5 Qe7 18. a4 Nh7 19. axb5 axb5
20. Rxa8 Bxa8 21. Qe2 Qd8 22. Nh4 g5 23. Nhf5 Bf8 24. g4 Nb6 25. Bg3 Bg7
26. Nh6+ Kh8 27. Nef5 Kg8 28. Qd3 Qf6 29. Qc3 Qxc3 30. bxc3 Nxd5 31. cxd5 Bxd5
32. Bxg7 Kxg7 33. Nf5+ Bxf5 34. gxf5 Ne5 35. Be4 Ng4 36. Bxh6+ Kxh6
37. Nxg4+ Kg7 38. f6+ Kf8 39. Nh6 Re7 40. f4 c6 41. Kf2 Kf7 42. Nf5 Re8
43. Ke3 Nh7 44. Ne7 Re7 45. f5 Nd8 46. e5 Nc6 47. Ng6 Rg7 48. Nh4 Ra7
49. Ng6 Ra2 50. Nf4 Rb2 51. h4 Rb1 52. Kf2 Rb2+ 53. Ke3 Rb1 54. Kf2 Rb2+
55. Ke1 Rb1+ 56. Kd2 Ra1 57. f6 Ra8 58. Ng6 Ra2+ 59. Kd3 Ra8 60. Nh4 Ra2
61. f4 Ra8 62. f5 Ra2 63. f7 Kg7 64. f8=Q+ Kxf8 65. Ng6+ Kg7 66. Nh4 Ra3+
67. Kd4 Ra4+ 68. Kd5 Ra5+ 69. Kd6 Ra6+ 70. Kc7 Rc6+ 71. Kb7 Kf6
72. <emphasis>e6 Rxe6</emphasis>"""




SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


class TestPuzzleGenerator:
    def test_generate_moments_from_pgn(self):
        gen = HeuristicPuzzleGenerator()
        moments = gen.generate_moments(SAMPLE_PGN)
        assert len(moments) > 0
        for m in moments:
            assert m.fen_before
            assert m.winning_move_san
            assert m.theme
            assert len(m.solution) >= 1
            assert 1 <= m.difficulty <= 10
            assert m.phase in ("opening", "middlegame", "endgame")

    def test_generate_from_empty_pgn(self):
        gen = HeuristicPuzzleGenerator()
        moments = gen.generate_moments("")
        assert moments == []

    def test_puzzle_from_moment_shape(self):
        gen = HeuristicPuzzleGenerator()
        moments = gen.generate_moments(SAMPLE_PGN)
        assert len(moments) > 0
        puzzle = HeuristicPuzzleGenerator.generate_puzzle_from_moment(moments[0], game_id=1)
        assert "fen" in puzzle
        assert "solution" in puzzle
        assert "theme" in puzzle
        assert isinstance(puzzle["theme"], list)
        assert "difficulty" in puzzle
        assert "phase" in puzzle
        assert "source_game_id" in puzzle


class TestPuzzlesStatsCategories:
    def test_stats_categories_returns_200(self):
        response = client.get("/api/puzzles/stats/categories")
        assert response.status_code == 200

    def test_stats_categories_with_data(self):
        db = TestingSessionLocal()
        db.add(Puzzle(user_id=1, fen="test", solution=["e4"], theme="fork", difficulty=3, phase="opening"))
        db.commit()
        db.close()

        response = client.get("/api/puzzles/stats/categories")
        assert response.status_code == 200
        data = response.json()
        assert "motifs" in data
        assert data["motifs"]["subs"]["fork"] == 1
