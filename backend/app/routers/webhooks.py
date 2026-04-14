from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from datetime import datetime
from app.core.database import get_db
from app.models.user import User
from app.models.subscription import Subscription
from app.services.polar import verify_webhook_signature

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/polar")
async def polar_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get("X-Polar-Signature", "")

    if not verify_webhook_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    event_type = data.get("type")
    event_data = data.get("data", {})

    email = event_data.get("customer", {}).get("email")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        return {"status": "user_not_found"}

    polar_sub_id = event_data.get("id")
    plan = event_data.get("product", {}).get("name", "monthly")
    expires_str = event_data.get("current_period_end")
    expires_at = datetime.fromisoformat(expires_str.replace("Z", "+00:00")) if expires_str else None

    if event_type == "subscription.created":
        stmt = sqlite_insert(Subscription).values(
            user_id=user.id, polar_sub_id=polar_sub_id, plan=plan,
            status="active", expires_at=expires_at,
        ).on_conflict_do_update(index_elements=["polar_sub_id"], set_={"status": "active", "expires_at": expires_at})
        await db.execute(stmt)
        user.plan = "premium"
        await db.commit()

    elif event_type == "subscription.updated":
        result2 = await db.execute(select(Subscription).where(Subscription.polar_sub_id == polar_sub_id))
        sub = result2.scalar_one_or_none()
        if sub:
            sub.expires_at = expires_at
            await db.commit()

    elif event_type == "subscription.canceled":
        result2 = await db.execute(select(Subscription).where(Subscription.polar_sub_id == polar_sub_id))
        sub = result2.scalar_one_or_none()
        if sub:
            sub.status = "canceled"
        user.plan = "free"
        await db.commit()

    return {"status": "ok"}
