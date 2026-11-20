from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict

DataT = TypeVar("DataT")


class ValidationErrorDetail(BaseModel):
    """Detailed validation error information."""

    field: str
    message: str
    type: str
    input_value: Any | None = None


class ErrorDetail(BaseModel):
    """Error detail following RFC 7807 (Problem Details)."""

    type: str = "about:blank"
    title: str
    status: int
    detail: str
    instance: str | None = None
    error_code: str | None = None
    extra: dict | None = None


class ErrorResponse(BaseModel):
    """Standard error response format."""

    error: ErrorDetail


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""

    page: int = 1
    page_size: int = 20

    model_config = ConfigDict(extra="forbid")


class Page(BaseModel, Generic[DataT]):
    """Paginated response."""

    items: list[DataT]
    page: int
    page_size: int
    total_items: int
    total_pages: int


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str
    database: str | None = None
    engine: str | None = None


class HealthDeepResponse(BaseModel):
    """Deep health check response."""

    status: str
    version: str
    database: dict
    engine: dict
    redis: dict | None = None
