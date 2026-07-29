from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text, bindparam
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.repertoire import Opening, RepertoireNode
from app.schemas import OpeningCreate, OpeningOut, OpeningUpdate

router = APIRouter()


def _build_descendant_counts(db: Session, roots: set[int]) -> dict[int, int]:
    if not roots:
        return {}
    cte = text("""
        WITH RECURSIVE tree AS (
            SELECT id, parent_id AS root_id
            FROM repertoire_nodes
            WHERE parent_id IN :roots
            UNION ALL
            SELECT n.id, t.root_id
            FROM repertoire_nodes n
            JOIN tree t ON n.parent_id = t.id
        ) SELECT root_id, COUNT(*) AS cnt FROM tree
          GROUP BY root_id
    """).bindparams(bindparam("roots", expanding=True))
    rows = db.execute(cte, {"roots": list(roots)}).fetchall()
    return {root_id: cnt for root_id, cnt in rows}


@router.get("/", response_model=list[OpeningOut])
def list_openings(db: Session = Depends(get_db)):
    openings = db.query(Opening).order_by(Opening.side, Opening.name).all()
    roots = {op.starting_node_id for op in openings if op.starting_node_id}
    descendant_counts = _build_descendant_counts(db, roots) if roots else {}
    result = []
    for op in openings:
        result.append(OpeningOut(
            id=op.id,
            name=op.name,
            side=op.side,
            starting_fen=op.starting_fen,
            starting_node_id=op.starting_node_id,
            eco_code=op.eco_code,
            color_code=op.color_code,
            node_count=descendant_counts.get(op.starting_node_id, 0) if op.starting_node_id else 0,
            created_at=op.created_at.isoformat() if op.created_at else "",
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
        created_at=opening.created_at.isoformat() if opening.created_at else "",
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
        roots = {opening.starting_node_id}
        counts = _build_descendant_counts(db, roots)
        node_count = counts.get(opening.starting_node_id, 0)
    return OpeningOut(
        id=opening.id,
        name=opening.name,
        side=opening.side,
        starting_fen=opening.starting_fen,
        starting_node_id=opening.starting_node_id,
        eco_code=opening.eco_code,
        color_code=opening.color_code,
        node_count=node_count,
        created_at=opening.created_at.isoformat() if opening.created_at else "",
    )


@router.delete("/{opening_id}")
def delete_opening(opening_id: int, db: Session = Depends(get_db)):
    opening = db.query(Opening).filter(Opening.id == opening_id).first()
    if not opening:
        raise HTTPException(404, "Opening not found")
    db.delete(opening)
    db.commit()
    return {"ok": True}
