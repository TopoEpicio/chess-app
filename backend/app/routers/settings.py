from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(tags=["settings"])


def _svc(db: Session):
    class _SVC:
        def get(self, db: Session = Depends(get_db)):
            from app.config import get_settings
            settings = get_settings()
            return {
                "i18n": {
                    "default_locale": settings.default_locale,
                    "supported_locales": settings.supported_locales,
                },
                "theme": {
                    "default_theme": settings.default_theme,
                    "default_board_theme": settings.default_board_theme,
                },
                "board": {
                    "square_opacity": settings.board_square_opacity,
                    "piece_shadow": settings.board_piece_shadow,
                },
            }

    return _svc(db)


@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    return _svc(db).get(db)
