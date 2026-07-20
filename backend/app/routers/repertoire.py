from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.repertoire import RepertoireNode
from app.schemas import NodeCreate, NodeOut, NodeUpdate

router = APIRouter()


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
