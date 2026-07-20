from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/", response_model=list[OpeningOut])
def list_openings(db: Session = Depends(get_db)):
    openings = db.query(Opening).order_by(Opening.side, Opening.name).all()
    result = []
    for op in openings:
        node_count = 0
        if op.starting_node_id:
            node_count = count_descendants(op.starting_node_id, db)
        result.append(OpeningOut(
            id=op.id,
            name=op.name,
            side=op.side,
            starting_fen=op.starting_fen,
            starting_node_id=op.starting_node_id,
            eco_code=op.eco_code,
            color_code=op.color_code,
            node_count=node_count,
            created_at=op.created_at.isoformat(),
        ))
    return result


@router.post("/", response_model=OpeningOut)
def create_opening(data: OpeningCreate, db: Session = Depends(get_db)):
    opening = Opening(**data.model_dump())
    db.add(opening)
    db.commit()
    db.refresh(opening)
    return OpeningOut(
        id=opening.id,
        name=opening.name,
        side=opening.side,
        starting_fen=opening.starting_fen,
        starting_node_id=opening.starting_node_id,
        eco_code=opening.eco_code,
        color_code=opening.color_code,
        node_count=0,
        created_at=opening.created_at.isoformat(),
    )


@router.patch("/{opening_id}", response_model=OpeningOut)
def update_opening(opening_id: int, data: OpeningUpdate, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(opening, key, val)
    db.commit()
    db.refresh(opening)
    node_count = 0
    if opening.starting_node_id:
        node_count = count_descendants(opening.starting_node_id, db)
    return OpeningOut(
        id=opening.id,
        name=opening.name,
        side=opening.side,
        starting_fen=opening.starting_fen,
        starting_node_id=opening.starting_node_id,
        eco_code=opening.eco_code,
        color_code=opening.color_code,
        node_count=node_count,
        created_at=opening.created_at.isoformat(),
    )


@router.delete("/{opening_id}")
def delete_opening(opening_id: int, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    db.delete(opening)
    db.commit()
    return {"ok": True}
