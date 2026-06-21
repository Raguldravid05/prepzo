import os
import shutil
from fastapi import UploadFile
from app.core.config import settings
from app.rag.chunking import extract_text_from_file, chunk_text
from app.rag.embeddings import generate_embeddings
from app.rag.chroma_store import store_chunks_in_chroma

def save_uploaded_file(upload_file: UploadFile, unique_filename: str) -> str:
    """Save upload file to the uploads directory."""
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    return file_path

def process_file_for_rag(file_path: str, filename: str, subject: str, user_id: int, document_id: int) -> int:
    """Extract, chunk, embed, and index a document in ChromaDB."""
    # 1. Extract text content
    text = extract_text_from_file(file_path)
    if not text.strip():
        raise ValueError("Could not extract any text from the file.")
        
    # 2. Chunk text
    chunks = chunk_text(text, chunk_size=600, overlap=100)
    if not chunks:
        raise ValueError("File text is too short or chunking failed.")
        
    # 3. Generate embeddings
    embeddings = generate_embeddings(chunks)
    
    # 4. Prepare metadata with user partition
    metadata = [
        {
            "user_id": user_id,
            "document_id": document_id,
            "source": filename,
            "subject": subject,
            "chunk_idx": i
        }
        for i in range(len(chunks))
    ]
    
    # 5. Store in ChromaDB collection
    collection_name = subject.lower().replace(" ", "_").replace("-", "_")
    if not collection_name:
        collection_name = "general"
        
    store_chunks_in_chroma(
        collection_name=collection_name,
        chunks=chunks,
        embeddings=embeddings,
        metadata=metadata,
        document_id=document_id
    )
    
    return len(chunks)
