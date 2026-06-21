from typing import Optional
from app.rag.embeddings import generate_query_embedding
from app.rag.retriever import retrieve_relevant_chunks, search_all_collections
from app.rag.tinyllama import generate_tinyllama_response

def run_rag_query(
    question: str,
    user_id: int,
    answer_type: str = "normal",
    subject: Optional[str] = None
) -> str:
    """
    RAG Coordination:
    1. Generate embedding vector for query question.
    2. Search matching document chunks in ChromaDB for that user.
    3. Compile chunks into a system context.
    4. Prompt TinyLlama to generate the response.
    """
    # 1. Generate query embedding vector
    try:
        query_embedding = generate_query_embedding(question)
    except Exception as e:
        print(f"Embedding generation error in RAG pipeline: {e}")
        query_embedding = None

    chunks = []
    if query_embedding:
        # 2. Retrieve related chunks
        try:
            if subject and subject.strip() and subject.lower() != "general":
                collection_name = subject.lower().replace(" ", "_").replace("-", "_")
                chunks = retrieve_relevant_chunks(collection_name, query_embedding, user_id=user_id, top_k=5)
            else:
                chunks = search_all_collections(query_embedding, user_id=user_id, top_k=5)
        except Exception as e:
            print(f"Retrieval error in RAG pipeline: {e}")
            chunks = []

    # 3. Compile contexts
    if not chunks:
        context = "No specific study materials found for this request. Provide general engineering academic knowledge."
    else:
        context = "\n\n".join(chunks)

    # 4. Generate response using TinyLlama pipeline
    try:
        response = generate_tinyllama_response(question, context, answer_type)
    except Exception as e:
        response = f"I failed to synthesize an answer. Details: {str(e)}"

    return response
