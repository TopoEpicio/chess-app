from typing import Any

from pydantic import BaseModel


class SettingsOut(BaseModel):
    i18n: dict[str, Any]
    theme: dict[str, Any]
    board: dict[str, Any]
