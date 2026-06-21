from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)  # original filename
    unique_filename = Column(String(255), nullable=True)  # unique disk filename
    subject = Column(String(255), default="General")
    chunk_count = Column(Integer, default=0)
    file_size = Column(Integer, default=0)
    status = Column(String(50), default="Indexed")  # e.g., Uploading, Extracting, Chunking, Indexing, Ready, Error
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="documents")
