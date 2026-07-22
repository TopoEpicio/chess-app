from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.study import StudyFolder, StudyResource

router = APIRouter(tags=["nav"])


@router.get("/folders")
def get_folders(db: Session = Depends(get_db)):
    folders = db.query(StudyFolder).order_by(StudyFolder.sort_order).all()
    return [
        {
            "id": f.id,
            "parent_id": f.parent_id,
            "name": f.name,
            "description": f.description,
            "sort_order": f.sort_order,
            "created_at": str(f.created_at),
        }
        for f in folders
    ]


@router.get("/resources")
def get_resources(db: Session = Depends(get_db)):
    resources = db.query(StudyResource).order_by(StudyResource.name).all()
    return [
        {
            "id": r.id,
            "type": r.type,
            "name": r.name,
            "description": r.description,
            "opening_id": r.opening_id,
            "created_at": str(r.created_at),
        }
        for r in resources
    ]
