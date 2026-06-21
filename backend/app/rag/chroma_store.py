import os
from typing import List, Dict, Any
import chromadb
from app.core.config import settings

_client = None

def get_chroma_client() -> chromadb.PersistentClient:
    global _client
    if _client is None:
        os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
        _client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        print("ChromaDB persistent client initialized.")
    return _client

def get_or_create_collection(collection_name: str):
    """Retrieve or initialize a ChromaDB collection."""
    client = get_chroma_client()
    # Normalize name to chroma specifications (alphanumeric, underscores, hyphens, no consecutive dots)
    clean_name = collection_name.lower().replace(" ", "_").replace("-", "_")
    if not clean_name:
        clean_name = "general"
    return client.get_or_create_collection(
        name=clean_name,
        metadata={"hnsw:space": "cosine"}
    )

def store_chunks_in_chroma(
    collection_name: str,
    chunks: List[str],
    embeddings: List[List[float]],
    metadata: List[Dict[str, Any]],
    document_id: int
):
    """Store text segments, vector embeddings, and metadata. Processes in batches of 100."""
    collection = get_or_create_collection(collection_name)
    ids = [f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))]
    
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        end_idx = min(i + batch_size, len(chunks))
        collection.add(
            ids=ids[i:end_idx],
            documents=chunks[i:end_idx],
            embeddings=embeddings[i:end_idx],
            metadatas=metadata[i:end_idx]
        )
    return len(chunks)

def delete_document_from_chroma(collection_name: str, document_id: int):
    """Delete all chunks for a document from a collection."""
    try:
        collection = get_or_create_collection(collection_name)
        # Delete using metadata filtering where doc_id equals document_id
        collection.delete(where={"document_id": document_id})
    except Exception as e:
        print(f"Error deleting from Chroma: {e}")
