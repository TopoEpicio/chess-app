import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import get_settings as get_app_settings
from app.database import get_db
from app.database import Base, engine, SessionLocal
from app.exception_handlers import register_exception_handlers
from app.app_logging import configure_logging, get_logger
from app.middleware.logging import LoggingMiddleware
from app.routers import analysis, import_bulk, openings, puzzles, recal, repertoire, nav, settings, stats, study
from app.schemas.common import HealthDeepResponse, HealthResponse


app_config = get_app_settings()

# Configure structured logging
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting Chess Trainer API", version=app_config.app_version, environment=app_config.environment)

    # Create tables (for SQLite dev; use Alembic for production)
    Base.metadata.create_all(bind=engine)

    # Run database migrations (Alembic) - this replaces the old auto-migration
    # Migrations are now handled via Alembic migrations:
    # - 20260731_1404_dfe5dad93f4b_add_game_analyses_metadata_columns.py
    # - 20260731_1405_2fb4a3f0a2e3_normalize_puzzle_themes_to_json_array.py
    # Run `alembic upgrade head` before starting the app in production
    try:
        # Verify migrations are up to date (optional check)
        from alembic.config import Config
        from alembic.script import ScriptDirectory
        from alembic.runtime.migration import MigrationContext
        
        alembic_cfg = Config("alembic.ini")
        script = ScriptDirectory.from_config(alembic_cfg)
        with engine.connect() as conn:
            context = MigrationContext.configure(conn)
            current_rev = context.get_current_revision()
            head_rev = script.get_current_head()
            if current_rev != head_rev:
                logger.warning(
                    "Database migrations not up to date",
                    current=current_rev,
                    head=head_rev,
                    hint="Run 'alembic upgrade head' to apply pending migrations"
                )
    except Exception as e:
        logger.error("Migration check failed", error=str(e))
        # Don't fail startup, but log the error prominently

    # Seed and theme migrations are now handled by separate scripts:
    # - python -m scripts.seed (creates root folder, migrates openings)
    # - python -m scripts.migrate_puzzle_themes (normalizes themes)
    # Run these explicitly via `make db-seed` and `make db-migrate-themes`

    yield

    # Shutdown
    logger.info("Shutting down Chess Trainer API")
    logger.info("Shutting down Chess Trainer API")


app = FastAPI(
    title=app_config.app_name,
    version=app_config.app_version,
    description="Chess Training API with puzzles, repertoire, analysis, and study tools",
    lifespan=lifespan,
    docs_url="/docs" if app_config.debug else None,
    redoc_url="/redoc" if app_config.debug else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Register exception handlers
register_exception_handlers(app)

# Include routers
app.include_router(repertoire.router, prefix="/api/repertoire", tags=["repertoire"])
app.include_router(puzzles.router, prefix="/api/puzzles", tags=["puzzles"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(openings.router, prefix="/api/openings", tags=["openings"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(import_bulk.router, prefix="/api/import", tags=["import"])
app.include_router(study.router, prefix="/api/study", tags=["study"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(recal.router, prefix="/api/recal", tags=["recal"])
app.include_router(nav.router, prefix="/api/nav", tags=["nav"])


# Health check endpoints
@app.get("/api/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Basic liveness check - service is running."""
    return HealthResponse(
        status="ok",
        version=app_config.app_version,
    )


@app.get("/api/ready", response_model=HealthResponse, tags=["health"])
async def readiness_check():
    """Readiness check - service is ready to accept traffic."""
    # Check database connectivity
    db_status = "ok"
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
    except Exception as e:
        logger.error("Database health check failed", error=str(e))
        db_status = "down"

    return HealthResponse(
        status="ok" if db_status == "ok" else "degraded",
        version=app_config.app_version,
        database=db_status,
    )


@app.get("/api/health/deep", response_model=HealthDeepResponse, tags=["health"])
async def deep_health_check():
    """Deep health check - verifies all dependencies."""
    # Database
    db_check = {"status": "ok", "latency_ms": 0}
    try:
        import time
        start = time.time()
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        db_check["latency_ms"] = round((time.time() - start) * 1000, 2)
    except Exception as e:
        db_check = {"status": "down", "error": str(e)}

    # Engine (Stockfish) - basic check
    engine_check = {"status": "ok", "available": True}
    try:
        # Just verify the engine module can be imported
        from app.services.engine_service import get_engine_status
        engine_status = get_engine_status()
        engine_check.update(engine_status)
    except Exception as e:
        engine_check = {"status": "degraded", "available": False, "error": str(e)}

    # Redis
    redis_check = {"status": "ok"}
    try:
        import redis
        r = redis.from_url(app_config.redis_url)
        r.ping()
    except Exception as e:
        redis_check = {"status": "down", "error": str(e)}

    overall_status = "ok"
    if any(c.get("status") == "down" for c in [db_check, engine_check, redis_check]):
        overall_status = "degraded"

    return HealthDeepResponse(
        status=overall_status,
        version=app_config.app_version,
        database=db_check,
        engine=engine_check,
        redis=redis_check,
    )


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {
        "name": app_config.app_name,
        "version": app_config.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }
