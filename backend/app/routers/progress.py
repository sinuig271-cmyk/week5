from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.progress import UserProgress
from app.schemas.progress import ProgressIn, ProgressOut

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("", response_model=list[ProgressOut])
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    return result.scalars().all()


@router.post("", response_model=ProgressOut)
async def mark_complete(
    body: ProgressIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        insert(UserProgress)
        .values(user_id=current_user.id, section_id=body.section_id)
        .on_conflict_do_nothing(index_elements=["user_id", "section_id"])
    )
    await db.execute(stmt)
    await db.commit()
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.section_id == body.section_id,
        )
    )
    return result.scalar_one()
