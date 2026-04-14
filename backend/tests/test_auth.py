import pytest
from unittest.mock import patch, AsyncMock

pytestmark = pytest.mark.asyncio


async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


async def test_get_me_unauthenticated(client):
    resp = await client.get("/users/me")
    assert resp.status_code == 401


async def test_get_me_authenticated(client, auth_headers, test_user):
    resp = await client.get("/users/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["plan"] == "free"


async def test_auth_callback_creates_user(client):
    mock_token_resp = {"access_token": "google_access_token"}
    mock_user_info = {
        "email": "newuser@example.com",
        "name": "New User",
        "picture": "https://example.com/pic.jpg",
    }
    with patch("app.routers.auth.exchange_code_for_token", new_callable=AsyncMock, return_value=mock_token_resp), \
         patch("app.routers.auth.get_google_user", new_callable=AsyncMock, return_value=mock_user_info):
        resp = await client.get("/auth/callback?code=fake_code", follow_redirects=False)
    assert resp.status_code == 307
    location = resp.headers["location"]
    assert "access_token=" in location


async def test_refresh_invalid_token(client):
    resp = await client.post("/auth/refresh", cookies={"refresh_token": "bad_token"})
    assert resp.status_code == 401
