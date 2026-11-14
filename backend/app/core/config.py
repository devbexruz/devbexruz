from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "DevBexruz Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/devbexruz.db"
    
    # JWT
    SECRET_KEY: str = "devbexruz-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # AI Keys (Optional, fallback smart heuristics when not provided)
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Telegram Bot Authentication & Notifications
    TELEGRAM_BOT_TOKEN: str = "9019719389:AAG2dmGHsSsPWV06ss5Tgsn6RCD3yytQiGU"
    TELEGRAM_BOT_USERNAME: str = "developerlogicbot"
    TELEGRAM_ADMIN_CHAT_ID: Optional[str] = None
    
    # SMTP / Email Configuration
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = "no-reply@developerlogic.uz"
    EMAILS_FROM_NAME: str = "Developer Logic No-Reply"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
