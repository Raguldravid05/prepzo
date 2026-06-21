import os
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.document import Document
from app.rag.chroma_store import delete_document_from_chroma
from app.core.config import settings

def get_user_documents(db: Session, user_id: int) -> List[Document]:
    """Retrieve all uploaded documents for a user."""
    return (
        db.query(Document)
        .filter(Document.user_id == user_id)
        .order_by(Document.created_at.desc())
        .all()
    )

def delete_user_document(db: Session, document_id: int, user_id: int) -> bool:
    """Perform clean delete of document metadata, database entry, Chroma vectors, and local file."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    if not doc:
        return False
        
    # 1. Delete ChromaDB segments
    try:
        collection_name = doc.subject.lower().replace(" ", "_").replace("-", "_") if doc.subject else "general"
        delete_document_from_chroma(collection_name, document_id)
    except Exception as e:
        print(f"Error removing chunks from Chroma for doc {document_id}: {e}")

    # 2. Delete local upload file
    if doc.unique_filename:
        try:
            file_path = os.path.join(settings.UPLOAD_DIR, doc.unique_filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error removing file {doc.unique_filename} from disk: {e}")
            
    # 3. Delete database record
    db.delete(doc)
    db.commit()
    return True
