import pytest

pytestmark = pytest.mark.asyncio


async def test_get_progress_empty(client, auth_headers):
    resp = await client.get("/progress", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []


async def test_post_progress(client, auth_headers, db_session):
    from app.models.course import Course, Section
    course = Course(title="W5", week_number=5, description="", is_published=True)
    db_session.add(course)
    await db_session.flush()
    section = Section(course_id=course.id, order=1, title="S1", content_md="", is_free=True)
    db_session.add(section)
    await db_session.commit()

    resp = await client.post("/progress", json={"section_id": section.id}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["section_id"] == section.id


async def test_post_progress_idempotent(client, auth_headers, db_session):
    from app.models.course import Course, Section
    course = Course(title="W5", week_number=5, description="", is_published=True)
    db_session.add(course)
    await db_session.flush()
    section = Section(course_id=course.id, order=1, title="S1", content_md="", is_free=True)
    db_session.add(section)
    await db_session.commit()

    await client.post("/progress", json={"section_id": section.id}, headers=auth_headers)
    resp = await client.post("/progress", json={"section_id": section.id}, headers=auth_headers)
    assert resp.status_code == 200  # upsert — 중복 에러 없음
