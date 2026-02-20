"""
Application configuration settings.
Uses environment variables for sensitive data and configuration.
"""

from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App Configuration
    app_name: str = "Smart Healthcare System"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "False") == "True"
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # Server Configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", 8000))
    
    # Database Configuration
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", 5432))
    db_name: str = os.getenv("DB_NAME", "smart_healthcare")
    db_user: str = os.getenv("DB_USER", "postgres")
    db_password: str = os.getenv("DB_PASSWORD", "password")
    sql_echo: bool = debug  # Log SQL statements in debug mode
    
    # JWT Configuration
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    refresh_token_expire_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    
    # CORS Configuration
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]  # Update for production
    cors_allow_credentials: bool = True
    cors_allow_methods: list = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    cors_allow_headers: list = ["*"]
    
    # Pagination
    items_per_page: int = 10
    
    # Email Configuration (optional)
    smtp_server: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", 587))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    from_email: str = os.getenv("FROM_EMAIL", "noreply@healthcare.com")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Using lru_cache ensures we only create one Settings instance.
    """
    return Settings()


# Export settings for easy import
settings = get_settings()
