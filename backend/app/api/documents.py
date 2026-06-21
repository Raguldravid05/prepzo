from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.auth_service import get_current_user
from app.services.document_service import get_user_documents, delete_user_document

router = APIRouter(tags=["Documents"])

@router.get("/documents", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all documents uploaded by the authenticated user."""
    docs = get_user_documents(db, current_user.id)
    return [DocumentResponse.from_orm(d) for d in docs]

@router.delete("/document/delete/{document_id}")
def delete_document_path(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document by path variable."""
    success = delete_user_document(db, document_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Document not found or access denied."
        )
    return {"message": "Document deleted successfully"}

@router.delete("/document/delete")
def delete_document_query(
    id: int = Query(..., description="Document ID to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document by query parameter."""
    return delete_document_path(id, db, current_user)
