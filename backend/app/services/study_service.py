import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.study import FolderResource, StudyFolder, StudyResource
from app.schemas.study import (
    AddResourceBody,
    BreadcrumbItem,
    FolderContents,
    ReorderBody,
    StudyFolderCreate,
    StudyFolderOut,
    StudyFolderUpdate,
    StudyResourceCreate,
    StudyResourceOut,
    StudyResourceUpdate,
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class StudyService:
    def __init__(self, db: Session):
        self.db = db

    def _folder_to_out(self, f: StudyFolder) -> StudyFolderOut:
        folder_count = self.db.query(func.count(StudyFolder.id)).filter(StudyFolder.parent_id == f.id).scalar() or 0
        resource_count = self.db.query(func.count(FolderResource.resource_id)).filter(FolderResource.folder_id == f.id).scalar() or 0
        return StudyFolderOut(
            id=f.id,
            parent_id=f.parent_id,
            name=f.name,
            description=f.description or "",
            folder_count=folder_count,
            resource_count=resource_count,
            sort_order=f.sort_order or 0,
            created_at=f.created_at.isoformat() if f.created_at else "",
        )

    def _resource_to_out(self, r: StudyResource) -> StudyResourceOut:
        return StudyResourceOut(
            id=r.id,
            type=r.type,
            name=r.name,
            description=r.description or "",
            url=r.url,
            file_name=r.file_name,
            file_size=r.file_size,
            opening_id=r.opening_id,
            created_at=r.created_at.isoformat() if r.created_at else "",
        )

    def _delete_children_recursive(self, parent_id: int):
        for child in self.db.query(StudyFolder).filter(StudyFolder.parent_id == parent_id).all():
            self._delete_children_recursive(child.id)
            self.db.delete(child)

    def get_root(self) -> dict:
        folders = [self._folder_to_out(f) for f in self.db.query(StudyFolder).filter(StudyFolder.parent_id.is_(None)).order_by(StudyFolder.sort_order).all()]
        return {"folder": None, "folders": folders, "resources": []}

    def get_folder_tree(self) -> list[StudyFolderOut]:
        return [self._folder_to_out(f) for f in self.db.query(StudyFolder).order_by(StudyFolder.sort_order).all()]

    def list_folders(self, parent_id: int | None = None) -> list[StudyFolderOut]:
        q = self.db.query(StudyFolder)
        if parent_id is None:
            q = q.filter(StudyFolder.parent_id.is_(None))
        else:
            q = q.filter(StudyFolder.parent_id == parent_id)
        return [self._folder_to_out(f) for f in q.order_by(StudyFolder.sort_order).all()]

    def create_folder(self, data: StudyFolderCreate) -> StudyFolderOut:
        folder = StudyFolder(name=data.name, parent_id=data.parent_id, description=data.description)
        self.db.add(folder)
        self.db.commit()
        self.db.refresh(folder)
        return self._folder_to_out(folder)

    def update_folder(self, folder_id: int, data: StudyFolderUpdate) -> StudyFolderOut:
        folder = self.db.query(StudyFolder).filter(StudyFolder.id == folder_id).first()
        if not folder:
            raise HTTPException(404, "Folder not found")
        if data.name is not None:
            folder.name = data.name
        if data.parent_id is not None:
            folder.parent_id = data.parent_id
        if data.description is not None:
            folder.description = data.description
        self.db.commit()
        self.db.refresh(folder)
        return self._folder_to_out(folder)

    def delete_folder(self, folder_id: int) -> dict:
        folder = self.db.query(StudyFolder).filter(StudyFolder.id == folder_id).first()
        if not folder:
            raise HTTPException(404, "Folder not found")
        self._delete_children_recursive(folder.id)
        self.db.delete(folder)
        self.db.commit()
        return {"ok": True}

    def get_folder_contents(self, folder_id: int) -> FolderContents:
        folder = self.db.query(StudyFolder).filter(StudyFolder.id == folder_id).first()
        if not folder:
            raise HTTPException(404, "Folder not found")
        folders = [self._folder_to_out(f) for f in self.db.query(StudyFolder).filter(StudyFolder.parent_id == folder_id).order_by(StudyFolder.sort_order).all()]

        resource_ids = [r.resource_id for r in self.db.query(FolderResource).filter(FolderResource.folder_id == folder_id).order_by(FolderResource.sort_order).all()]
        resources_raw = self.db.query(StudyResource).filter(StudyResource.id.in_(resource_ids)).all() if resource_ids else []
        res_map = {r.id: r for r in resources_raw}
        resources = [self._resource_to_out(res_map[rid]) for rid in resource_ids if rid in res_map]

        return FolderContents(
            folder=self._folder_to_out(folder),
            folders=folders,
            resources=resources,
        )

    def get_breadcrumb(self, folder_id: int) -> list[BreadcrumbItem]:
        items: list[BreadcrumbItem] = []
        current = self.db.query(StudyFolder).filter(StudyFolder.id == folder_id).first()
        if not current:
            raise HTTPException(404, "Folder not found")
        while current:
            items.append(BreadcrumbItem(id=current.id, name=current.name))
            current = self.db.query(StudyFolder).filter(StudyFolder.id == current.parent_id).first() if current.parent_id else None
        items.reverse()
        return items

    def create_resource(self, data: StudyResourceCreate) -> StudyResourceOut:
        res = StudyResource(
            type=data.type,
            name=data.name,
            description=data.description,
            url=data.url,
            opening_id=data.opening_id,
        )
        self.db.add(res)
        self.db.commit()
        self.db.refresh(res)
        return self._resource_to_out(res)

    def get_resource(self, resource_id: int) -> StudyResourceOut:
        res = self.db.query(StudyResource).filter(StudyResource.id == resource_id).first()
        if not res:
            raise HTTPException(404, "Resource not found")
        return self._resource_to_out(res)

    def update_resource(self, resource_id: int, data: StudyResourceUpdate) -> StudyResourceOut:
        res = self.db.query(StudyResource).filter(StudyResource.id == resource_id).first()
        if not res:
            raise HTTPException(404, "Resource not found")
        if data.name is not None:
            res.name = data.name
        if data.description is not None:
            res.description = data.description
        if data.url is not None:
            res.url = data.url
        self.db.commit()
        self.db.refresh(res)
        return self._resource_to_out(res)

    def delete_resource(self, resource_id: int) -> dict:
        res = self.db.query(StudyResource).filter(StudyResource.id == resource_id).first()
        if not res:
            raise HTTPException(404, "Resource not found")
        if res.file_path:
            abs_path = os.path.join(UPLOAD_DIR, res.file_path)
            if os.path.exists(abs_path):
                os.remove(abs_path)
        self.db.delete(res)
        self.db.commit()
        return {"ok": True}

    async def upload_resource(self, file: UploadFile, name: str = "") -> StudyResourceOut:
        if not file.filename:
            raise HTTPException(400, "No file provided")
        ext = os.path.splitext(file.filename)[1].lower()
        type_map = {".pdf": "pdf", ".xls": "excel", ".xlsx": "excel"}
        rtype = type_map.get(ext)
        if not rtype:
            raise HTTPException(400, f"Unsupported file type: {ext}")
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        res = StudyResource(
            type=rtype,
            name=name or file.filename,
            file_name=file.filename,
            file_path=unique_name,
            file_size=len(content),
        )
        self.db.add(res)
        self.db.commit()
        self.db.refresh(res)
        return self._resource_to_out(res)

    def add_resource_to_folder(self, folder_id: int, resource_id: int) -> dict:
        folder = self.db.query(StudyFolder).filter(StudyFolder.id == folder_id).first()
        if not folder:
            raise HTTPException(404, "Folder not found")
        res = self.db.query(StudyResource).filter(StudyResource.id == resource_id).first()
        if not res:
            raise HTTPException(404, "Resource not found")
        existing = self.db.query(FolderResource).filter(
            FolderResource.folder_id == folder_id, FolderResource.resource_id == resource_id
        ).first()
        if not existing:
            max_order = self.db.query(func.max(FolderResource.sort_order)).filter(FolderResource.folder_id == folder_id).scalar() or 0
            assoc = FolderResource(folder_id=folder_id, resource_id=resource_id, sort_order=max_order + 1)
            self.db.add(assoc)
            self.db.commit()
        return {"ok": True}

    def remove_resource_from_folder(self, folder_id: int, resource_id: int) -> dict:
        assoc = self.db.query(FolderResource).filter(
            FolderResource.folder_id == folder_id, FolderResource.resource_id == resource_id
        ).first()
        if not assoc:
            raise HTTPException(404, "Association not found")
        self.db.delete(assoc)
        self.db.commit()
        return {"ok": True}

    def reorder_resources(self, folder_id: int, resource_ids: list[int]) -> dict:
        for i, rid in enumerate(resource_ids):
            self.db.query(FolderResource).filter(
                FolderResource.folder_id == folder_id, FolderResource.resource_id == rid
            ).update({"sort_order": i})
        self.db.commit()
        return {"ok": True}

    def download_resource(self, resource_id: int):
        import os

        from fastapi import HTTPException
        from fastapi.responses import FileResponse

        res = self.db.query(StudyResource).filter(StudyResource.id == resource_id).first()
        if not res:
            raise HTTPException(404, "Resource not found")
        if not res.file_path:
            raise HTTPException(400, "Resource has no file")
        abs_path = os.path.join(self.UPLOAD_DIR, res.file_path)
        if not os.path.exists(abs_path):
            raise HTTPException(404, "File not found on disk")
        media_types = {
            ".pdf": "application/pdf",
            ".xls": "application/vnd.ms-excel",
            ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
        ext = os.path.splitext(res.file_path)[1].lower()
        disposition = "inline" if ext == ".pdf" else "attachment"
        return FileResponse(
            abs_path,
            media_type=media_types.get(ext, "application/octet-stream"),
            filename=res.file_name or res.file_path,
            headers={"Content-Disposition": f'{disposition}; filename="{res.file_name or res.file_path}"'},
        )
