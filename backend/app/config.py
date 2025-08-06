import os
from typing import Optional


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financas.db")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    JWT_ACCESS_TOKEN_EXPIRES: Optional[int] = None  # Token never expires by default
    
    @classmethod
    def get_database_config(cls) -> dict:
        if cls.SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            return {"connect_args": {"check_same_thread": False}}
        return {}