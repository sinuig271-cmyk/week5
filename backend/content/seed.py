#!/usr/bin/env python
"""Week5 콘텐츠를 DB에 삽입하는 1회성 스크립트."""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.models.course import Course, Section
from app.core.database import Base

DATABASE_PATH = os.getenv("DATABASE_PATH", "./data/deeplearn.db")
engine = create_engine(f"sqlite:///{DATABASE_PATH}")
Base.metadata.create_all(engine)

SECTIONS_META = [
    {"order": 1, "title": "Regularization",             "file": "01-regularization.md",   "is_free": True},
    {"order": 2, "title": "Overfitting vs Underfitting", "file": "02-overfitting.md",       "is_free": True},
    {"order": 3, "title": "Data Augmentation",           "file": "03-augmentation.md",      "is_free": False},
    {"order": 4, "title": "Transfer Learning",           "file": "04-transfer-learning.md", "is_free": False},
    {"order": 5, "title": "CNN 실습 (MNIST)",             "file": "05-cnn-mnist.md",         "is_free": False},
]

sections_dir = os.path.join(os.path.dirname(__file__), "sections")

with Session(engine) as session:
    if session.query(Course).filter_by(week_number=5).first():
        print("Week 5 already seeded. Skipping.")
        sys.exit(0)

    course = Course(
        title="Week 5 — 딥러닝 핵심",
        week_number=5,
        description="Regularization, Overfitting, Augmentation, Transfer Learning, CNN MNIST",
        is_published=True,
    )
    session.add(course)
    session.flush()

    for meta in SECTIONS_META:
        with open(os.path.join(sections_dir, meta["file"]), encoding="utf-8") as f:
            content_md = f.read()
        session.add(Section(
            course_id=course.id,
            order=meta["order"],
            title=meta["title"],
            content_md=content_md,
            is_free=meta["is_free"],
        ))

    session.commit()
    print(f"Seeded Week 5 with {len(SECTIONS_META)} sections.")
