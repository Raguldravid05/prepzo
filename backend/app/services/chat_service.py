from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message

def create_conversation(db: Session, user_id: int, title: str = "New Chat", subject: Optional[str] = None) -> Conversation:
    conv = Conversation(user_id=user_id, title=title, subject=subject)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

def get_conversations(db: Session, user_id: int) -> List[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

def get_conversation(db: Session, conversation_id: int, user_id: int) -> Optional[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .first()
    )

def add_message(db: Session, conversation_id: int, role: str, content: str, answer_type: str = "normal") -> Message:
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        answer_type=answer_type
    )
    db.add(msg)
    
    # Also update conversation's updated_at timestamp
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        import datetime
        conv.updated_at = datetime.datetime.utcnow()
        
    db.commit()
    db.refresh(msg)
    return msg

def get_messages(db: Session, conversation_id: int) -> List[Message]:
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

def update_conversation_title(db: Session, conversation_id: int, title: str):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.title = title
        db.commit()
        db.refresh(conv)
    return conv

def delete_conversation(db: Session, conversation_id: int, user_id: int) -> bool:
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()
    if conv:
        db.delete(conv)
        db.commit()
        return True
    return False
