from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse, ConversationResponse, ConversationDetailResponse, MessageResponse
from app.services.auth_service import get_current_user
from app.services.chat_service import (
    create_conversation, get_conversations, get_conversation,
    add_message, get_messages, update_conversation_title, delete_conversation
)
from app.services.rag_service import run_rag_query

router = APIRouter(tags=["Chat"])

class RegenerateRequest(BaseModel):
    conversation_id: int
    answer_type: Optional[str] = "normal"
    subject: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
def handle_chat_message(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send message, trigger RAG flow, and save responses."""
    # 1. Fetch or initialize conversation
    if req.conversation_id:
        conv = get_conversation(db, req.conversation_id, current_user.id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        title = req.message[:50] + "..." if len(req.message) > 50 else req.message
        conv = create_conversation(db, current_user.id, title=title, subject=req.subject)
        
    # 2. Add user message
    add_message(db, conv.id, "user", req.message, req.answer_type)
    
    # 3. Trigger RAG pipeline
    try:
        response_text = run_rag_query(
            question=req.message,
            user_id=current_user.id,
            answer_type=req.answer_type,
            subject=req.subject or conv.subject
        )
    except Exception as e:
        response_text = f"An exception occurred inside the study model: {str(e)}"
        
    # 4. Add assistant response
    add_message(db, conv.id, "assistant", response_text, req.answer_type)
    
    return ChatResponse(
        response=response_text,
        conversation_id=conv.id
    )

@router.get("/chat/history", response_model=List[ConversationResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve chat history list."""
    convs = get_conversations(db, current_user.id)
    return [ConversationResponse.from_orm(c) for c in convs]

@router.get("/chat/history/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation_details(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all messages in a conversation."""
    conv = get_conversation(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    msgs = get_messages(db, conversation_id)
    return ConversationDetailResponse(
        conversation=ConversationResponse.from_orm(conv),
        messages=[MessageResponse.from_orm(m) for m in msgs]
    )

@router.post("/chat/regenerate", response_model=ChatResponse)
def regenerate_assistant_response(
    req: RegenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Regenerate final AI message by re-running RAG on final user prompt."""
    conv = get_conversation(db, req.conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    msgs = get_messages(db, conv.id)
    if not msgs:
        raise HTTPException(status_code=400, detail="No messages to regenerate")
        
    # Find last user query
    user_msgs = [m for m in msgs if m.role == "user"]
    if not user_msgs:
        raise HTTPException(status_code=400, detail="No user message found to regenerate")
    last_user_query = user_msgs[-1].content
    
    # Remove any subsequent assistant responses
    last_user_idx = msgs.index(user_msgs[-1])
    subsequent_msgs = msgs[last_user_idx+1:]
    for m in subsequent_msgs:
        if m.role == "assistant":
            db.delete(m)
    db.commit()
            
    # Trigger RAG pipeline again
    try:
        new_response = run_rag_query(
            question=last_user_query,
            user_id=current_user.id,
            answer_type=req.answer_type,
            subject=req.subject or conv.subject
        )
    except Exception as e:
        new_response = f"Regeneration error: {str(e)}"
        
    # Save the regenerated message
    add_message(db, conv.id, "assistant", new_response, req.answer_type)
    
    return ChatResponse(
        response=new_response,
        conversation_id=conv.id
    )

@router.delete("/chat/history/{conversation_id}")
def delete_chat(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation."""
    success = delete_conversation(db, conversation_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}
