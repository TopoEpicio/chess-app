#!/usr/bin/env python3
"""
Migration script: Normalize puzzle themes to JSON array with snake_case.

Run with: python -m scripts.migrate_puzzle_themes
Or: make db-migrate-themes
"""
import json
import re
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.puzzle import Puzzle


def camel_to_snake(name: str) -> str:
    """Convert camelCase/PascalCase to snake_case."""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def migrate_puzzle_themes() -> None:
    """Normalize puzzle themes to JSON array with snake_case."""
    db = SessionLocal()
    try:
        puzzles = db.query(Puzzle).all()
        updated = 0
        
        for p in puzzles:
            if p.theme is None:
                continue
            
            # Parse current theme
            if isinstance(p.theme, str):
                if p.theme.startswith('['):
                    try:
                        themes = json.loads(p.theme)
                    except json.JSONDecodeError:
                        themes = [p.theme]
                else:
                    themes = [p.theme]
            elif isinstance(p.theme, list):
                themes = p.theme
            else:
                themes = [str(p.theme)]
            
            # Normalize each theme to snake_case
            normalized = []
            for t in themes:
                if isinstance(t, str):
                    normalized.append(camel_to_snake(t))
                else:
                    normalized.append(str(t))
            
            # Update
            p.theme = normalized
            updated += 1
        
        db.commit()
        print(f"Updated {updated} puzzles")
    except Exception as e:
        db.rollback()
        print(f"Error during theme migration: {e}", file=sys.stderr)
        raise
    finally:
        db.close()


def camel_to_snake(name: str) -> str:
    """Convert camelCase/PascalCase to snake_case."""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


if __name__ == "__main__":
    migrate_puzzle_themes()
    print("Theme migration completed successfully")