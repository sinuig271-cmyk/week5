from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.course import Course, Section
from app.models.subscription import Subscription
from app.schemas.course import CourseOut, SectionOut, SectionContentOut

router = APIRouter(tags=["courses"])


async def get_active_subscription(db: AsyncSession, user_id: int) -> Subscription | None:
    result = await db.execute(
        select(Subscription).where(
            Subscription.user_id == user_id,
            Subscription.status == "active",
            Subscription.expires_at > datetime.now(timezone.utc),
        )
    )
    return result.scalar_one_or_none()


@router.get("/courses", response_model=list[CourseOut])
async def list_courses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Course).where(Course.is_published == True))
    return result.scalars().all()


@router.get("/courses/{course_id}/sections", response_model=list[SectionOut])
async def list_sections(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Section).where(Section.course_id == course_id).order_by(Section.order)
    )
    return result.scalars().all()


@router.get("/sections/{section_id}/content", response_model=SectionContentOut)
async def get_section_content(
    section_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    section = await db.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    if not section.is_free:
        sub = await get_active_subscription(db, current_user.id)
        if not sub:
            raise HTTPException(status_code=403, detail="PREMIUM_REQUIRED")
    return section
