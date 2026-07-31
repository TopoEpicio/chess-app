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

function buildQgdTree() {
  const tree = createTree()
  const rootId = tree.rootId

  let t = ms(tree, rootId, ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'])
  const nf6Id = childId(t, childId(t, childId(t, childId(t, childId(t, childId(t, rootId, 'd4'), 'd5'), 'c4'), 'e6'), 'Nc3'), 'Nf6')

  t = ms(t, nf6Id, ['Bg5', 'Be7', 'e3', 'O-O'])
  const be7Id = childId(t, childId(t, nf6Id, 'Bg5'), 'Be7')

  t = ms(t, nf6Id, ['Bg5', 'dxc4', 'e4'])

  t = ms(t, rootId, ['d4', 'd5', 'c4', 'e6', 'Nf3', 'Nf6', 'Nc3', 'Be7'])
  const nf3Id = childId(t, childId(t, childId(t, childId(t, childId(t, rootId, 'd4'), 'd5'), 'c4'), 'e6'), 'Nf3')

  return { tree: t, nf6Id, be7Id, nf3Id }
}

const { tree, nf6Id, be7Id, nf3Id } = buildQgdTree()

const course: Course = {
  id: 'qgd',
  title: "Queen's Gambit Declined",
  description: "Master the Queen's Gambit Declined — Black's most solid response to 1.d4, trusted by world champions for over a century",
  difficulty: 'intermediate',
  side: 'black',
  tree,
  modules: [
    {
      id: 'qgd-intro',
      title: 'Introduction & Key Ideas',
      description: "Understand the QGD philosophy — why Black declines the gambit",
      difficulty: 'intermediate',
      order: 1,
      lessons: [
        {
          type: 'theory',
          id: 'qgd-intro-overview',
          title: "Why Decline the Queen's Gambit?",
          content: `## Why Decline the Queen's Gambit?\n\nAfter 1.d4 d5 2.c4, Black can accept the gambit (2...dxc4) or decline with 2...e6. The QGD has been the choice of world champions for over a century.\n\n### Why Play the QGD?\n- **Rock-solid pawn structure**: The e6-d5 pawn chain is extremely resilient\n- **No early weaknesses**: Black doesn't create any targets\n- **Proven at the highest level**: Kasparov, Karpov, Carlsen all played it\n- **Clear strategic plans**: Develop, castle, play ...c5 or ...e5`,
        },
        {
          type: 'guess-move',
          id: 'qgd-intro-gm',
          title: 'Decline the Gambit',
          nodeId: nf6Id,
          hints: ["Black doesn't take the pawn on c4", "What move keeps the center solid?"],
        },
      ],
    },
    {
      id: 'qgd-classical',
      title: 'Classical: 4.Bg5',
      description: "The most aggressive attempt — White pins the knight on f6",
      difficulty: 'intermediate',
      order: 2,
      lessons: [
        {
          type: 'theory',
          id: 'qgd-classical-overview',
          title: "4.Bg5 — The Classical Main Line",
          content: `## 4.Bg5 — The Classical Main Line\n\nAfter 4.Bg5, White pins the knight on f6. This is the most testing line.\n\n### Black's Response: 4...Be7\nBlack unpins immediately and prepares to castle.\n\n### The Tartakower Variation\nAfter 4.Bg5 Be7 5.e3 h6 6.Bh4 b6 — Black fianchettos the bishop to b7.\n\n### The Cambridge Springs\n4.Bg5 Nbd7 5.e3 Qa5 — Black pins the knight on c3.\n\n### Practical Tips\n- Don't panic after Bg5 — the pin is annoying but not dangerous\n- Play ...h6 to force the bishop to declare\n- Castle early — king safety is paramount`,
        },
        {
          type: 'guess-move',
          id: 'qgd-classical-gm',
          title: 'Unpin the Knight',
          nodeId: be7Id,
          hints: ["The knight on f6 is pinned — how to unpin?", "Black needs to develop the bishop"],
        },
      ],
    },
    {
      id: 'qgd-rubinstein',
      title: 'Rubinstein: 4.Nf3',
      description: 'White avoids early committal moves',
      difficulty: 'intermediate',
      order: 3,
      lessons: [
        {
          type: 'theory',
          id: 'qgd-rubinstein-overview',
          title: "4.Nf3 — The Rubinstein Variation",
          content: `## 4.Nf3 — The Rubinstein Variation\n\nAfter 4.Nf3, White avoids the early Bg5 and keeps options open.\n\n### Black's Setup\n4.Nf3 Nf6 5.Nc3 Be7 6.Bf4 (London-style) or 6.Bg5 (transposing to classical).\n\n### Black's Plans\n- ...O-O: King safety first\n- ...c5: Challenge White's center\n- ...Nbd7: Support the center\n- ...b6 + Bb7: Fianchetto the bishop`,
        },
        {
          type: 'guess-move',
          id: 'qgd-rubinstein-gm',
          title: 'Develop the Knight',
          nodeId: nf3Id,
          hints: ['White develops the knight to a natural square', 'What is Black\'s best set-up?'],
        },
      ],
    },
    {
      id: 'qgd-tartakower',
      title: 'The Tartakower Variation',
      description: 'Black fianchettoes the bishop — a sophisticated strategic plan',
      difficulty: 'intermediate',
      order: 4,
      lessons: [
        {
          type: 'theory',
          id: 'qgd-tartakower-overview',
          title: 'The Tartakower Variation (6...b6)',
          content: `## The Tartakower Variation (6...b6)\n\nAfter 4.Bg5 Be7 5.e3 h6 6.Bh4 b6 — the Tartakower Variation is one of Black's most sophisticated setups.\n\n### Key Ideas\n- Black fianchettos the bishop to b7\n- The bishop controls the long diagonal (a8-h1)\n- Black aims for ...c5 to challenge White's center\n\n### Famous Games\n- Kasparov vs Karpov, World Championship 1985: Several Tartakower games\n\n### Practical Tips\n- Don't fear the isolated d-pawn — it's a strength in dynamic positions\n- Use the bishop pair actively\n- Look for ...c5 and ...e5 breaks`,
        },
      ],
    },
  ],
}

export default course
