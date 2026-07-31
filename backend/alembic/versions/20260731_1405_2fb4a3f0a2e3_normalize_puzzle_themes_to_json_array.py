"""normalize puzzle themes to json array

Revision ID: 2fb4a3f0a2e3
Revises: dfe5dad93f4b
Create Date: 2026-07-31 14:05:55.449286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2fb4a3f0a2e3'
down_revision: Union[str, Sequence[str], None] = 'dfe5dad93f4b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def camel_to_snake(name: str) -> str:
    """Convert camelCase/PascalCase to snake_case."""
    import re
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def upgrade() -> None:
    """Upgrade schema - normalize puzzle themes to JSON array."""
    conn = op.get_bind()
    
    # First, alter column type to JSON (SQLite handles this automatically)
    with op.batch_alter_table('puzzles', schema=None) as batch_op:
        batch_op.alter_column('theme',
                       existing_type=sa.VARCHAR(length=32),
                       type_=sa.JSON(),
                       existing_nullable=False)
    
    # Now migrate existing data: string -> JSON array with snake_case normalization
    conn = op.get_bind()
    result = conn.execute(sa.text("SELECT id, theme FROM puzzles"))
    puzzles = result.fetchall()
    
    for puzzle_id, theme in puzzles:
        if theme is None:
            continue
        
        # Parse current theme (could be string or already JSON)
        if isinstance(theme, str):
            # Check if it's already a JSON string
            if theme.startswith('['):
                try:
                    import json
                    themes = json.loads(theme)
                except:
                    themes = [theme]
            else:
                themes = [theme]
        elif isinstance(theme, list):
            themes = theme
        else:
            themes = [str(theme)]
        
        # Normalize each theme to snake_case
        normalized = []
        for t in themes:
            if isinstance(t, str):
                normalized.append(camel_to_snake(t))
            else:
                normalized.append(str(t))
        
        # Store as JSON
        import json
        new_theme = json.dumps(normalized)
        conn.execute(
            sa.text("UPDATE puzzles SET theme = :theme WHERE id = :id"),
            {"theme": new_theme, "id": puzzle_id}
        )
    conn.commit()


def downgrade() -> None:
    """Downgrade schema - revert theme to VARCHAR (first element only)."""
    # Revert column type
    with op.batch_alter_table('puzzles', schema=None) as batch_op:
        batch_op.alter_column('theme',
                       existing_type=sa.JSON(),
                       type_=sa.VARCHAR(length=32),
                       existing_nullable=False)
