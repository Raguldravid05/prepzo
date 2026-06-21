from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.settings import UserSettings
from app.schemas.settings import SettingsSchema
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=SettingsSchema)
def get_user_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch preferences settings for current user."""
    user_settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not user_settings:
        # Fallback initializer
        user_settings = UserSettings(
            user_id=current_user.id,
            theme="dark",
            font_size="medium",
            language="en",
            default_mode="normal",
            response_length="medium",
            citation_toggle=True
        )
        db.add(user_settings)
        db.commit()
        db.refresh(user_settings)
        
    return SettingsSchema.from_orm(user_settings)

@router.put("", response_model=SettingsSchema)
def update_user_settings(
    req: SettingsSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update settings parameters for user."""
    user_settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not user_settings:
        user_settings = UserSettings(user_id=current_user.id)
        db.add(user_settings)
        
    user_settings.theme = req.theme
    user_settings.font_size = req.font_size
    user_settings.language = req.language
    user_settings.default_mode = req.default_mode
    user_settings.response_length = req.response_length
    user_settings.citation_toggle = req.citation_toggle
    
    db.commit()
    db.refresh(user_settings)
    return SettingsSchema.from_orm(user_settings)

@router.post("", response_model=SettingsSchema)
def update_user_settings_post(
    req: SettingsSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fallback POST endpoint for updating user settings."""
    return update_user_settings(req, db, current_user)
