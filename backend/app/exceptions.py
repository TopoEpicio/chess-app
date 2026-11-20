from fastapi import status


class ChessTrainerError(Exception):
    """Base exception for Chess Trainer application."""

    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict | None = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class NotFoundError(ChessTrainerError):
    """Resource not found."""

    def __init__(self, resource: str, identifier: str | int):
        super().__init__(
            message=f"{resource} with id '{identifier}' not found",
            error_code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "identifier": str(identifier)},
        )


class ConflictError(ChessTrainerError):
    """Resource conflict (e.g., duplicate)."""

    def __init__(self, resource: str, detail: str):
        super().__init__(
            message=f"{resource} conflict: {detail}",
            error_code="CONFLICT",
            status_code=status.HTTP_409_CONFLICT,
            details={"resource": resource, "detail": detail},
        )


class ValidationError(ChessTrainerError):
    """Domain validation error."""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details or {},
        )


class UnauthorizedError(ChessTrainerError):
    """Authentication required."""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            error_code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenError(ChessTrainerError):
    """Permission denied."""

    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            message=message,
            error_code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
        )


class StockfishError(ChessTrainerError):
    """Stockfish engine error."""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(
            message=f"Engine error: {message}",
            error_code="ENGINE_ERROR",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details=details or {},
        )


class RateLimitError(ChessTrainerError):
    """Rate limit exceeded."""

    def __init__(self, retry_after: int = 60):
        super().__init__(
            message=f"Rate limit exceeded. Try again in {retry_after} seconds.",
            error_code="RATE_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            details={"retry_after": retry_after},
        )
