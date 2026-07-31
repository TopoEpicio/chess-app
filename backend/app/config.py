from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Chess Training API"
    app_version: str = "0.1.0"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False  # Will be overridden by model_post_init

    # Database
    database_url: str = "sqlite:///data/chess_trainer.db"
    database_pool_size: int = 5
    database_max_overflow: int = 10
    database_pool_timeout: int = 30
    database_pool_recycle: int = 3600

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Stockfish
    stockfish_path: str = "/usr/local/bin/stockfish"
    stockfish_threads: int = 2
    stockfish_hash: int = 128
    stockfish_depth: int = 18
    stockfish_multipv: int = 3

    # Auth
    secret_key: str = "dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30

    # Security
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"]
    )
    rate_limit_requests: int = 100
    rate_limit_window: int = 60

    # Logging
    log_level: str = "INFO"
    log_format: Literal["json", "console"] = "console"

    # External APIs
    lichess_api_base: str = "https://lichess.org/api"
    chesscom_api_base: str = "https://api.chess.com/pub"

    # i18n
    default_locale: str = "en"
    supported_locales: list[str] = ["en", "es", "it", "fr"]

    # Theme and board
    default_theme: Literal["light", "dark", "auto"] = "auto"
    default_board_theme: Literal["default", "blue", "green", "brown"] = "default"
    board_square_opacity: float = 1.0
    board_piece_shadow: bool = True

    def model_post_init(self, __context) -> None:
        """Post-initialization validation and computed fields."""
        # Set debug based on environment
        self.debug = self.environment != "production"
        
        # Validate secret_key in production
        if self.environment == "production" and self.secret_key == "dev-secret-change-in-production":
            raise ValueError("SECRET_KEY must be set in production (cannot use default)")


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
