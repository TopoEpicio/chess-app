"""add move_analysis table and game accuracy fields

Revision ID: e1a2b3c4d5e6
Revises: 6160b75c42e2
Create Date: 2026-07-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = '6160b75c42e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'move_analyses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('game_id', sa.Integer(), nullable=False),
        sa.Column('move_number', sa.Integer(), nullable=False),
        sa.Column('is_white', sa.Integer(), nullable=False),
        sa.Column('san', sa.String(length=16), nullable=False),
        sa.Column('fen_before', sa.String(length=128), nullable=False),
        sa.Column('fen_after', sa.String(length=128), nullable=False),
        sa.Column('played_eval', sa.Float(), nullable=False),
        sa.Column('best_eval', sa.Float(), nullable=False),
        sa.Column('best_move_san', sa.String(length=16), nullable=False),
        sa.Column('best_move_uci', sa.String(length=8), nullable=False),
        sa.Column('second_move_uci', sa.String(length=8), nullable=True),
        sa.Column('second_move_eval', sa.Float(), nullable=True),
        sa.Column('third_move_uci', sa.String(length=8), nullable=True),
        sa.Column('third_move_eval', sa.Float(), nullable=True),
        sa.Column('depth', sa.Integer(), nullable=False),
        sa.Column('eval_swing', sa.Float(), nullable=False),
        sa.Column('classification', sa.String(length=16), nullable=False),
        sa.Column('pvs', sa.JSON(), nullable=True),
        sa.Column('wp_before', sa.Float(), nullable=True),
        sa.Column('wp_after', sa.Float(), nullable=True),
        sa.Column('wp_best', sa.Float(), nullable=True),
        sa.Column('wp_loss', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['game_id'], ['game_analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_move_analyses_game_id'), 'move_analyses', ['game_id'])

    with op.batch_alter_table('game_analyses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('white_accuracy', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('black_accuracy', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('analyzed_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('analysis_status', sa.String(length=16), server_default='none'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_move_analyses_game_id'), table_name='move_analyses')
    op.drop_table('move_analyses')

    with op.batch_alter_table('game_analyses', schema=None) as batch_op:
        batch_op.drop_column('analysis_status')
        batch_op.drop_column('analyzed_at')
        batch_op.drop_column('black_accuracy')
        batch_op.drop_column('white_accuracy')