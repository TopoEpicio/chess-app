import type { PuzzleTheme, GamePhase } from '../src/types.ts'

export interface TestPositionFixture {
  fen: string
  moveSan: string
  expected: {
    themes: PuzzleTheme[]
    difficulty: number
    phase: GamePhase
  }
}

export const TEST_POSITIONS: TestPositionFixture[] = [
  {
    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
    moveSan: "",
    expected: {
      themes: ["checkmate"],
      difficulty: 1,
      phase: "opening",
    },
  },
  {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
    moveSan: "Bxf7+",
    expected: {
      themes: ["fork"],
      difficulty: 3,
      phase: "opening",
    },
  },
  {
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 4 4",
    moveSan: "e5",
    expected: {
      themes: ["fork"],
      difficulty: 2,
      phase: "opening",
    },
  },
  {
    fen: "r1bqk2r/ppp2ppp/2np4/2b1p3/2B1Pn2/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 1 6",
    moveSan: "Nbd2",
    expected: {
      themes: ["fork"],
      difficulty: 3,
      phase: "opening",
    },
  },
]
