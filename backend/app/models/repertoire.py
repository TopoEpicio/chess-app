from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class RepertoireNode(Base):
    __tablename__ = "repertoire_nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    repertoire_id = Column(Integer, nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("repertoire_nodes.id"), nullable=True)
    fen = Column(String(128), nullable=False)
    move_san = Column(String(16), nullable=False)
    annotation = Column(String(2000), default="")
    color_code = Column(String(8), default="green")
    depth = Column(Integer, default=0)
    eco_code = Column(String(8), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    children = relationship("RepertoireNode", backref="parent", remote_side=[id], join_depth=10)


class SpacedReview(Base):
    __tablename__ = "spaced_review"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    node_id = Column(Integer, ForeignKey("repertoire_nodes.id"), nullable=False)
    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=0)
    next_review = Column(DateTime, default=lambda: datetime.now(UTC))
    repetitions = Column(Integer, default=0)
    last_accuracy = Column(Float, nullable=True)

    node = relationship("RepertoireNode")


class Opening(Base):
    __tablename__ = "openings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(128), nullable=False)
    side = Column(String(8), nullable=False)
    starting_fen = Column(String(128), nullable=False)
    starting_node_id = Column(Integer, ForeignKey("repertoire_nodes.id"), nullable=True)
    eco_code = Column(String(8), nullable=True)
    color_code = Column(String(8), default="green")
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    starting_node = relationship("RepertoireNode")
