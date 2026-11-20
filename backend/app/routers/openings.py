from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.repertoire import Opening, RepertoireNode
from app.schemas import OpeningCreate, OpeningOut, OpeningUpdate

router = APIRouter()


def count_descendants(node_id: int, db: Session) -> int:
    children = db.query(RepertoireNode).filter(
        RepertoireNode.parent_id == node_id
    ).all()
    count = len(children)
    for child in children:
        count += count_descendants(child.id, db)
    return count


def next_repertoire_id(db: Session) -> int:
    """Allocate a fresh repertoire id so each opening owns an isolated tree."""
    current = db.query(func.max(RepertoireNode.repertoire_id)).scalar() or 0
    return int(current) + 1


def to_out(opening: Opening, db: Session) -> OpeningOut:
    node_count = 0
    if opening.starting_node_id:
        node_count = count_descendants(opening.starting_node_id, db)
    return OpeningOut(
        id=opening.id,
        name=opening.name,
        side=opening.side,
        starting_fen=opening.starting_fen,
        starting_node_id=opening.starting_node_id,
        repertoire_id=opening.repertoire_id,
        eco_code=opening.eco_code,
        color_code=opening.color_code,
        node_count=node_count,
        created_at=opening.created_at.isoformat(),
    )


@router.get("/", response_model=list[OpeningOut])
def list_openings(db: Session = Depends(get_db)):
    openings = db.query(Opening).order_by(Opening.side, Opening.name).all()
    return [to_out(op, db) for op in openings]


@router.post("/", response_model=OpeningOut)
def create_opening(data: OpeningCreate, db: Session = Depends(get_db)):
    payload = data.model_dump()
    if payload.get("repertoire_id") is None:
        payload["repertoire_id"] = next_repertoire_id(db)
    opening = Opening(**payload)
    db.add(opening)
    db.commit()
    db.refresh(opening)
    return to_out(opening, db)


@router.get("/{opening_id}", response_model=OpeningOut)
def get_opening(opening_id: int, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    return to_out(opening, db)


@router.patch("/{opening_id}", response_model=OpeningOut)
def update_opening(opening_id: int, data: OpeningUpdate, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(opening, key, val)
    db.commit()
    db.refresh(opening)
    return to_out(opening, db)


@router.delete("/{opening_id}")
def delete_opening(opening_id: int, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    db.delete(opening)
    db.commit()
    return {"ok": True}
