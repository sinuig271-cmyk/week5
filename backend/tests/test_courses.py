import pytest
import pytest_asyncio
from app.models.course import Course, Section

pytestmark = pytest.mark.asyncio


@pytest_asyncio.fixture
async def week5_course(db_session):
    course = Course(title="Week 5", week_number=5, description="DL", is_published=True)
    db_session.add(course)
    await db_session.flush()
    sections = [
        Section(course_id=course.id, order=1, title="Regularization", content_md="# R", is_free=True),
        Section(course_id=course.id, order=2, title="Overfitting", content_md="# O", is_free=True),
        Section(course_id=course.id, order=3, title="Augmentation", content_md="# A premium", is_free=False),
    ]
    for s in sections:
        db_session.add(s)
    await db_session.commit()
    return course


async def test_get_courses(client, auth_headers, week5_course):
    resp = await client.get("/courses", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["week_number"] == 5


async def test_get_sections(client, auth_headers, week5_course):
    resp = await client.get(f"/courses/{week5_course.id}/sections", headers=auth_headers)
    assert resp.status_code == 200
    sections = resp.json()
    assert len(sections) == 3


async def test_free_section_content_accessible(client, auth_headers, week5_course):
    resp = await client.get(f"/courses/{week5_course.id}/sections", headers=auth_headers)
    free_section_id = next(s["id"] for s in resp.json() if s["is_free"])
    resp2 = await client.get(f"/sections/{free_section_id}/content", headers=auth_headers)
    assert resp2.status_code == 200
    assert "content_md" in resp2.json()


async def test_premium_section_blocked_for_free_user(client, auth_headers, week5_course):
    resp = await client.get(f"/courses/{week5_course.id}/sections", headers=auth_headers)
    premium_section_id = next(s["id"] for s in resp.json() if not s["is_free"])
    resp2 = await client.get(f"/sections/{premium_section_id}/content", headers=auth_headers)
    assert resp2.status_code == 403
    assert resp2.json()["detail"] == "PREMIUM_REQUIRED"


async def test_premium_section_accessible_for_premium_user(client, premium_headers, week5_course, db_session):
    from app.models.subscription import Subscription
    from datetime import datetime, timezone, timedelta
    from sqlalchemy import select
    from app.models.user import User
    result = await db_session.execute(select(User).where(User.plan == "premium"))
    p_user = result.scalar_one()
    sub = Subscription(
        user_id=p_user.id,
        polar_sub_id="sub_test",
        plan="monthly",
        status="active",
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
    )
    db_session.add(sub)
    await db_session.commit()

    resp = await client.get(f"/courses/{week5_course.id}/sections", headers=premium_headers)
    premium_section_id = next(s["id"] for s in resp.json() if not s["is_free"])
    resp2 = await client.get(f"/sections/{premium_section_id}/content", headers=premium_headers)
    assert resp2.status_code == 200
