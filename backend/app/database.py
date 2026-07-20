from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import QueuePool, StaticPool

from app.config import get_settings

settings = get_settings()

# Naming convention for constraints and indexes
# This ensures consistent naming across different databases (PostgreSQL, SQLite)
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def get_database_url() -> str:
    """Get database URL from settings."""
    return settings.database_url


def create_database_engine():
    """Create database engine with appropriate configuration."""
    database_url = get_database_url()

    if database_url.startswith("postgresql"):
        # PostgreSQL configuration with connection pooling
        engine = create_engine(
            database_url,
            poolclass=QueuePool,
            pool_size=settings.database_pool_size,
            max_overflow=settings.database_max_overflow,
            pool_timeout=settings.database_pool_timeout,
            pool_recycle=settings.database_pool_recycle,
            pool_pre_ping=True,
            echo=settings.debug,
        )
    else:
        # SQLite configuration (development/testing)
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            pool_pre_ping=True,
            echo=settings.debug,
        )

    return engine


# Create engine instance
engine = create_database_engine()

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db():
    """Dependency for FastAPI to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
