from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import backref, relationship

from app.database import Base


class StudyFolder(Base):
    __tablename__ = "study_folders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, ForeignKey("study_folders.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(256), nullable=False)
    description = Column(String(2000), default="")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    children = relationship("StudyFolder", backref=backref("parent", remote_side=[id]))


class StudyResource(Base):
    __tablename__ = "study_resources"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(32), nullable=False)  # opening|pdf|excel|link|youtube
    name = Column(String(256), nullable=False)
    description = Column(String(2000), default="")
    url = Column(String(2048))
    file_name = Column(String(256))
    file_path = Column(String(512))
    file_size = Column(Integer)
    opening_id = Column(Integer, ForeignKey("openings.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    opening = relationship("Opening")


class FolderResource(Base):
    __tablename__ = "study_folder_resources"

    folder_id = Column(Integer, ForeignKey("study_folders.id", ondelete="CASCADE"), primary_key=True)
    resource_id = Column(Integer, ForeignKey("study_resources.id", ondelete="CASCADE"), primary_key=True)
    sort_order = Column(Integer, default=0)
