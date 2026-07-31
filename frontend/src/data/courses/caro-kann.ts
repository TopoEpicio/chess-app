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

function buildCaroKannTree() {
  const tree = createTree()
  const rootId = tree.rootId

  let t = ms(tree, rootId, ['e4', 'c6'])
  const c6Id = childId(t, childId(t, rootId, 'e4'), 'c6')

  t = ms(t, c6Id, ['d4', 'd5'])
  const d5Id = childId(t, childId(t, c6Id, 'd4'), 'd5')

  t = ms(t, d5Id, ['Nc3', 'dxe4', 'Nxe4'])
  const classicalId = childId(t, childId(t, childId(t, d5Id, 'Nc3'), 'dxe4'), 'Nxe4')

  t = ms(t, classicalId, ['Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'Ne5', 'Bh7', 'Qh5'])

  t = ms(t, classicalId, ['Nd7', 'Ng5', 'Ngf6', 'Bd3', 'e6', 'N1f3', 'Bd6', 'Qe2', 'h6', 'Ne4', 'Nxe4', 'Qxe4'])

  t = ms(t, classicalId, ['Nf6', 'Nxf6', 'exf6', 'Nf3', 'Bd6', 'Bd3'])

  t = ms(t, d5Id, ['e5', 'Bf5'])
  const advanceId = childId(t, d5Id, 'e5')
  const bf5advId = childId(t, advanceId, 'Bf5')

  t = ms(t, bf5advId, ['Nf3', 'e6', 'Be2', 'c5', 'O-O', 'Nc6', 'Be3', 'cxd4', 'Nxd4', 'Nge7'])
  const nf3Id = childId(t, bf5advId, 'Nf3')

  t = ms(t, bf5advId, ['h4', 'h5', 'c4', 'e6', 'Nc3', 'Bb4'])

  t = ms(t, bf5advId, ['Bd3', 'Bxd3', 'Qxd3', 'e6', 'Nf3', 'c5', 'c3', 'Nc6', 'O-O'])

  t = ms(t, d5Id, ['exd5', 'cxd5'])
  const exchangeId = childId(t, childId(t, d5Id, 'exd5'), 'cxd5')
  t = ms(t, exchangeId, ['Bd3', 'Nc6', 'c3', 'Nf6', 'Bf4', 'Bg4', 'Qb3', 'Qd7', 'Nd2', 'e5'])

  t = ms(t, d5Id, ['c3', 'Nf6', 'e5', 'Ne4', 'Nf3', 'Bg4', 'Be2', 'e6', 'O-O'])

  t = ms(t, d5Id, ['f3', 'dxe4', 'fxe4', 'e5', 'Nf3', 'Bg4', 'Bc4', 'Nd7', 'O-O', 'Ngf6'])

  t = ms(t, d5Id, ['Nd2', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'Nf3', 'Nd7', 'Bd3', 'e6', 'O-O', 'Ngf6', 'Re1', 'Be7', 'Bf4', 'O-O'])

  t = ms(t, c6Id, ['Nf3', 'd5', 'Nc3', 'Bg4', 'h3', 'Bxf3', 'Qxf3', 'Nf6', 'd3', 'e6', 'Bf4', 'Bb4', 'e5', 'Nfd7', 'Bd2', 'Bxc3', 'Bxc3', 'c5'])

  t = ms(t, c6Id, ['c4', 'd5', 'cxd5', 'cxd5', 'd4', 'Nc6', 'Nc3', 'Nf6', 'Nf3', 'Bg4', 'Be2', 'e6', 'O-O', 'Be7', 'Be3', 'O-O'])

  return { tree: t, c6Id, d5Id, classicalId, bf5advId, nf3Id, exchangeId }
}

const { tree, d5Id, bf5advId, nf3Id } = buildCaroKannTree()

const course: Course = {
  id: 'caro-kann',
  title: 'Caro-Kann Defense',
  description: 'Master the Caro-Kann Defense (B10-B19) — one of the most solid and respected responses to 1.e4. Learn the Classical, Advance, Exchange, and Panov structures.',
  difficulty: 'beginner',
  side: 'black',
  tree,
  modules: [
    {
      id: 'caro-intro',
      title: 'Introduction & Basic Principles',
      description: 'Understand the Caro-Kann philosophy and basic pawn structures',
      difficulty: 'beginner',
      order: 1,
      lessons: [
        {
          type: 'theory',
          id: 'caro-intro-overview',
          title: 'Why the Caro-Kann?',
          content: `## Why the Caro-Kann?\n\nThe Caro-Kann Defense (1.e4 c6) is one of the most solid replies to 1.e4. Unlike the Sicilian Defense (1...c5), the Caro-Kann avoids immediate tactical complications in favor of a solid pawn structure.\n\n### Key Ideas\n- **Solid pawn structure**: Black typically plays ...d5 on move 2, challenging White's center\n- **Good bishop**: Unlike the French Defense, Black's light-squared bishop is not locked behind the pawn chain\n- **Endgame potential**: The Caro-Kann often leads to positions where Black has excellent endgame prospects`,
        },
        {
          type: 'guess-move',
          id: 'caro-intro-basic',
          title: 'Caro-Kann Basic Moves',
          nodeId: d5Id,
          hints: [
            'After 1.e4, what is the characteristic Caro-Kann move?',
            'Black wants to challenge the center on move 2',
          ],
        },
      ],
    },
    {
      id: 'caro-classical',
      title: 'Classical Variation',
      description: 'The main line of the Caro-Kann: 3.Nc3 dxe4 4.Nxe4',
      difficulty: 'intermediate',
      order: 2,
      lessons: [
        {
          type: 'theory',
          id: 'caro-classical-overview',
          title: 'Classical Variation Overview',
          content: `## Classical Variation (3.Nc3 dxe4 4.Nxe4)\n\nThe Classical Variation is the most principled response. White develops the knight and recaptures in the center.\n\n### Main Lines\n- **4...Bf5**: The most solid. Black develops the light-squared bishop actively.\n- **4...Nd7** (Karpov Variation): Anatoly Karpov's favorite.\n- **4...Nf6** (Bronstein Variation): The most forcing.`,
        },
        {
          type: 'guess-move',
          id: 'caro-classical-gm',
          title: 'Classical Main: Pick the Best Move',
          nodeId: d5Id,
          hints: ['Black should challenge White\'s center', 'Consider all three main options'],
        },
      ],
    },
    {
      id: 'caro-advance',
      title: 'Advance Variation',
      description: 'White closes the center with 3.e5',
      difficulty: 'intermediate',
      order: 3,
      lessons: [
        {
          type: 'theory',
          id: 'caro-advance-overview',
          title: 'Advance Variation Overview',
          content: `## Advance Variation (3.e5 Bf5)\n\nWhite pushes forward, gaining space. The critical difference from the French: Black's light-squared bishop is OUTSIDE the pawn chain on f5.\n\n### Key lines\n- **4.Nf3 e6**: Classical/Short approach\n- **4.h4 h5** (Tal Variation): Mikhail Tal's aggressive response\n- **4.Bd3 Bxd3 5.Qxd3 e6**: Positional trade`,
        },
        {
          type: 'guess-move',
          id: 'caro-advance-gm',
          title: 'Advance: Develop the Bishop',
          nodeId: bf5advId,
          hints: ['Where does Black\'s light-squared bishop go?', 'Unlike the French, the bishop is not locked in'],
        },
      ],
    },
    {
      id: 'caro-exchange',
      title: 'Exchange & Panov Variations',
      description: '3.exd5 cxd5 leads to open positions',
      difficulty: 'intermediate',
      order: 4,
      lessons: [
        {
          type: 'theory',
          id: 'caro-exchange-overview',
          title: 'Exchange Variation Overview',
          content: `## Exchange Variation (3.exd5 cxd5)\n\nWhite simplifies the position, leading to an isolated queen's pawn (IQP) structure.\n\n### Main Line\n**4.Bd3 Nc6 5.c3 Nf6 6.Bf4**: Solid development. Black typically plays ...Bg4 followed by ...e5.\n\n### Panov-Botvinnik Attack\n**4.c4 Nf6 5.Nc3**: White immediately challenges the center.`,
        },
        {
          type: 'theory',
          id: 'caro-exchange-panov',
          title: 'Panov-Botvinnik Attack',
          content: `## Panov-Botvinnik Attack (4.c4 Nf6 5.Nc3)\n\nThe Panov is a sharp and aggressive response. White offers the c-pawn to create an isolated queen's pawn. Black can accept (5...dxc4) or decline with 5...e6.`,
        },
      ],
    },
    {
      id: 'caro-fantasy',
      title: 'Fantasy & Other Systems',
      description: 'Less common but dangerous alternatives: 3.f3, 2.Nf3, 2.c4',
      difficulty: 'intermediate',
      order: 5,
      lessons: [
        {
          type: 'theory',
          id: 'caro-fantasy-overview',
          title: 'Fantasy Variation (3.f3)',
          content: `## Fantasy Variation (3.f3)\n\nThe Fantasy Variation is a sharp but slightly dubious attempt by White. Black should immediately challenge in the center: 3...dxe4 4.fxe4 e5!\n\nAfter 5.Nf3 Bg4 6.Bc4 Nc6 7.O-O Nf6, Black has active piece play.`,
        },
        {
          type: 'theory',
          id: 'caro-fantasy-two-knights',
          title: '2.Nf3 d5 (Two Knights)',
          content: `## Two Knights Variation (2.Nf3 d5 3.Nc3)\n\nWhite delays d4 and develops the knight first. Black's play is straightforward: develop, castle, and play ...c5.\n\n### Key Line\n3...Bg4 4.h3 Bxf3 5.Qxf3 Nf6 6.d3 e6 7.Bf4 Bb4`,
        },
        {
          type: 'guess-move',
          id: 'caro-fantasy-gm',
          title: 'Two Knights: Best Move',
          nodeId: d5Id,
          hints: ['After 2.Nf3, what is Black\'s best response?'],
        },
      ],
    },
  ],
}

export default course
