from fastapi import APIRouter

from app.config import get_settings as get_app_settings
from app.schemas.settings import SettingsOut

router = APIRouter(tags=["settings"])


@router.get("/", response_model=SettingsOut)
def get_settings():
    cfg = get_app_settings()
    return SettingsOut(
        i18n={
            "default_locale": cfg.default_locale,
            "supported_locales": cfg.supported_locales,
        },
        theme={
            "default_theme": cfg.default_theme,
            "default_board_theme": cfg.default_board_theme,
        },
        board={
            "square_opacity": cfg.board_square_opacity,
            "piece_shadow": cfg.board_piece_shadow,
        },
    )
