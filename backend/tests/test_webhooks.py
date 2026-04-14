import pytest
import hmac
import hashlib
import json
from app.core.config import settings

pytestmark = pytest.mark.asyncio


def make_signature(payload: bytes, secret: str) -> str:
    return hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()


async def test_webhook_invalid_signature(client):
    payload = json.dumps({"type": "subscription.created"}).encode()
    resp = await client.post(
        "/webhooks/polar",
        content=payload,
        headers={"X-Polar-Signature": "bad_sig", "Content-Type": "application/json"},
    )
    assert resp.status_code == 400


async def test_webhook_subscription_created(client, db_session):
    from app.models.user import User
    user = User(email="polar@example.com", name="Polar User", picture="", plan="free")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    payload = json.dumps({
        "type": "subscription.created",
        "data": {
            "id": "sub_123",
            "customer": {"email": "polar@example.com"},
            "product": {"name": "monthly"},
            "current_period_end": "2026-05-14T00:00:00Z",
        }
    }).encode()
    secret = settings.POLAR_WEBHOOK_SECRET or "test_secret"
    sig = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()

    resp = await client.post(
        "/webhooks/polar",
        content=payload,
        headers={"X-Polar-Signature": sig, "Content-Type": "application/json"},
    )
    assert resp.status_code == 200
    await db_session.refresh(user)
    assert user.plan == "premium"
