from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from urllib.parse import urlencode
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token, get_current_user
from app.models.user import User
from app.schemas.user import UserOut
from app.services.google_oauth import exchange_code_for_token, get_google_user
from jose import JWTError

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"


@router.get("/google")
async def login_google():
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
    }
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/callback")
async def auth_callback(code: str, response: Response, db: AsyncSession = Depends(get_db)):
    token_data = await exchange_code_for_token(code)
    user_info = await get_google_user(token_data["access_token"])

    result = await db.execute(select(User).where(User.email == user_info["email"]))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(
            email=user_info["email"],
            name=user_info.get("name", ""),
            picture=user_info.get("picture", ""),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        from datetime import datetime, timezone
        user.last_login = datetime.now(timezone.utc)
        await db.commit()

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    redirect_url = f"{settings.FRONTEND_URL}/auth/callback?access_token={access_token}"
    redirect = RedirectResponse(url=redirect_url)
    redirect.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60 * 60 * 24 * 7,
    )
    return redirect


@router.post("/refresh")
async def refresh_token(refresh_token: str | None = Cookie(default=None), db: AsyncSession = Depends(get_db)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"access_token": create_access_token({"sub": str(user.id)})}


users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
