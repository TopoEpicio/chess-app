
from pydantic import BaseModel, ConfigDict, Field


class StudyFolderBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    parent_id: int | None = None


class StudyFolderCreate(StudyFolderBase):
    model_config = ConfigDict(from_attributes=True)


class StudyFolderUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    parent_id: int | None = None


class StudyFolderRead(BaseModel):
    id: int
    parent_id: int | None = None
    name: str
    description: str = ""
    folder_count: int = 0
    resource_count: int = 0
    sort_order: int = 0
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class StudyFolderTree(StudyFolderRead):
    children: list["StudyFolderTree"] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class StudyResourceBase(BaseModel):
    type: str = Field(..., pattern="^(opening|pgn|pdf|video|link|youtube|excel)$")
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    url: str | None = None
    file_path: str | None = None
    opening_id: int | None = None


class StudyResourceCreate(StudyResourceBase):
    model_config = ConfigDict(from_attributes=True)


class StudyResourceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    url: str | None = None
    opening_id: int | None = None


class StudyResourceRead(StudyResourceBase):
    id: int
    file_name: str | None = None
    file_size: int | None = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class FolderResourceLink(BaseModel):
    folder_id: int
    resource_id: int


class BreadcrumbItem(BaseModel):
    id: int
    name: str


class AddResourceBody(BaseModel):
    resource_id: int


class ReorderBody(BaseModel):
    resource_ids: list[int]


class FolderContents(BaseModel):
    folder: "StudyFolderOut"
    folders: list["StudyFolderOut"]
    resources: list["StudyResourceOut"]


# Aliases for backward compatibility
StudyFolderOut = StudyFolderRead
StudyResourceOut = StudyResourceRead
