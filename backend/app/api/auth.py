from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.services.auth_service import create_user_record, authenticate_user_record, get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    if len(req.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )
    if not req.full_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Full name cannot be empty"
        )
        
    try:
        user = create_user_record(db, req.full_name, req.email, req.password)
        token = create_access_token(subject=user.id)
        return AuthResponse(
            access_token=token,
            user=UserResponse.from_orm(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user_record(db, req.email, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    token = create_access_token(subject=user.id)
    return AuthResponse(
        access_token=token,
        user=UserResponse.from_orm(user)
    )

@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)
