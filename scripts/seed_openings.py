"""Seed four structured opening courses (repertoire trees + study folders).

Usage (from the ``backend`` directory so the default SQLite path resolves):

    python ..\\scripts\\seed_openings.py

The script is idempotent: re-running it detects already seeded openings and
skips node creation, while still repairing missing study-folder links.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass, field
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import chess  # noqa: E402
from sqlalchemy import func  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.database import SessionLocal  # noqa: E402
from app.models.repertoire import Opening, RepertoireNode  # noqa: E402
from app.models.study import FolderResource, StudyFolder, StudyResource  # noqa: E402


GREEN = "green"
YELLOW = "yellow"
BLUE = "blue"
RED = "red"


@dataclass
class Move:
    san: str
    annotation: str
    color: str = GREEN
    eco: str | None = None


@dataclass
class Line:
    name: str
    moves: list[Move]


@dataclass
class Course:
    name: str
    side: str
    eco: str
    description: str
    lines: list[Line] = field(default_factory=list)


def m(san: str, annotation: str, color: str = GREEN, eco: str | None = None) -> Move:
    return Move(san=san, annotation=annotation, color=color, eco=eco)


COURSES: list[Course] = [
    Course(
        name="Queen's Gambit",
        side="white",
        eco="D30",
        description="White repertoire: QGD main line, QGA, Slav and Catalan transposition.",
        lines=[
            Line(
                "QGD main line",
                [
                    m("d4", "Claim the centre and open the diagonal for the c1-bishop.", GREEN, "D30"),
                    m("d5", "Black mirrors the central claim; the c8-bishop stays passive.", GREEN, "D30"),
                    m("c4", "The Queen's Gambit: challenge d5 immediately and gain space.", GREEN, "D30"),
                    m("e6", "Declining the pawn keeps the centre solid but locks the c8-bishop.", GREEN, "D30"),
                    m("Nc3", "Develop and add a second attacker to d5.", GREEN, "D35"),
                    m("Nf6", "Black develops and contests e4.", GREEN, "D35"),
                    m("Bg5", "Pin the knight and pressure the d5/e6 complex.", GREEN, "D35"),
                    m("Be7", "Breaking the pin; the bishop is passive but safe.", GREEN, "D35"),
                    m("e3", "Solid: supports d4 and opens the f1-bishop's path.", GREEN, "D35"),
                    m("O-O", "Black castles; king safety before the central tension resolves.", GREEN, "D35"),
                    m("Nf3", "Complete development and prepare the rook lift to c1.", GREEN, "D37"),
                    m("Nbd7", "Supports the c5/e5 breaks and covers the c5 square.", GREEN, "D37"),
                    m("Rc1", "Place the rook on the half-open c-file, the key QGD plan.", GREEN, "D37"),
                    m("c6", "Black reinforces d5 but leaves the c6-square slightly weak.", GREEN, "D37"),
                    m("Bd3", "Aim at h7 and prepare ideas of Bxf6 followed by cxd5.", GREEN, "D37"),
                    m("dxc4", "Capturing relieves the tension and frees the d5-square for a knight.", GREEN, "D37"),
                    m("Bxc4", "Recapture with the bishop; the diagonal to h7 is now open.", GREEN, "D37"),
                    m("Nd5", "The standard freeing manoeuvre: trade pieces to ease the defence.", GREEN, "D37"),
                    m("Bxe7", "Trade before Black consolidates; keeps a small structural edge.", GREEN, "D37"),
                    m("Qxe7", "Recapture; Black's queen is active but the bishop pair is gone.", GREEN, "D37"),
                    m("O-O", "King safety first; White's rook is already ideal on c1.", GREEN, "D37"),
                ],
            ),
            Line(
                "Queen's Gambit Accepted",
                [
                    m("d4", "Central claim, as in the main line.", GREEN, "D20"),
                    m("d5", "Black offers the gambit pawn.", GREEN, "D20"),
                    m("c4", "Challenge the centre.", GREEN, "D20"),
                    m("dxc4", "Accepting: Black gives up the centre to develop quickly.", YELLOW, "D20"),
                    m("Nf3", "Prevent e5 and prepare e3/Bxc4 to regain the pawn.", GREEN, "D20"),
                    m("Nf6", "Normal development, controlling e4.", GREEN, "D20"),
                    m("e3", "Prepare the bishop recapture on c4.", GREEN, "D20"),
                    m("e6", "Blunts the f1-bishop's diagonal and prepares c5.", GREEN, "D20"),
                    m("Bxc4", "Pawn regained; White has a comfortable space advantage.", GREEN, "D20"),
                    m("c5", "The standard freeing break against White's broad centre.", YELLOW, "D20"),
                    m("O-O", "Safety first; the d4-pawn is well defended.", GREEN, "D20"),
                    m("a6", "Prepares b5 to develop the c8-bishop and gain queenside space.", YELLOW, "D20"),
                ],
            ),
            Line(
                "Slav Defence",
                [
                    m("d4", "Central claim.", GREEN, "D10"),
                    m("d5", "Symmetric answer.", GREEN, "D10"),
                    m("c4", "Gambit offered.", GREEN, "D10"),
                    m("c6", "The Slav: defend d5 with a pawn, keeping the bishop's diagonal open.", YELLOW, "D10"),
                    m("Nf3", "Develop and prepare e3/Bxc4.", GREEN, "D10"),
                    m("Nf6", "Develop, pressure e4.", GREEN, "D10"),
                    m("Nc3", "Adds a defender to d5 and increases the pressure.", GREEN, "D10"),
                    m("dxc4", "Black grabs the pawn, planning b5 and Bf5.", YELLOW, "D10"),
                    m("a4", "Stops b5 and fixes the queenside structure.", GREEN, "D15"),
                    m("Bf5", "The Slav bishop develops actively outside the chain.", YELLOW, "D15"),
                    m("e3", "Prepares Bxc4 and keeps the centre flexible.", GREEN, "D15"),
                    m("e6", "Consolidates c4 and prepares Be7.", GREEN, "D15"),
                ],
            ),
            Line(
                "Catalan transposition",
                [
                    m("d4", "Central claim.", GREEN, "E00"),
                    m("d5", "Symmetric answer.", GREEN, "E00"),
                    m("c4", "Challenge the centre.", GREEN, "E00"),
                    m("e6", "Transposing to a QGD structure.", BLUE, "E00"),
                    m("Nf3", "Flexible: keeps the Catalan option alive.", BLUE, "E00"),
                    m("Nf6", "Standard development.", BLUE, "E00"),
                    m("g3", "The Catalan: long diagonal pressure against the queenside.", BLUE, "E00"),
                ],
            ),
        ],
    ),
    Course(
        name="King's Indian Attack",
        side="white",
        eco="A07",
        description="White repertoire: KIA setup with a king-side plan, plus replies to 1...c5, 1...Nf6 and 1...f5.",
        lines=[
            Line(
                "KIA main line",
                [
                    m("Nf3", "Flexible first move, avoiding early commitments.", GREEN, "A07"),
                    m("d5", "Black claims the centre.", GREEN, "A07"),
                    m("g3", "Prepares the fianchetto and the KIA structure.", GREEN, "A07"),
                    m("Nf6", "Develops and contests e4.", GREEN, "A07"),
                    m("Bg2", "The long diagonal will support e4 and pressure d5.", GREEN, "A07"),
                    m("e6", "Solid, but gives White a free hand in the centre.", GREEN, "A07"),
                    m("O-O", "King safety before committing the centre.", GREEN, "A07"),
                    m("Be7", "Modest development; Black keeps the structure compact.", GREEN, "A07"),
                    m("d3", "The KIA signature: modest centre, then e4.", GREEN, "A07"),
                    m("O-O", "Black follows suit.", GREEN, "A07"),
                    m("Nbd2", "Reroutes the knight to support the e4 break.", GREEN, "A07"),
                    m("c5", "Black gains queenside space and hits d4 ideas.", GREEN, "A07"),
                    m("e4", "The thematic break; White accepts an isolated d3-pawn for activity.", GREEN, "A07"),
                    m("Nc6", "Pressures d4/e5 and prepares the blockade.", GREEN, "A07"),
                ],
            ),
            Line(
                "vs 1...c5",
                [
                    m("Nf3", "Keep flexible.", GREEN, "A07"),
                    m("c5", "Black grabs queenside space.", YELLOW, "A07"),
                    m("g3", "Proceed with the KIA setup regardless.", GREEN, "A07"),
                    m("Nc6", "Develops, eyeing d4.", GREEN, "A07"),
                    m("Bg2", "Long-diagonal pressure.", GREEN, "A07"),
                    m("g6", "Black fianchettoes to contest the dark squares.", YELLOW, "A07"),
                    m("O-O", "King safety.", GREEN, "A07"),
                ],
            ),
            Line(
                "vs 1...Nf6",
                [
                    m("Nf3", "Keep flexible.", GREEN, "A07"),
                    m("Nf6", "Black develops without committing pawns.", YELLOW, "A07"),
                    m("g3", "KIA setup.", GREEN, "A07"),
                    m("g6", "Symmetrical fianchetto.", YELLOW, "A07"),
                    m("Bg2", "Long-diagonal pressure.", GREEN, "A07"),
                ],
            ),
            Line(
                "vs 1...f5",
                [
                    m("Nf3", "Keep flexible.", GREEN, "A08"),
                    m("f5", "The Dutch: Black stakes a claim on e4 and the kingside.", YELLOW, "A08"),
                    m("g3", "Continue with the KIA plan; the f4-square is a target.", GREEN, "A08"),
                    m("Nf6", "Develops and supports e4.", YELLOW, "A08"),
                    m("Bg2", "Pressure along the long diagonal.", GREEN, "A08"),
                    m("e6", "Prepares Be7 and keeps the centre flexible.", YELLOW, "A08"),
                ],
            ),
        ],
    ),
    Course(
        name="Queen's Gambit Declined",
        side="black",
        eco="D30",
        description="Black repertoire: QGD main line, Tarrasch, Exchange and Semi-Tarrasch structures.",
        lines=[
            Line(
                "QGD main line",
                [
                    m("d4", "White claims the centre.", GREEN, "D30"),
                    m("d5", "Black mirrors and stakes a central claim.", GREEN, "D30"),
                    m("c4", "The Queen's Gambit.", GREEN, "D30"),
                    m("e6", "Declining keeps the centre solid; the c8-bishop stays passive.", GREEN, "D30"),
                    m("Nc3", "White develops and presses d5.", GREEN, "D35"),
                    m("Nf6", "Develop and contest e4.", GREEN, "D35"),
                    m("Bg5", "Pin against the knight.", GREEN, "D35"),
                    m("Be7", "Break the pin, accepting a passive bishop.", GREEN, "D35"),
                    m("e3", "Supports d4 and opens the f1-bishop.", GREEN, "D35"),
                    m("O-O", "Castle before the tension resolves.", GREEN, "D35"),
                    m("Nf3", "Completes White's development.", GREEN, "D37"),
                    m("Nbd7", "Covers c5/e5 breaks and d5.", GREEN, "D37"),
                    m("Rc1", "Rook to the half-open file; the standard plan.", GREEN, "D37"),
                    m("c6", "Reinforce d5; Black's structure is solid but passive.", GREEN, "D37"),
                    m("Bd3", "White aims at h7 and prepares cxd5 ideas.", GREEN, "D37"),
                    m("dxc4", "Release the tension and free d5 for the knight.", GREEN, "D37"),
                    m("Bxc4", "Recapture, opening the diagonal to h7.", GREEN, "D37"),
                    m("Nd5", "The standard freeing manoeuvre, offering trades.", GREEN, "D37"),
                ],
            ),
            Line(
                "Tarrasch Defence",
                [
                    m("d4", "Central claim.", GREEN, "D30"),
                    m("d5", "Mirror.", GREEN, "D30"),
                    m("c4", "Gambit.", GREEN, "D30"),
                    m("e6", "Declined.", GREEN, "D30"),
                    m("Nc3", "White presses d5.", GREEN, "D30"),
                    m("c5", "The Tarrasch: attack the centre from the flank, accepting an IQP.", YELLOW, "D32"),
                    m("cxd5", "White clarifies the centre.", GREEN, "D32"),
                    m("exd5", "Recapture; Black gets active piece play against the IQP.", YELLOW, "D32"),
                ],
            ),
            Line(
                "Exchange Variation",
                [
                    m("d4", "Central claim.", GREEN, "D30"),
                    m("d5", "Mirror.", GREEN, "D30"),
                    m("c4", "Gambit.", GREEN, "D30"),
                    m("e6", "Declined.", GREEN, "D30"),
                    m("Nc3", "White presses d5.", GREEN, "D30"),
                    m("Nf6", "Develop.", GREEN, "D30"),
                    m("cxd5", "Exchange variation: White fixes the structure and keeps the bishop pair.", YELLOW, "D35"),
                    m("exd5", "Black accepts a symmetrical structure with easy development.", YELLOW, "D35"),
                ],
            ),
            Line(
                "Semi-Tarrasch",
                [
                    m("d4", "Central claim.", GREEN, "D30"),
                    m("d5", "Mirror.", GREEN, "D30"),
                    m("c4", "Gambit.", GREEN, "D30"),
                    m("e6", "Declined.", GREEN, "D30"),
                    m("Nc3", "White presses d5.", GREEN, "D30"),
                    m("Nf6", "Develop.", GREEN, "D30"),
                    m("Nf3", "White adds pressure.", GREEN, "D40"),
                    m("c5", "The Semi-Tarrasch break.", YELLOW, "D40"),
                    m("cxd5", "White clarifies.", GREEN, "D40"),
                    m("Nxd5", "Recapture with the knight; Black avoids the IQP structures of the pure Tarrasch.", YELLOW, "D40"),
                ],
            ),
        ],
    ),
    Course(
        name="Caro-Kann",
        side="black",
        eco="B10",
        description="Black repertoire: Classical main line plus Advance, Exchange and Fantasy structures.",
        lines=[
            Line(
                "Classical main line",
                [
                    m("e4", "White claims the centre.", GREEN, "B10"),
                    m("c6", "The Caro-Kann: prepare d5 while keeping the c8-bishop's diagonal.", GREEN, "B10"),
                    m("d4", "White builds a broad centre.", GREEN, "B10"),
                    m("d5", "Challenge e4 immediately.", GREEN, "B10"),
                    m("Nc3", "Defends e4 and develops.", GREEN, "B10"),
                    m("dxe4", "Trade in the centre to free Black's position.", GREEN, "B10"),
                    m("Nxe4", "Recapture; White has more space.", GREEN, "B10"),
                    m("Nd7", "The classical plan: prepare Ngf6 without allowing structural damage.", GREEN, "B12"),
                    m("Ng5", "White probes the f7/h7 squares.", GREEN, "B12"),
                    m("Ngf6", "Develop and challenge the knight on e4.", GREEN, "B12"),
                    m("Bd3", "Aims at h7 and supports the kingside build-up.", GREEN, "B12"),
                    m("e6", "Blunts the bishop's diagonal and prepares Be7.", GREEN, "B12"),
                    m("N1f3", "Develops and prepares the queen's entry.", GREEN, "B12"),
                    m("Bd6", "Active development; the bishop eyes h2.", GREEN, "B12"),
                    m("Qe2", "Connects the rooks and prepares O-O-O.", GREEN, "B12"),
                    m("h6", "Questions the g5-knight before completing development.", GREEN, "B12"),
                ],
            ),
            Line(
                "Advance Variation",
                [
                    m("e4", "Central claim.", GREEN, "B10"),
                    m("c6", "Caro-Kann.", GREEN, "B10"),
                    m("d4", "Build the centre.", GREEN, "B10"),
                    m("d5", "Challenge.", GREEN, "B10"),
                    m("e5", "Advance: White gains space and fixes the centre.", YELLOW, "B12"),
                    m("Bf5", "Develop the problem bishop before e6 locks it in.", YELLOW, "B12"),
                    m("Nf3", "Develops and controls e5.", GREEN, "B12"),
                    m("e6", "Supports d5 and prepares c5 against the pawn chain.", YELLOW, "B12"),
                ],
            ),
            Line(
                "Exchange Variation",
                [
                    m("e4", "Central claim.", GREEN, "B10"),
                    m("c6", "Caro-Kann.", GREEN, "B10"),
                    m("d4", "Build the centre.", GREEN, "B10"),
                    m("d5", "Challenge.", GREEN, "B10"),
                    m("exd5", "Exchange: symmetrical structure, balanced play.", YELLOW, "B13"),
                    m("cxd5", "Recapture with the c-pawn; the c8-bishop is free.", YELLOW, "B13"),
                ],
            ),
            Line(
                "Fantasy Variation",
                [
                    m("e4", "Central claim.", GREEN, "B10"),
                    m("c6", "Caro-Kann.", GREEN, "B10"),
                    m("d4", "Build the centre.", GREEN, "B10"),
                    m("d5", "Challenge.", GREEN, "B10"),
                    m("f3", "The Fantasy: White defends e4 and prepares a large centre.", YELLOW, "B12"),
                    m("dxe4", "Trade immediately to punish the slow f3.", YELLOW, "B12"),
                    m("fxe4", "Recapture; White's structure is active but the king's diagonal opens.", GREEN, "B12"),
                ],
            ),
        ],
    ),
]


@dataclass
class BuiltNode:
    temp_id: str
    parent_temp_id: str | None
    fen: str
    move_san: str
    annotation: str
    color_code: str
    depth: int
    eco_code: str | None
    board: chess.Board


def build_nodes(course: Course) -> list[BuiltNode]:
    """Flatten all course lines into a de-duplicated trie of moves."""
    nodes: list[BuiltNode] = []
    by_temp: dict[str, BuiltNode] = {}
    seen: dict[tuple[str | None, str], str] = {}

    for line in course.lines:
        board = chess.Board()
        parent_temp: str | None = None
        depth = 0
        for ply, move in enumerate(line.moves, start=1):
            key = (parent_temp, move.san)
            if key in seen:
                node = by_temp[seen[key]]
                board = node.board.copy()
                parent_temp = node.temp_id
                depth = node.depth
                continue
            try:
                board.push_san(move.san)
            except ValueError as exc:
                raise SystemExit(
                    f"{course.name} / {line.name}: illegal move '{move.san}' at ply {ply}: {exc}"
                ) from exc
            depth += 1
            temp_id = f"n{len(nodes)}"
            node = BuiltNode(
                temp_id=temp_id,
                parent_temp_id=parent_temp,
                fen=board.fen(),
                move_san=move.san,
                annotation=move.annotation,
                color_code=move.color,
                depth=depth,
                eco_code=move.eco or course.eco,
                board=board.copy(),
            )
            nodes.append(node)
            by_temp[temp_id] = node
            seen[key] = temp_id
            parent_temp = temp_id
    return nodes


def next_repertoire_id(db: Session) -> int:
    current = db.query(func.max(RepertoireNode.repertoire_id)).scalar() or 0
    return int(current) + 1


def get_or_create_folder(db: Session, name: str, description: str) -> StudyFolder:
    folder = db.query(StudyFolder).filter(StudyFolder.name == name).first()
    if folder:
        return folder
    folder = StudyFolder(name=name, description=description, sort_order=0)
    db.add(folder)
    db.flush()
    return folder


def ensure_study_link(db: Session, opening: Opening) -> None:
    folder_name = "White Repertoire" if opening.side == "white" else "Black Repertoire"
    folder_description = (
        "Repertorio di aperture e materiale di studio per il Bianco"
        if opening.side == "white"
        else "Repertorio di aperture e materiale di studio per il Nero"
    )
    folder = get_or_create_folder(db, folder_name, folder_description)

    resource = db.query(StudyResource).filter(StudyResource.opening_id == opening.id).first()
    if resource is None:
        resource = StudyResource(
            type="opening",
            name=opening.name,
            description=f"Opening course: {opening.name}",
            opening_id=opening.id,
        )
        db.add(resource)
        db.flush()

    link = db.query(FolderResource).filter(
        FolderResource.folder_id == folder.id,
        FolderResource.resource_id == resource.id,
    ).first()
    if link is None:
        max_order = db.query(func.max(FolderResource.sort_order)).filter(
            FolderResource.folder_id == folder.id
        ).scalar() or 0
        db.add(FolderResource(folder_id=folder.id, resource_id=resource.id, sort_order=max_order + 1))


def seed_course(db: Session, course: Course, repertoire_id: int) -> str:
    opening = db.query(Opening).filter(
        Opening.name == course.name, Opening.side == course.side
    ).first()

    if opening and opening.repertoire_id:
        existing = db.query(RepertoireNode).filter(
            RepertoireNode.repertoire_id == opening.repertoire_id
        ).count()
        if existing > 0:
            ensure_study_link(db, opening)
            db.commit()
            print(
                f"  {course.name} ({course.side}): skipped (already seeded), "
                f"opening={opening.id} repertoire={opening.repertoire_id} nodes={existing}"
            )
            return "skipped"

    nodes = build_nodes(course)
    if not nodes:
        raise SystemExit(f"{course.name}: no nodes to seed")

    id_map: dict[str, int] = {}
    for node in nodes:
        parent_id = id_map[node.parent_temp_id] if node.parent_temp_id else None
        record = RepertoireNode(
            repertoire_id=repertoire_id,
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
        id_map[node.temp_id] = record.id

    root = nodes[0]
    root_id = id_map[root.temp_id]

    if opening is None:
        opening = Opening(
            name=course.name,
            side=course.side,
            starting_fen=root.fen,
            starting_node_id=root_id,
            repertoire_id=repertoire_id,
            eco_code=course.eco,
            color_code=GREEN,
        )
        db.add(opening)
        action = "created"
    else:
        opening.starting_fen = root.fen
        opening.starting_node_id = root_id
        opening.repertoire_id = repertoire_id
        opening.eco_code = course.eco
        opening.color_code = GREEN
        action = "updated"

    db.flush()
    ensure_study_link(db, opening)
    db.commit()
    print(
        f"  {course.name} ({course.side}): {action}, opening={opening.id} "
        f"repertoire={repertoire_id} nodes={len(nodes)}"
    )
    return action


def main() -> None:
    db = SessionLocal()
    try:
        current_max = next_repertoire_id(db) - 1
        print(f"Seeding {len(COURSES)} opening courses (current max repertoire_id={current_max})")
        repertoire_id = current_max
        for course in COURSES:
            opening = db.query(Opening).filter(
                Opening.name == course.name, Opening.side == course.side
            ).first()
            already_seeded = bool(
                opening
                and opening.repertoire_id
                and db.query(RepertoireNode)
                .filter(RepertoireNode.repertoire_id == opening.repertoire_id)
                .count()
                > 0
            )
            if not already_seeded:
                repertoire_id = next_repertoire_id(db)
            seed_course(db, course, repertoire_id)
        print("Done.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
