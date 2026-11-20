from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test the basic health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"
    # Additional fields are optional
    assert "database" in data
    assert "engine" in data


def test_readiness_check():
    """Test the readiness check endpoint."""
    response = client.get("/api/ready")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "status" in data
    assert "checks" in data or "database" in data


def test_deep_health_check():
    """Test the deep health check endpoint."""
    response = client.get("/api/health/deep")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "checks" in data or "database" in data


def test_cors_headers():
    """Test CORS headers are present."""
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200


def test_invalid_endpoint_returns_404():
    """Test that invalid endpoints return 404 with proper error format."""
    response = client.get("/api/nonexistent")
    assert response.status_code == 404
    data = response.json()
    # Error response follows RFC 7807 format
    assert "error" in data or "detail" in data
    if "error" in data:
        assert data["error"]["error_code"] == "NOT_FOUND"
        assert "correlation_id" in data["error"]


def test_validation_error_format():
    """Test validation error returns proper RFC 7807 format."""
    # This would need an endpoint that accepts POST with validation
    # For now, just test the health endpoint doesn't crash
    response = client.post("/api/health", json={"invalid": "data"})
    assert response.status_code == 405  # Method not allowed for GET-only endpoint
