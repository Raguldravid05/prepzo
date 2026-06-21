import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db, SessionLocal
from app.models.user import User
from app.models.document import Document
from app.services.auth_service import get_current_user
from app.services.upload_service import save_uploaded_file, process_file_for_rag

router = APIRouter(prefix="/upload", tags=["Upload"])

def run_document_indexing_task(document_id: int, file_path: str, filename: str, subject: str, user_id: int):
    """Background task to extract, chunk, embed, and index documents while updating DB status."""
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return
            
        # 1. Update to Extracting
        doc.status = "Extracting Text..."
        db.commit()
        
        # 2. Update to Chunking (represented inside process_file_for_rag or split manually)
        doc.status = "Chunking Content..."
        db.commit()
        
        # 3. Update to Generating Embeddings
        doc.status = "Generating Embeddings..."
        db.commit()
        
        # 4. Update to Indexing
        doc.status = "Indexing Documents..."
        db.commit()
        
        # 5. Run indexing pipeline
        chunk_count = process_file_for_rag(file_path, filename, subject, user_id, document_id)
        
        # 6. Success
        doc.chunk_count = chunk_count
        doc.status = "Ready"
        db.commit()
    except Exception as e:
        print(f"Background indexing error: {e}")
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc.status = f"Error: {str(e)[:50]}"
            db.commit()
    finally:
        db.close()

@router.post("")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    subject: str = Form("General"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload study materials (PDF/Docx) and queue background indexing."""
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".pdf", ".docx", ".doc"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Only PDF and DOCX files are allowed."
        )
        
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    
    try:
        # Save file to uploads folder
        file_path = save_uploaded_file(file, unique_name)
        file_size = os.path.getsize(file_path)
        
        # Initialize Document record
        doc = Document(
            user_id=current_user.id,
            filename=filename,
            unique_filename=unique_name,
            subject=subject,
            chunk_count=0,
            file_size=file_size,
            status="Uploading..."
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        # Start background indexing pipeline
        background_tasks.add_task(
            run_document_indexing_task,
            document_id=doc.id,
            file_path=file_path,
            filename=filename,
            subject=subject,
            user_id=current_user.id
        )
        
        return {
            "message": "File uploaded successfully, indexing started.",
            "document": {
                "id": doc.id,
                "filename": doc.filename,
                "subject": doc.subject,
                "size": doc.file_size,
                "status": doc.status
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )
