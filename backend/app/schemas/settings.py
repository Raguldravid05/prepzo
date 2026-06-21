from pydantic import BaseModel

class SettingsSchema(BaseModel):
    theme: str
    font_size: str
    language: str
    default_mode: str
    response_length: str
    citation_toggle: bool

    class Config:
        from_attributes = True
