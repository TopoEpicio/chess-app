import { createTree, addMove } from '../../domain/tree/TreeEngine'
import type { Course, GuessMoveLesson, TheoryLesson } from '../../domain/course/types'
import type { TreeState } from '../../domain/tree/types'

function ms(tree: TreeState, startId: string, moves: string[]) {
  let t = tree
  let id = startId
  for (const san of moves) {
    const r = addMove(t, { parentId: id, san })
    t = r.tree
    id = r.nodeId
  }
  return t
}

function childId(tree: TreeState, parentId: string, move: string): string {
  return Object.values(tree.nodes).find(n => n.parentId === parentId && n.move === move)?.id || ''
}

function buildItalianTree() {
  const tree = createTree()
  const rootId = tree.rootId

  // Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4
  let t = ms(tree, rootId, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'])
  const bc4Id = childId(t, childId(t, childId(t, childId(t, childId(t, rootId, 'e4'), 'e5'), 'Nf3'), 'Nc6'), 'Bc4')

  // --- 3...Nf6 (Two Knights Defense) ---
  t = ms(t, bc4Id, ['Nf6'])
  const nf6Id = childId(t, bc4Id, 'Nf6')

  // Fried Liver: 4.Ng5 d5 5.exd5 Na5 (modern main line)
  t = ms(t, nf6Id, ['Ng5', 'd5', 'exd5', 'Na5', 'Bb5', 'c6', 'dxc6', 'bxc6', 'Be2', 'h6', 'Nf3', 'e4', 'Ne5', 'Bd6', 'd4', 'exd3', 'Nxd3'])
  const ng5Id = childId(t, nf6Id, 'Ng5')

  // Two Knights positional: 4.d4 exd4 5.O-O
  t = ms(t, nf6Id, ['d4', 'exd4', 'O-O'])

  // --- 3...Bc5 (Giuoco Piano) ---
  t = ms(t, bc4Id, ['Bc5'])
  const bc5Id = childId(t, bc4Id, 'Bc5')

  // Giuoco Pianissimo: 4.d3 Nf6 5.c3 d6 6.O-O O-O 7.Nbd2
  t = ms(t, bc5Id, ['d3', 'Nf6', 'c3', 'd6', 'O-O', 'O-O', 'Nbd2'])

  // Greco Gambit: 4.d4 exd4 5.c3
  t = ms(t, bc5Id, ['d4', 'exd4', 'c3'])

  // Evans Gambit: 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d6 8.Qb3 Qf6 9.e5
  t = ms(t, bc5Id, ['b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'd6', 'Qb3', 'Qf6', 'e5'])

  // --- 3...Be7 (Hungarian Defense) ---
  t = ms(t, bc4Id, ['Be7', 'd4', 'd6', 'h3', 'Nf6', 'Nc3'])

  const d3Id = childId(t, bc5Id, 'd3')

  return { tree: t, bc4Id, bc5Id, nf6Id, ng5Id, d3Id }
}

const { tree, bc4Id, bc5Id, nf6Id, ng5Id } = buildItalianTree()

const italianGameCourse: Course = {
  id: 'italian-game',
  title: 'Italian Game',
  description: 'Master the Italian Game from the basics to advanced lines including the Giuoco Piano, Two Knights Defense, and Evans Gambit',
  difficulty: 'beginner',
  side: 'white',
  eco: 'C50-C54',
  tree,
  modules: [
    {
      id: 'italian-intro',
      title: 'Introduction to the Italian Game',
      description: 'Understand the key ideas behind the Italian Game',
      difficulty: 'beginner',
      order: 1,
      lessons: [
        {
          type: 'theory',
          id: 'italian-intro-theory',
          title: 'Why Play the Italian Game?',
          content: `The Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) is one of the oldest chess openings.

Key Ideas for White:
- Control the center with e4 and d4
- Develop the kingside quickly and castle early
- Pressure f7, the weakest square in Black's camp
- Prepare d4 to claim the center

The Main Plans:
1. d3 (Giuoco Pianissimo): slow buildup, positional play
2. c3 + d4: central break, more aggressive
3. Bb5 (Two Knights): pin the knight
4. Ng5 (Fried Liver Attack): sacrificial attacking line
5. b4 (Evans Gambit): give a pawn for rapid development`,
        } as TheoryLesson,
        {
          type: 'guess-move',
          id: 'italian-intro-gm1',
          title: 'Find the Italian Game Setup',
          nodeId: bc4Id,
          hints: ['Develop the knight to attack e5', 'Bring out the bishop to a strong diagonal'],
        } as GuessMoveLesson,
      ],
    },
    {
      id: 'italian-giuoco-piano',
      title: 'Giuoco Piano (C50-C54)',
      description: 'The quiet game - positional play in the Italian',
      difficulty: 'beginner',
      order: 2,
      lessons: [
        {
          type: 'theory',
          id: 'gp-intro',
          title: 'Giuoco Piano Basics',
          content: `The Giuoco Piano (3...Bc5) is the classical response. White has a choice between:
1. d3 (Giuoco Pianissimo): very solid, avoids tactics
2. d4 (Greco Gambit): immediate central break
3. b4 (Evans Gambit): sacrificial approach`,
        } as TheoryLesson,
        {
          type: 'guess-move',
          id: 'gp-gm-d3',
          title: 'Choose the Right Setup',
          nodeId: bc5Id,
          hints: ['Think about pawn structure', 'Consider piece development order'],
        } as GuessMoveLesson,
      ],
    },
    {
      id: 'italian-two-knights',
      title: 'Two Knights Defense (C55-C59)',
      description: 'The sharpest Italian variation',
      difficulty: 'intermediate',
      order: 3,
      lessons: [
        {
          type: 'theory',
          id: 'tk-intro',
          title: 'Two Knights Defense',
          content: `After 3...Nf6, White can play 4.Ng5 attacking f7. The Two Knights Defense leads to extremely sharp play.`,
        } as TheoryLesson,
        {
          type: 'guess-move',
          id: 'tk-gm-ng5',
          title: 'Find the Attacking Move',
          nodeId: nf6Id,
          hints: ['Look for the threat to f7'],
        } as GuessMoveLesson,
      ],
    },
  ],
}

export default italianGameCourse
