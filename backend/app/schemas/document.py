from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    subject: Optional[str]
    chunk_count: int
    file_size: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SavedAnswerRequest(BaseModel):
    title: str
    subject: Optional[str] = "General"
    tags: Optional[str] = None
    content: str

class SavedAnswerResponse(BaseModel):
    id: int
    title: str
    subject: str
    tags: Optional[str]
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
