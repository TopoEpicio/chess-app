import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.database import Base, engine, SessionLocal
from app.exception_handlers import register_exception_handlers
from app.app_logging import configure_logging, get_logger
from app.middleware.logging import LoggingMiddleware
from app.models.puzzle import Puzzle
from app.models.repertoire import Opening
from app.models.study import FolderResource, StudyFolder, StudyResource
from app.routers import analysis, import_bulk, openings, puzzles, recal, repertoire, nav, settings, stats, study
from app.schemas.common import HealthDeepResponse, HealthResponse


settings = get_settings()

# Configure structured logging
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting Chess Trainer API", version=settings.app_version, environment=settings.environment)

    # Create tables (for SQLite dev; use Alembic for production)
    Base.metadata.create_all(bind=engine)

    # Auto-migrate: add new columns if missing (safe to run repeatedly)
    try:
        inspector = sa.inspect(engine)
        existing = {c["name"] for c in inspector.get_columns("game_analyses")}
        new_columns = {
            "white": "VARCHAR(128)",
            "black": "VARCHAR(128)",
            "eco": "VARCHAR(8)",
            "event_date": "VARCHAR(16)",
            "opening_name": "VARCHAR(128)",
        }
        with engine.connect() as conn:
            for col_name, col_type in new_columns.items():
                if col_name not in existing:
                    conn.exec_driver_sql(f"ALTER TABLE game_analyses ADD COLUMN {col_name} {col_type}")
            conn.commit()
    except Exception as e:
        logger.warning("Auto-migration skipped", error=str(e))

    # Seed: create root "Le mie aperture" folder and migrate existing openings
    try:
        db: Session = SessionLocal()
        if db.query(StudyFolder).first() is None:
            root = StudyFolder(name="Le mie aperture", description="Aperture importate in precedenza")
            db.add(root)
            db.flush()
            for opening in db.query(Opening).all():
                res = StudyResource(type="opening", name=opening.name, opening_id=opening.id)
                db.add(res)
                db.flush()
                db.add(FolderResource(folder_id=root.id, resource_id=res.id))
            db.commit()
        db.close()
    except Exception as e:
        logger.warning("Seed skipped", error=str(e))

    # Migrate: fix puzzle themes — wrap strings in arrays, normalize camelCase
    try:
        db: Session = SessionLocal()
        for p in db.query(Puzzle).all():
            if isinstance(p.theme, str):
                # Convert camelCase/PascalCase to snake_case
                snake = "".join(["_" + c.lower() if c.isupper() else c for c in p.theme]).lstrip("_")
                p.theme = [snake]
            elif isinstance(p.theme, list):
                fixed = []
                for t in p.theme:
                    snake = "".join(["_" + c.lower() if c.isupper() else c for c in t]).lstrip("_")
                    fixed.append(snake)
                p.theme = fixed
        db.commit()
        db.close()
    except Exception as e:
        logger.warning("Theme migration skipped", error=str(e))

    yield

    # Shutdown
    logger.info("Shutting down Chess Trainer API")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Chess Training API with puzzles, repertoire, analysis, and study tools",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
        version=settings.app_version,
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
        version=settings.app_version,
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
        r = redis.from_url(settings.redis_url)
        r.ping()
    except Exception as e:
        redis_check = {"status": "down", "error": str(e)}

    overall_status = "ok"
    if any(c.get("status") == "down" for c in [db_check, engine_check, redis_check]):
        overall_status = "degraded"

    return HealthDeepResponse(
        status=overall_status,
        version=settings.app_version,
        database=db_check,
        engine=engine_check,
        redis=redis_check,
    )


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }
