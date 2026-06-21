import os
from typing import List
from sentence_transformers import SentenceTransformer
from app.core.config import settings

_model = None

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        model_name = settings.EMBEDDING_MODEL
        print(f"Loading embedding model: {model_name}")
        _model = SentenceTransformer(model_name)
        print("Embedding model loaded.")
    return _model

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of text chunks."""
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings.tolist()

def generate_query_embedding(query: str) -> List[float]:
    """Generate embedding for a single search query."""
    model = get_embedding_model()
    embedding = model.encode([query])
    return embedding[0].tolist()
