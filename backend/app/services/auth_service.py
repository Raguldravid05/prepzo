from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.models.user import User
from app.models.settings import UserSettings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_user_record(db: Session, full_name: str, email: str, password: str) -> User:
    """Create a new user with default preferences settings."""
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")
        
    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Initialize default user settings
    user_settings = UserSettings(
        user_id=user.id,
        theme="dark",
        font_size="medium",
        language="en",
        default_mode="normal",
        response_length="medium",
        citation_toggle=True
    )
    db.add(user_settings)
    db.commit()
    
    return user

def authenticate_user_record(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate email and password."""
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Dependency to retrieve currently authenticated user."""
    payload = decode_token(token)
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    user = db.query(User).filter(User.id == int(user_id_str)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
