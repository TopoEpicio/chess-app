from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(tags=["nav"])


def _svc(db: Session):
    from fastapi import HTTPException

    class _SVC:
        def get(self, id: int):
            raise HTTPException(404, "Not implemented")

        def list(self):
            raise HTTPException(404, "Not implemented")

    return _svc(db)


@router.get("/folders")
def get_folders(db: Session = Depends(get_db)):
    return _svc(db).list()


@router.get("/resources")
def get_resources(db: Session = Depends(get_db)):
    return _svc(db).list()
