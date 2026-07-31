import { createTree, addMove } from '../../domain/tree/TreeEngine'
import type { Course, TheoryLesson, GuessMoveLesson } from '../../domain/course/types'
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

function buildLondonTree() {
  const tree = createTree()
  const rootId = tree.rootId

  let t = ms(tree, rootId, ['d4', 'd5', 'Bf4'])
  const bf4Id = childId(t, childId(t, childId(t, rootId, 'd4'), 'd5'), 'Bf4')

  t = ms(t, bf4Id, ['Nf6', 'e3', 'e6', 'Nf3'])
  const nf3Id = childId(t, childId(t, childId(t, childId(t, bf4Id, 'Nf6'), 'e3'), 'e6'), 'Nf3')

  t = ms(t, nf3Id, ['Be7', 'Bd3', 'O-O', 'O-O'])
  t = ms(t, nf3Id, ['c5', 'c3'])
  const c5Id = childId(t, nf3Id, 'c5')

  return { tree: t, bf4Id, nf3Id, c5Id }
}

const { tree, bf4Id, nf3Id, c5Id } = buildLondonTree()

const course: Course = {
  id: 'london-system',
  title: 'London System',
  description: 'Master the London System — a solid and versatile 1.d4 opening system for White that works against almost any Black setup',
  difficulty: 'beginner',
  side: 'white',
  tree,
  modules: [
    {
      id: 'london-intro',
      title: 'Introduction & Key Ideas',
      description: 'Understand the London System philosophy and setup',
      difficulty: 'beginner',
      order: 1,
      lessons: [
        {
          type: 'theory',
          id: 'london-intro-overview',
          title: 'What is the London System?',
          content: `## What is the London System?\n\nThe London System is a chess opening for White characterized by 1.d4 d5 2.Bf4. It's one of the most popular and reliable systems at all levels.\n\n### Key Features\n- **Universal setup**: Works against almost any Black defense\n- **Low theory**: The same setup applies regardless of Black's response\n- **Solid structure**: The pawn pyramid (d4, e3, c3) is very resilient\n- **Active bishop**: The dark-squared bishop on f4 is White's key piece`,
        },
        {
          type: 'guess-move',
          id: 'london-intro-bf4',
          title: 'The London Bishop',
          nodeId: bf4Id,
          hints: ['The defining move of the London System', 'Where does White put the dark-squared bishop early?'],
        },
      ],
    },
    {
      id: 'london-main',
      title: 'Main Line: Against 2...Nf6',
      description: 'The most common response — how to handle the standard setup',
      difficulty: 'beginner',
      order: 2,
      lessons: [
        {
          type: 'theory',
          id: 'london-main-overview',
          title: 'Against 2...Nf6: The Standard Setup',
          content: `## Against 2...Nf6: The Standard Setup\n\nAfter 1.d4 d5 2.Bf4 Nf6, White continues with 3.e3 e6 4.Nf3.\n\n### Black's Options\n- **4...c5** (Main Line): Black strikes at White's center. White plays 5.c3 Nc6 6.Nbd2.\n- **4...Bd6**: Black trades the active bishop.\n- **4...Be7**: The solid choice.\n- **4...c6**: A Slav-like setup.`,
        },
        {
          type: 'guess-move',
          id: 'london-main-c5',
          title: 'Against 4...c5',
          nodeId: c5Id,
          hints: ['Black attacks the center — White should reinforce with c3', 'The pawn structure is key in the London'],
        },
      ],
    },
    {
      id: 'london-bd3',
      title: 'The Bd3 Setup',
      description: 'White\'s most active setup targeting h7',
      difficulty: 'intermediate',
      order: 3,
      lessons: [
        {
          type: 'theory',
          id: 'london-bd3-overview',
          title: 'The Bd3 London Setup',
          content: `## The Bd3 London Setup\n\nAfter the basic development (d4, Bf4, e3, Nf3), White often plays Bd3 — aiming at the kingside.\n\n### Why Bd3?\n- The bishop targets h7\n- It supports the e4 break\n- Works well with Ne5 ideas\n\n### Typical Attacking Pattern\n1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 Be7 5.Bd3 O-O 6.O-O`,
        },
        {
          type: 'guess-move',
          id: 'london-bd3-ne5',
          title: 'The Knight Jump',
          nodeId: nf3Id,
          hints: ['White has a strong centralizing move available', 'Where does the knight want to go?'],
        },
      ],
    },
    {
      id: 'london-endgames',
      title: 'London Endgames',
      description: 'How the London transitions to favorable endgames',
      difficulty: 'intermediate',
      order: 4,
      lessons: [
        {
          type: 'theory',
          id: 'london-endgames-overview',
          title: 'Endgame Advantages of the London',
          content: `## Endgame Advantages of the London\n\nThe London System often leads to favorable endgames for White.\n\n### Structural Advantages\n- White's pawn structure (d4, e3, c3) is extremely solid\n- No isolated or doubled pawns\n- The d4 pawn controls key central squares\n\n### Key Example\nAfter d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 Be7 5.Bd3 O-O 6.O-O — White has a slight but lasting advantage.`,
        },
      ],
    },
  ],
}

export default course
