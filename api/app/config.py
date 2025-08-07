import os
from typing import Optional


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financas.db")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
    
    # CORS origins - incluir domínio de produção
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://finances-six-brown.vercel.app",  # Substituir pelo seu domínio
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ]
    
    JWT_ACCESS_TOKEN_EXPIRES: Optional[int] = None  # Token never expires by default
    
    @classmethod
    def get_database_config(cls) -> dict:
        if cls.SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            return {"connect_args": {"check_same_thread": False}}
        return {}