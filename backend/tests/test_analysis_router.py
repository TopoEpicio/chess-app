"""TDD: analysis router — import populates new columns, list supports filters."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

PGN_WITH_TAGS = """[Event "Test Match"]
[Site "?"]
[Date "2024.01.15"]
[Round "1"]
[White "Carlsen, Magnus"]
[Black "Nakamura, Hikaru"]
[Result "1-0"]
[ECO "C00"]
[Opening "French Defense"]

1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 c4 1-0"""

PGN_MINIMAL = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O"

PGN_THIRD = """[Event "Game 3"]
[White "Caruana, Fabiano"]
[Black "Ding, Liren"]
[Result "0-1"]
[ECO "D37"]
[Date "2023.05.10"]

1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 exd5 9. Bxf6 Bxf6 10. Qd2 Be6 11. Bd3 c5 12. dxc5 bxc5 13. O-O Qc7 14. Rfc1 Nc6 15. a3 a5 16. Qe2 d4 17. exd4 cxd4 18. Ne4 Be7 19. Qc2 f5 20. Nc5 Qxc2 21. Rxc2 Bxc5 22. Rxc5 d3 23. Rd1 dxc2 24. Rxd8+ Rxd8 25. Bc4+ Kh8 26. Bxa5 Rb8 27. b4 g5 28. Kg1 Kg7 29. Kf1 Kf6 30. Ke2 Ke5 31. Kd2 f4 32. h4 gxh4 33. Rxh4 Rb5 34. Bc7+ Ke4 35. Bxb5 Kxb5 36. Rxf4 Nxb4 37. Rxb4+ Kxb4 0-1"""


@pytest.fixture
def clean_db():
    engine = create_engine("sqlite:///./test_analysis.db", connect_args={"check_same_thread": False})
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
    yield
    Base.metadata.drop_all(bind=engine)
    if old:
        app.dependency_overrides[get_db] = old
    else:
        app.dependency_overrides.pop(get_db, None)


client = TestClient(app)


class TestImportPgn:
    def test_import_pgn_populates_new_columns(self, clean_db):
        resp = client.post("/api/analysis/import-pgn", json={"pgn_text": PGN_WITH_TAGS})
        assert resp.status_code == 200
        _ = resp.json()["id"]

        list_resp = client.get("/api/analysis/?user_id=1")
        assert list_resp.status_code == 200
        games = list_resp.json()
        assert len(games) == 1
        g = games[0]
        assert g["white"] == "Carlsen, Magnus"
        assert g["black"] == "Nakamura, Hikaru"
        assert g["result"] == "1-0"
        assert g["eco"] == "C00"
        assert g["date"] == "2024.01.15"
        assert g["num_moves"] > 0

    def test_import_minimal_pgn_still_works(self, clean_db):
        resp = client.post("/api/analysis/import-pgn", json={"pgn_text": PGN_MINIMAL})
        assert resp.status_code == 200

        list_resp = client.get("/api/analysis/?user_id=1")
        games = list_resp.json()
        assert len(games) == 1
        g = games[0]
        assert g["white"] is None
        assert g["black"] is None
        assert g["eco"] is None
        assert g["date"] is None
        assert g["num_moves"] == 16


class TestListFilters:
    @pytest.fixture(autouse=True)
    def seed_games(self, clean_db):
        for pgn in [PGN_WITH_TAGS, PGN_MINIMAL, PGN_THIRD]:
            client.post("/api/analysis/import-pgn", json={"pgn_text": pgn})

    def test_list_all(self):
        resp = client.get("/api/analysis/?user_id=1")
        assert resp.status_code == 200
        games = resp.json()
        assert len(games) == 3

    def test_filter_by_result(self):
        resp = client.get("/api/analysis/?user_id=1&result=1-0")
        games = resp.json()
        assert all(g["result"] == "1-0" for g in games)
        assert len(games) == 1

    def test_filter_by_white(self):
        resp = client.get("/api/analysis/?user_id=1&white=Carlsen")
        games = resp.json()
        assert len(games) == 1
        assert "Carlsen" in games[0]["white"]

    def test_filter_by_black(self):
        resp = client.get("/api/analysis/?user_id=1&black=Nakamura")
        games = resp.json()
        assert len(games) == 1
        assert "Nakamura" in games[0]["black"]

    def test_filter_by_year(self):
        resp = client.get("/api/analysis/?user_id=1&year=2024")
        games = resp.json()
        assert len(games) == 1
        assert games[0]["date"] == "2024.01.15"

    def test_filter_by_eco(self):
        resp = client.get("/api/analysis/?user_id=1&eco=C00")
        games = resp.json()
        assert len(games) == 1
        assert games[0]["eco"] == "C00"

    def test_filter_by_opening(self):
        resp = client.get("/api/analysis/?user_id=1&opening=French")
        games = resp.json()
        assert len(games) == 1
        assert games[0]["opening_name"] == "French Defense"

    def test_filter_multiple(self):
        resp = client.get("/api/analysis/?user_id=1&white=Carlsen&year=2024")
        games = resp.json()
        assert len(games) == 1

    def test_filter_no_match_returns_empty(self):
        resp = client.get("/api/analysis/?user_id=1&white=ZZZZ")
        games = resp.json()
        assert len(games) == 0

    def test_filter_by_black_partial(self):
        resp = client.get("/api/analysis/?user_id=1&black=ren")
        games = resp.json()
        assert len(games) == 1
        assert "Liren" in games[0]["black"]
