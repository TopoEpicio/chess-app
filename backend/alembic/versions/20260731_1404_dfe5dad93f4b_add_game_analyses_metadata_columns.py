"""add game_analyses metadata columns

Revision ID: dfe5dad93f4b
Revises: e1a2b3c4d5e6
Create Date: 2026-07-31 14:04:14.247076

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dfe5dad93f4b'
down_revision: Union[str, Sequence[str], None] = 'e1a2b3c4d5e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add metadata columns to game_analyses
    with op.batch_alter_table('game_analyses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('white', sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column('black', sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column('eco', sa.String(length=8), nullable=True))
        batch_op.add_column(sa.Column('event_date', sa.String(length=16), nullable=True))
        batch_op.add_column(sa.Column('opening_name', sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column('white_accuracy', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('black_accuracy', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('analyzed_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('analysis_status', sa.String(length=16), server_default='none'))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('game_analyses', schema=None) as batch_op:
        batch_op.drop_column('analysis_status')
        batch_op.drop_column('analyzed_at')
        batch_op.drop_column('black_accuracy')
        batch_op.drop_column('white_accuracy')
        batch_op.drop_column('opening_name')
        batch_op.drop_column('event_date')
        batch_op.drop_column('eco')
        batch_op.drop_column('black')
        batch_op.drop_column('white')
