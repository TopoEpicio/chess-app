#!/usr/bin/env python3
"""
Seed script: Create root "Le mie aperture" folder and migrate existing openings.

Run with: python -m scripts.seed
Or: make db-seed
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.repertoire import Opening
from app.models.study import StudyFolder, StudyResource, FolderResource


def seed_root_folder() -> None:
    """Create root folder and migrate existing openings."""
    db = SessionLocal()
    try:
        # Check if root folder already exists
        root = db.query(StudyFolder).filter(StudyFolder.name == "Le mie aperture").first()
        if root is None:
            root = StudyFolder(name="Le mie aperture", description="Aperture importate in precedenza")
            db.add(root)
            db.flush()
            print(f"Created root folder: {root.name} (id={root.id})")
        else:
            print(f"Root folder already exists: {root.name} (id={root.id})")

        # Migrate existing openings
        openings = db.query(Opening).all()
        migrated = 0
        for opening in openings:
            # Check if already migrated
            existing = db.query(StudyResource).filter(
                StudyResource.type == "opening",
                StudyResource.opening_id == opening.id
            ).first()
            if existing:
                # Check if linked to root
                linked = db.query(FolderResource).filter(
                    FolderResource.folder_id == root.id,
                    FolderResource.resource_id == existing.id
                ).first()
                if not linked:
                    db.add(FolderResource(folder_id=root.id, resource_id=existing.id))
                    migrated += 1
                continue

            # Create new resource
            res = StudyResource(type="opening", name=opening.name, opening_id=opening.id)
            db.add(res)
            db.flush()
            db.add(FolderResource(folder_id=root.id, resource_id=res.id))
            migrated += 1

        db.commit()
        print(f"Migrated {migrated} openings to root folder")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_root_folder()
    print("Seeding completed successfully")