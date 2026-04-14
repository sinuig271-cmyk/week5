from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    polar_sub_id: Mapped[str] = mapped_column(String, unique=True)
    plan: Mapped[str] = mapped_column(String)  # monthly | annual
    status: Mapped[str] = mapped_column(String)  # active | canceled
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
