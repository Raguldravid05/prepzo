from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserSettings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    theme = Column(String(50), default="dark")
    font_size = Column(String(50), default="medium")
    language = Column(String(50), default="en")
    default_mode = Column(String(50), default="normal")
    response_length = Column(String(50), default="medium")
    citation_toggle = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")
