import logging
import structlog
from structlog.types import EventDict

from app.config import get_settings
settings = get_settings()

def add_correlation_id(logger, method_name: str, event_dict: EventDict) -> EventDict:
    """Add correlation ID to log entries if available."""
    return event_dict


def add_service_name(logger, method_name: str, event_dict: EventDict) -> EventDict:
    """Add service name to log entries."""
    event_dict["service"] = "chess-trainer-api"
    return event_dict


def configure_logging() -> None:
    """Configure structured logging with structlog."""
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            add_service_name,
            add_correlation_id,
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
            if settings.log_format == "json"
            else structlog.dev.ConsoleRenderer(colors=True),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(settings.log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> structlog.BoundLogger:
    """Get a structured logger instance."""
    return structlog.get_logger(name)
