from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_settings_returns_structure():
    response = client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert "i18n" in data
    assert "theme" in data
    assert "board" in data
    i18n = data["i18n"]
    assert i18n["default_locale"] == "en"
    assert "en" in i18n["supported_locales"]
    assert "it" in i18n["supported_locales"]
    theme = data["theme"]
    assert theme["default_theme"] in ("light", "dark", "auto")
    assert theme["default_board_theme"] in ("default", "blue", "green", "brown")
    board = data["board"]
    assert isinstance(board["square_opacity"], float)
    assert isinstance(board["piece_shadow"], bool)
