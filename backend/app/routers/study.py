import os

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.study import StudyResource
from app.schemas.study import (
    AddResourceBody,
    ReorderBody,
    StudyFolderCreate,
    StudyFolderUpdate,
    StudyResourceCreate,
    StudyResourceUpdate,
)
from app.services.study_service import StudyService

router = APIRouter(tags=["study"])


def _svc(db: Session) -> StudyService:
    return StudyService(db)


# --- Folders ---

@router.get("/root")
def get_root(db: Session = Depends(get_db)):
    return _svc(db).get_root()


@router.get("/folders/tree")
def get_folder_tree(db: Session = Depends(get_db)):
    return _svc(db).get_folder_tree()


@router.get("/folders")
def list_folders(parent_id: int | None = None, db: Session = Depends(get_db)):
    return _svc(db).list_folders(parent_id)


@router.post("/folders", status_code=201)
def create_folder(data: StudyFolderCreate, db: Session = Depends(get_db)):
    return _svc(db).create_folder(data)


@router.patch("/folders/{folder_id}")
def update_folder(folder_id: int, data: StudyFolderUpdate, db: Session = Depends(get_db)):
    return _svc(db).update_folder(folder_id, data)


@router.delete("/folders/{folder_id}")
def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    return _svc(db).delete_folder(folder_id)


@router.get("/folders/breadcrumb/{folder_id}")
def get_breadcrumb(folder_id: int, db: Session = Depends(get_db)):
    return _svc(db).get_breadcrumb(folder_id)


@router.get("/folders/{folder_id}/contents")
def get_folder_contents(folder_id: int, db: Session = Depends(get_db)):
    return _svc(db).get_folder_contents(folder_id)


# --- Resources ---

@router.post("/resources", status_code=201)
def create_resource(data: StudyResourceCreate, db: Session = Depends(get_db)):
    return _svc(db).create_resource(data)


@router.get("/resources/{resource_id}")
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    return _svc(db).get_resource(resource_id)


@router.patch("/resources/{resource_id}")
def update_resource(resource_id: int, data: StudyResourceUpdate, db: Session = Depends(get_db)):
    return _svc(db).update_resource(resource_id, data)


@router.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    return _svc(db).delete_resource(resource_id)


@router.post("/resources/upload", status_code=201)
async def upload_resource(file: UploadFile = File(...), name: str = Form(""), db: Session = Depends(get_db)):
    return await _svc(db).upload_resource(file, name)


@router.get("/resources/{resource_id}/download")
def download_resource(resource_id: int, db: Session = Depends(get_db)):
    svc = _svc(db)
    return svc.download_resource(resource_id)


# --- Folder-Resource associations ---

@router.post("/folders/{folder_id}/resources")
def add_resource_to_folder(folder_id: int, body: AddResourceBody, db: Session = Depends(get_db)):
    return _svc(db).add_resource_to_folder(folder_id, body.resource_id)


@router.delete("/folders/{folder_id}/resources/{resource_id}")
def remove_resource_from_folder(folder_id: int, resource_id: int, db: Session = Depends(get_db)):
    return _svc(db).remove_resource_from_folder(folder_id, resource_id)


@router.patch("/folders/{folder_id}/resources/reorder")
def reorder_resources(folder_id: int, data: ReorderBody, db: Session = Depends(get_db)):
    return _svc(db).reorder_resources(folder_id, data.resource_ids)
