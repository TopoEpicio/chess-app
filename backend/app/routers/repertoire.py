from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.repertoire import RepertoireNode
from app.schemas import (
    NodeCreate,
    NodeOut,
    NodeUpdate,
    RepertoireBulkCreate,
    RepertoireBulkResult,
    RepertoireNodeRead,
)

router = APIRouter()


@router.post("/bulk", response_model=RepertoireBulkResult)
def create_nodes_bulk(data: RepertoireBulkCreate, db: Session = Depends(get_db)):
    """Create a whole repertoire tree in a single request.

    Nodes may reference parents by ``temp_id`` (``parent_temp_id``) so callers do
    not need to know database ids up front. Parent nodes must be resolvable from
    either ``parent_id`` or an already created ``parent_temp_id``.
    """
    if data.repertoire_id <= 0:
        raise HTTPException(400, "repertoire_id must be a positive integer")

    temp_ids = [node.temp_id for node in data.nodes if node.temp_id is not None]
    duplicates = sorted({tid for tid in temp_ids if temp_ids.count(tid) > 1})
    if duplicates:
        raise HTTPException(400, f"Duplicate temp_id values: {', '.join(duplicates)}")

    pending = list(data.nodes)
    id_map: dict[str, int] = {}
    created: list[RepertoireNode] = []

    while pending:
        progressed = False
        for node in list(pending):
            parent_id = node.parent_id
            if node.parent_temp_id is not None:
                if node.parent_temp_id not in id_map:
                    continue
                parent_id = id_map[node.parent_temp_id]
            record = RepertoireNode(
                repertoire_id=data.repertoire_id,
                parent_id=parent_id,
                fen=node.fen,
                move_san=node.move_san,
                annotation=node.annotation,
                color_code=node.color_code,
                depth=node.depth,
                eco_code=node.eco_code,
            )
            db.add(record)
            db.flush()
            if node.temp_id is not None:
                id_map[node.temp_id] = record.id
            created.append(record)
            pending.remove(node)
            progressed = True
        if not progressed:
            unresolved = ", ".join(
                node.temp_id or node.move_san for node in pending
            )
            db.rollback()
            raise HTTPException(
                400,
                "Could not resolve parents for nodes: "
                f"{unresolved}. Check parent_temp_id references.",
            )

    db.commit()
    for record in created:
        db.refresh(record)

    return RepertoireBulkResult(
        repertoire_id=data.repertoire_id,
        created=len(created),
        nodes=[RepertoireNodeRead.model_validate(record) for record in created],
        id_map=id_map,
    )


@router.get("/{repertoire_id}")
def get_tree(repertoire_id: int, db: Session = Depends(get_db)):
    nodes = db.query(RepertoireNode).filter(
        RepertoireNode.repertoire_id == repertoire_id
    ).all()
    return nodes


@router.post("/", response_model=NodeOut)
def create_node(data: NodeCreate, db: Session = Depends(get_db)):
    node = RepertoireNode(**data.model_dump())
    db.add(node)
    db.commit()
    db.refresh(node)
    return node


@router.patch("/{node_id}", response_model=NodeOut)
def update_node(node_id: int, data: NodeUpdate, db: Session = Depends(get_db)):
    node = db.query(RepertoireNode).filter(RepertoireNode.id == node_id).first()
    if not node:
        raise HTTPException(404, "Node not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(node, key, val)
    db.commit()
    db.refresh(node)
    return node


@router.delete("/{node_id}")
def delete_node(node_id: int, db: Session = Depends(get_db)):
    node = db.query(RepertoireNode).filter(RepertoireNode.id == node_id).first()
    if not node:
        raise HTTPException(404, "Node not found")
    db.delete(node)
    db.commit()
    return {"ok": True}
