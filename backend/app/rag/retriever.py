from typing import List
from app.rag.chroma_store import get_chroma_client, get_or_create_collection

def retrieve_relevant_chunks(
    collection_name: str,
    query_embedding: List[float],
    user_id: int,
    top_k: int = 5
) -> List[str]:
    """Retrieve top_k chunks from a specific collection, filtered by user_id."""
    try:
        collection = get_or_create_collection(collection_name)
        if collection.count() == 0:
            return []
            
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, collection.count()),
            where={"user_id": user_id}
        )
        
        if results and results["documents"] and len(results["documents"]) > 0:
            return results["documents"][0]
    except Exception as e:
        print(f"Error querying Chroma collection {collection_name}: {e}")
        
    return []

def search_all_collections(
    query_embedding: List[float],
    user_id: int,
    top_k: int = 5
) -> List[str]:
    """Search for matching context across all collections for a user."""
    client = get_chroma_client()
    all_chunks = []
    
    try:
        collections = client.list_collections()
    except Exception as e:
        print(f"Error listing collections: {e}")
        return []
        
    for col_info in collections:
        col_name = col_info if isinstance(col_info, str) else col_info.name
        try:
            collection = client.get_collection(col_name)
            if collection.count() == 0:
                continue
                
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=min(top_k, collection.count()),
                where={"user_id": user_id}
            )
            
            if results and results["documents"] and len(results["documents"]) > 0:
                all_chunks.extend(results["documents"][0])
        except Exception as e:
            print(f"Error querying collection {col_name} during all-search: {e}")
            continue
            
    # Sort or cap the aggregated results
    return all_chunks[:top_k]
