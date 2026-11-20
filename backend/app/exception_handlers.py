import uuid

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.exceptions import ChessTrainerError
from app.app_logging import get_logger
from app.schemas.common import ErrorDetail, ErrorResponse, ValidationErrorDetail

logger = get_logger(__name__)


def create_error_response(
    request: Request,
    status_code: int,
    error_code: str,
    message: str,
    details: dict | None = None,
) -> JSONResponse:
    """Create standardized error response following RFC 7807 (Problem Details)."""
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))

    error_detail = ErrorDetail(
        type=f"https://api.chess-trainer.com/errors/{error_code.lower()}",
        title=error_code.replace("_", " ").title(),
        status=status_code,
        detail=message,
        instance=str(request.url),
        error_code=error_code,
        extra=details or {},
    )

    error_response = ErrorResponse(error=error_detail)

    return JSONResponse(
        status_code=status_code,
        content=error_response.model_dump(exclude_none=True),
    )


async def chess_trainer_exception_handler(request: Request, exc: ChessTrainerError) -> JSONResponse:
    """Handle custom application exceptions."""
    logger.warning(
        "Application error",
        error_code=exc.error_code,
        message=exc.message,
        details=exc.details,
        path=str(request.url),
        method=request.method,
    )
    return create_error_response(
        request,
        exc.status_code,
        exc.error_code,
        exc.message,
        exc.details,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle FastAPI/Pydantic validation errors."""
    logger.warning(
        "Validation error",
        errors=exc.errors(),
        path=str(request.url),
        method=request.method,
    )

    details = [
        ValidationErrorDetail(
            field=".".join(str(loc) for loc in error["loc"] if loc != "body"),
            message=error["msg"],
            type=error["type"],
            input_value=error.get("input"),
        )
        for error in exc.errors()
    ]

    return create_error_response(
        request,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "VALIDATION_ERROR",
        "Request validation failed",
        {"validation_errors": [d.model_dump() for d in details]},
    )


async def pydantic_validation_exception_handler(request: Request, exc: PydanticValidationError) -> JSONResponse:
    """Handle Pydantic validation errors."""
    logger.warning(
        "Pydantic validation error",
        errors=exc.errors(),
        path=str(request.url),
        method=request.method,
    )

    details = [
        ValidationErrorDetail(
            field=".".join(str(loc) for loc in error["loc"]),
            message=error["msg"],
            type=error["type"],
            input_value=error.get("input"),
        )
        for error in exc.errors()
    ]

    return create_error_response(
        request,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "VALIDATION_ERROR",
        "Data validation failed",
        {"validation_errors": [d.model_dump() for d in details]},
    )


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handle SQLAlchemy database errors."""
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))

    logger.error(
        "Database error",
        error=str(exc),
        error_type=type(exc).__name__,
        path=str(request.url),
        method=request.method,
        correlation_id=correlation_id,
    )

    # Handle integrity errors (unique constraints, foreign keys)
    if isinstance(exc, IntegrityError):
        return create_error_response(
            request,
            status.HTTP_409_CONFLICT,
            "CONFLICT",
            "Database constraint violation",
            {"constraint": str(exc.orig) if exc.orig else "unknown"},
        )

    return create_error_response(
        request,
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "DATABASE_ERROR",
        "A database error occurred",
        {"correlation_id": correlation_id},
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle any unhandled exceptions."""
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))

    logger.exception(
        "Unhandled exception",
        error=str(exc),
        error_type=type(exc).__name__,
        path=str(request.url),
        method=request.method,
        correlation_id=correlation_id,
    )

    return create_error_response(
        request,
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        {"correlation_id": correlation_id},
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers with the FastAPI app."""
    app.add_exception_handler(ChessTrainerError, chess_trainer_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(PydanticValidationError, pydantic_validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)