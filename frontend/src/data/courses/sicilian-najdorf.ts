import { pgnToCourseTree, parsePgn } from './importPgn'
import { getAllMainlineNodes, addMove, pathFromRoot, moveSequence } from '../../domain/tree/TreeEngine'
import { Chess } from 'chess.js'
import type { Course, GuessMoveLesson, TheoryLesson } from '../../domain/course/types'

const mainLine = `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6`

const na1 = `6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. f5`
const na2 = `6. Bg5 e6 7. f4 Qc7 8. Qf3 b5 9. Bxf6 gxf6 10. a3 Bb7`
const na3 = `6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 b4 13. Ne2 a5`
const na4 = `6. Be3 Ng4 7. Bg5 h6 8. Bh4 g5 9. Bg3 Bg7`
const na5 = `6. f4 Qc7 7. Bf3 e5 8. Nf5 g6 9. Nxe5 dxe5 10. Bxb7 Bxb7 11. Qxd8+ Kxd8`
const na6 = `6. f4 e5 7. Nf3 Qc7 8. Bd3 Nbd7 9. O-O Be7 10. Qe1 O-O 11. Qg3 exf4`

const tree = pgnToCourseTree(
  [mainLine, na1, na2, na3, na4, na5, na6].join('\n\n'),
  (depth, isMainline) => isMainline ? 5 : depth < 8 ? 4 : 3,
)

const mainline = getAllMainlineNodes(tree)
const nodes = Object.values(tree.nodes)

const bc5Id = mainline[1]?.id || tree.rootId
const nf6Id = mainline[4]?.id || tree.rootId

const sicilianNajdorfCourse: Course = {
  id: 'sicilian-najdorf',
  title: 'Sicilian Najdorf',
  description: 'Master the Sicilian Najdorf (B90-B99) — one of the sharpest and most respected openings in chess',
  difficulty: 'advanced',
  side: 'black',
  eco: 'B90-B99',
  tree,
  modules: [
    {
      id: 'najdorf-intro',
      title: 'Introduction to the Najdorf',
      description: 'Key ideas and move order',
      difficulty: 'advanced',
      order: 1,
      lessons: [
        {
          type: 'theory',
          id: 'najdorf-intro-theory',
          title: 'Why Play the Najdorf?',
          content: `The Sicilian Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6) is Black's most ambitious response to 1.e4.

Key Ideas for Black:
- Control d5 with ...e5 and ...Be6
- Pressure the center with ...b5 and ...Bb7
- Attack on the queenside while White attacks on the kingside
- The ...e5 break establishes a strong center

Main White Systems:
1. 6.Bg5 (Classical Main Line) — sharpest, most theoretical
2. 6.Be3 (English Attack) — White castles queenside and launches a kingside pawn storm
3. 6.f4 — positional approach with quick development
4. 6.Bc4 — direct attack on f7
5. 6.g3 — hypermodern setup`,
        } as TheoryLesson,
        {
          type: 'guess-move',
          id: 'najdorf-intro-gm1',
          title: 'Find the Najdorf Setup',
          nodeId: nf6Id,
          hints: ['Black plays a6 to prevent Nb5', 'This move defines the Najdorf'],
        } as GuessMoveLesson,
      ],
    },
    {
      id: 'najdorf-classical',
      title: 'Classical Main Line (6.Bg5)',
      description: 'The most critical Najdorf variation',
      difficulty: 'advanced',
      order: 2,
      lessons: [
        {
          type: 'theory',
          id: 'najdorf-classical-intro',
          title: '6.Bg5 e6 7.f4 Be7',
          content: `The Classical Main Line is the most heavily analyzed Najdorf variation.

White pins the knight and prepares a kingside attack. Black must respond accurately:

Key ideas:
- ...b5 is a typical counter to challenge White's center
- Black often plays ...Nbd7 to protect the e5 square
- The g4-g5 push is White's main attacking plan
- Black's play revolves around the c-file and queenside expansion

After 8.Qf3 Qc7 9.O-O-O Nbd7, both sides are committed to opposite side castling.`,
        } as TheoryLesson,
        {
          type: 'guess-move',
          id: 'najdorf-classical-gm-b5',
          title: 'Find the Counterplay',
          nodeId: Object.values(tree.nodes).find(n => n.move === 'O-O-O')?.id || tree.rootId,
          hints: ['Black needs to create queenside play', 'The c-pawn is already gone, use the b-pawn'],
        } as GuessMoveLesson,
      ],
    },
    {
      id: 'najdorf-english',
      title: 'English Attack (6.Be3)',
      description: 'Modern attacking approach for White',
      difficulty: 'advanced',
      order: 3,
      lessons: [
        {
          type: 'theory',
          id: 'najdorf-english-intro',
          title: '6.Be3 e5 7.Nb3 Be6',
          content: `The English Attack has become the most popular way to combat the Najdorf.

White sets up: Be3, f3, Qd2, O-O-O, g4, h4 — a direct kingside attack.

Black's typical response:
- ...Be6 to control the center
- ...Nbd7 to reinforce
- ...b5 to counterattack
- ...Be7 (not Bd6, which would block the d-file)

The resulting positions are extremely sharp with both sides attacking on opposite wings.`,
        } as TheoryLesson,
      ],
    },
  ],
}

export default sicilianNajdorfCourse
