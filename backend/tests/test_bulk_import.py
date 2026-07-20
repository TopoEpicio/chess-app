"""TDD: bulk import — detect_block_type, parse_puzzle_block, split_blocks."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.services.bulk_import import detect_block_type, parse_puzzle_block, split_blocks

client = TestClient(app)


@pytest.fixture
def bulk_db():
    """Per-test isolated SQLite database to avoid cross-file dependency_overrides conflicts."""
    engine = create_engine("sqlite:///./test_bulk.db", connect_args={"check_same_thread": False})
    testing_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def _get_db():
        db = testing_session()
        try:
            yield db
        finally:
            db.close()

    old = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = _get_db
    yield engine
    Base.metadata.drop_all(bind=engine)
    if old:
        app.dependency_overrides[get_db] = old
    else:
        app.dependency_overrides.pop(get_db, None)


class TestDetectBlockType:
    def test_pgn_with_tags(self):
        block = '[Event "Test"]\n[Site "?"]\n1. e4 e5'
        assert detect_block_type(block) == "game"

    def test_puzzle_with_fen(self):
        block = "fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\nsolution: e4\ntheme: fork"
        assert detect_block_type(block) == "puzzle"

    def test_naked_pgn_with_move_number(self):
        block = "1. e4 e5 2. Nf3 Nc6"
        assert detect_block_type(block) == "game"

    def test_naked_pgn_with_ellipsis(self):
        block = "1... e5 2. Nf3 Nc6"
        assert detect_block_type(block) == "game"

    def test_puzzle_with_comment_line(self):
        block = "# Reti study\nfen: 7K/8/k1P5/7p/8/8/8/8 w - - 0 1\nsolution: Kg7\ntheme: pawn_endgame"
        assert detect_block_type(block) == "puzzle"

    def test_game_with_comment_line(self):
        block = "# Morphy vs Duke\n1. e4 e5 2. Nf3 d6"
        assert detect_block_type(block) == "game"

    def test_garbage_text_returns_unknown(self):
        block = "some random text\nwithout any chess content"
        assert detect_block_type(block) == "unknown"

    def test_empty_string_returns_unknown(self):
        assert detect_block_type("") == "unknown"
        assert detect_block_type("   \n\n  ") == "unknown"

    def test_fen_line_not_at_start(self):
        block = "Some description\nfen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        assert detect_block_type(block) == "puzzle"

    def test_pgn_tag_with_comment_before(self):
        block = "# A famous game\n[Event \"Immortal\"]\n1. e4"
        assert detect_block_type(block) == "game"

    def test_multi_puzzle_file_line(self):
        block = "fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        assert detect_block_type(block) == "puzzle"

    def test_solution_with_move_numbers(self):
        block = "fen: r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1\nsolution: 1. Bxf7+ Kxf7 2. Ng5+ Kg8 3. Ne6"
        assert detect_block_type(block) == "puzzle"


class TestParsePuzzleBlock:
    def test_minimal_puzzle(self):
        block = "fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\nsolution: e4"
        result = parse_puzzle_block(block)
        assert result is not None
        assert result["fen"] == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        assert result["solution"] == ["e4"]

    def test_full_puzzle_with_optional_fields(self):
        block = (
            "# Fork example\n"
            "fen: r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1\n"
            "solution: Bxf7+ Kxf7 Ng5+ Kg8 Ne6\n"
            "theme: fork\n"
            "difficulty: 6\n"
            "phase: opening\n"
        )
        result = parse_puzzle_block(block)
        assert result is not None
        assert result["theme"] == ["fork"]
        assert result["difficulty"] == 6
        assert result["phase"] == "opening"
        assert result["solution"] == ["Bxf7+", "Kxf7", "Ng5+", "Kg8", "Ne6"]

    def test_defaults_for_missing_fields(self):
        block = "fen: start\nsolution: e4"
        result = parse_puzzle_block(block)
        assert result is not None
        assert result["theme"] == ["fork"]
        assert result["difficulty"] == 5
        assert result["phase"] == "middlegame"
        assert result["source"] == "manual"
        assert result["user_id"] == 1

    def test_ignores_comment_lines(self):
        block = "# Some study\n# Author: unknown\nfen: 8/8/8/8/8/5K2/6R1/7k b - - 0 1\nsolution: Rd1\ntheme: rook_endgame"
        result = parse_puzzle_block(block)
        assert result is not None
        assert result["fen"].startswith("8/8/8/8/8/5K2")
        assert result["theme"] == ["rook_endgame"]

    def test_invalid_block_returns_none(self):
        assert parse_puzzle_block("not a puzzle") is None
        assert parse_puzzle_block("") is None

    def test_solution_with_move_numbers_ignored(self):
        block = "fen: start\nsolution: 1. e4 2. Nf3 Nc6"
        result = parse_puzzle_block(block)
        assert result is not None
        assert result["solution"] == ["e4", "Nf3", "Nc6"]


class TestSplitBlocks:
    def test_single_block(self):
        blocks = split_blocks("fen: start\nsolution: e4")
        assert len(blocks) == 1
        assert "fen: start" in blocks[0]

    def test_multiple_blocks_separated_by_empty_line(self):
        text = "fen: start\nsolution: e4\n\nfen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\nsolution: d4"
        blocks = split_blocks(text)
        assert len(blocks) == 2
        assert "solution: e4" in blocks[0]
        assert "solution: d4" in blocks[1]

    def test_ignores_empty_lines_at_edges(self):
        text = "\n\nfen: start\nsolution: e4\n\n"
        blocks = split_blocks(text)
        assert len(blocks) == 1

    def test_multiple_trailing_newlines(self):
        text = "fen: start\nsolution: e4\n\n\n\nfen: other\nsolution: d4\n\n"
        blocks = split_blocks(text)
        assert len(blocks) == 2


class TestBulkImportEndpoints:
    @pytest.fixture(autouse=True)
    def _with_db(self, bulk_db):
        pass
    def test_preview_identifies_puzzle(self):
        response = client.post("/api/import/preview", json={
            "content": "fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\nsolution: e4\ntheme: fork"
        })
        assert response.status_code == 200
        data = response.json()
        assert len(data["blocks"]) == 1
        assert data["blocks"][0]["type"] == "puzzle"

    def test_preview_identifies_game(self):
        response = client.post("/api/import/preview", json={
            "content": "[Event \"Test\"]\n1. e4 e5"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["blocks"][0]["type"] == "game"

    def test_preview_mixed_content(self):
        response = client.post("/api/import/preview", json={
            "content": (
                "fen: start\nsolution: e4\ntheme: fork\n\n"
                "[Event \"Game\"]\n1. d4 d5\n\n"
                "some random text"
            )
        })
        assert response.status_code == 200
        data = response.json()
        assert len(data["blocks"]) == 3
        assert data["blocks"][0]["type"] == "puzzle"
        assert data["blocks"][1]["type"] == "game"
        assert data["blocks"][2]["type"] == "unknown"

    def test_bulk_import_puzzles(self):
        response = client.post("/api/import/bulk", json={
            "content": "fen: start\nsolution: e4\ntheme: fork\n\nfen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1\nsolution: e5\ntheme: double_attack",
            "types": {"0": "puzzle", "1": "puzzle"},
        })
        assert response.status_code == 200
        data = response.json()
        assert data["puzzles"]["imported"] == 2
        assert data["games"]["imported"] == 0
        assert data["total"] == 2

    def test_bulk_import_games_only(self):
        response = client.post("/api/import/bulk", json={
            "content": "[Event \"Game1\"]\n1. e4 e5\n\n[Event \"Game2\"]\n1. d4 d5",
            "types": {"0": "game", "1": "game"},
        })
        assert response.status_code == 200
        data = response.json()
        assert data["games"]["imported"] == 2
        assert data["puzzles"]["imported"] == 0
        assert data["total"] == 2

    def test_bulk_import_partial_errors(self):
        response = client.post("/api/import/bulk", json={
            "content": "fen: start\nsolution: e4\ntheme: fork\n\ninvalid block without fen",
            "types": {"0": "puzzle", "1": "puzzle"},
        })
        assert response.status_code == 200
        data = response.json()
        assert data["puzzles"]["imported"] == 1
        assert len(data["puzzles"]["errors"]) == 1

    def test_bulk_import_empty_content_returns_400(self):
        response = client.post("/api/import/bulk", json={
            "content": "",
            "types": {},
        })
        assert response.status_code == 400

    def test_preview_returns_empty_for_empty_content(self):
        response = client.post("/api/import/preview", json={"content": ""})
        assert response.status_code == 200
        assert response.json()["blocks"] == []
