"""add repertoire_id to openings

Revision ID: f2b3c4d5e6a7
Revises: e1a2b3c4d5e6
Create Date: 2026-11-19 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2b3c4d5e6a7'
down_revision: Union[str, Sequence[str], None] = 'e1a2b3c4d5e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(table_name: str, column_name: str) -> bool:
    inspector = sa.inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return column_name in {c["name"] for c in inspector.get_columns(table_name)}


def upgrade() -> None:
    """Upgrade schema."""
    if not _column_exists("openings", "repertoire_id"):
        with op.batch_alter_table("openings", schema=None) as batch_op:
            batch_op.add_column(sa.Column("repertoire_id", sa.Integer(), nullable=True))
            batch_op.create_index(
                batch_op.f("ix_openings_repertoire_id"), ["repertoire_id"], unique=False
            )


def downgrade() -> None:
    """Downgrade schema."""
    if _column_exists("openings", "repertoire_id"):
        with op.batch_alter_table("openings", schema=None) as batch_op:
            batch_op.drop_index(batch_op.f("ix_openings_repertoire_id"))
            batch_op.drop_column("repertoire_id")
