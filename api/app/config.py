import os
from typing import Optional


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Database URL - requer PostgreSQL
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is required")

    SQLALCHEMY_DATABASE_URL: str = database_url.replace(
        "postgres://", "postgresql+psycopg://"
    )
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    # CORS origins - incluir domínio de produção
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://finances-sigma-jet.vercel.app/",
    ]

    JWT_ACCESS_TOKEN_EXPIRES: Optional[int] = None  # Token never expires by default

    @classmethod
    def get_database_config(cls) -> dict:
        # Configurações para PostgreSQL
        return {
            "pool_pre_ping": True,  # Verifica conexões antes de usar
            "pool_recycle": 300,  # Recria conexões a cada 5 minutos
        }
