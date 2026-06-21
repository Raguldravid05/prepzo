import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models # Ensures all models are registered for schema creation

# Import Routers
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.upload import router as upload_router
from app.api.documents import router as documents_router
from app.api.saved_answers import router as saved_answers_router
from app.api.settings import router as settings_router

app = FastAPI(
    title="Prepzo AI V2 API",
    description="Production-ready FastAPI backend for Prepzo AI academic study assistant",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(saved_answers_router, prefix="/api")
app.include_router(settings_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    """Create database tables and folders on startup."""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized.")
    
    # Ensure uploads folder exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)

@app.get("/")
def root():
    return {
        "app": "Prepzo AI V2 API",
        "status": "online",
        "version": "2.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
