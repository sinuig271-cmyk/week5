from datetime import datetime
from sqlalchemy import Integer, ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "section_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    section_id: Mapped[int] = mapped_column(Integer, ForeignKey("sections.id"))
    completed_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
