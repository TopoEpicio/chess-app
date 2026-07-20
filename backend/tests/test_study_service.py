"""Tests for StudyService extracted from routers/study.py."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models.study import StudyFolder

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_study.db"
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


class TestStudyFolderCrud:
    def test_create_root_folder(self):
        resp = client.post("/api/study/folders", json={"name": "Root"})
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Root"
        assert data["parent_id"] is None

    def test_create_subfolder(self):
        root = client.post("/api/study/folders", json={"name": "Root"}).json()
        resp = client.post("/api/study/folders", json={"name": "Sub", "parent_id": root["id"]})
        assert resp.status_code == 201
        assert resp.json()["parent_id"] == root["id"]

    def test_delete_folder_returns_ok(self):
        folder = client.post("/api/study/folders", json={"name": "Temp"}).json()
        resp = client.delete(f"/api/study/folders/{folder['id']}")
        assert resp.status_code == 200
        assert resp.json()["ok"] is True

    def test_delete_nonexistent_folder_returns_404(self):
        resp = client.delete("/api/study/folders/999")
        assert resp.status_code == 404

    def test_get_root_returns_folders(self):
        client.post("/api/study/folders", json={"name": "A"})
        client.post("/api/study/folders", json={"name": "B"})
        resp = client.get("/api/study/root")
        assert resp.status_code == 200
        assert len(resp.json()["folders"]) == 2

    def test_get_folder_contents(self):
        folder = client.post("/api/study/folders", json={"name": "Root"}).json()
        resp = client.get(f"/api/study/folders/{folder['id']}/contents")
        assert resp.status_code == 200
        data = resp.json()
        assert data["folder"]["name"] == "Root"

    def test_update_folder(self):
        folder = client.post("/api/study/folders", json={"name": "Old"}).json()
        resp = client.patch(f"/api/study/folders/{folder['id']}", json={"name": "New"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "New"


class TestStudyResourceCrud:
    def test_create_resource(self):
        resp = client.post("/api/study/resources", json={
            "type": "pdf", "name": "Lesson 1",
        })
        assert resp.status_code == 201
        assert resp.json()["name"] == "Lesson 1"

    def test_get_resource(self):
        res = client.post("/api/study/resources", json={"type": "pdf", "name": "Doc"}).json()
        resp = client.get(f"/api/study/resources/{res['id']}")
        assert resp.status_code == 200

    def test_get_nonexistent_resource_404(self):
        resp = client.get("/api/study/resources/999")
        assert resp.status_code == 404

    def test_update_resource(self):
        res = client.post("/api/study/resources", json={"type": "pdf", "name": "Old"}).json()
        resp = client.patch(f"/api/study/resources/{res['id']}", json={"name": "New"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "New"

    def test_delete_resource(self):
        res = client.post("/api/study/resources", json={"type": "pdf", "name": "Temp"}).json()
        resp = client.delete(f"/api/study/resources/{res['id']}")
        assert resp.status_code == 200
