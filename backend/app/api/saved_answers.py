from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.saved_answer import SavedAnswer
from app.schemas.document import SavedAnswerRequest, SavedAnswerResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/saved", tags=["Saved Answers"])

@router.get("", response_model=List[SavedAnswerResponse])
def get_saved_answers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all saved answers for the current user."""
    answers = (
        db.query(SavedAnswer)
        .filter(SavedAnswer.user_id == current_user.id)
        .order_by(SavedAnswer.created_at.desc())
        .all()
    )
    return [SavedAnswerResponse.from_orm(a) for a in answers]

@router.post("", response_model=SavedAnswerResponse)
def create_saved_answer(
    req: SavedAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save an answer to library."""
    ans = SavedAnswer(
        user_id=current_user.id,
        title=req.title,
        subject=req.subject or "General",
        tags=req.tags,
        content=req.content
    )
    db.add(ans)
    db.commit()
    db.refresh(ans)
    return SavedAnswerResponse.from_orm(ans)

@router.delete("/delete/{id}")
def delete_saved_answer_path(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a saved answer by path."""
    ans = db.query(SavedAnswer).filter(SavedAnswer.id == id, SavedAnswer.user_id == current_user.id).first()
    if not ans:
        raise HTTPException(status_code=404, detail="Saved answer not found")
        
    db.delete(ans)
    db.commit()
    return {"message": "Saved answer deleted successfully"}

@router.delete("/delete")
def delete_saved_answer_query(
    id: int = Query(..., description="Saved answer ID to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a saved answer by query parameter."""
    return delete_saved_answer_path(id, db, current_user)
