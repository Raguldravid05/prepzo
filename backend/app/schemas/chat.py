from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    answer_type: Optional[str] = "normal"
    subject: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    answer_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    title: str
    subject: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]
