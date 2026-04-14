import hmac
import hashlib
from app.core.config import settings


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    secret = settings.POLAR_WEBHOOK_SECRET or "test_secret"
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
