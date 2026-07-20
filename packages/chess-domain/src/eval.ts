import { Chess } from 'chess.js'

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
}

export class PositionEvaluator {
  static evaluate(fen: string): number {
    let score = 0
    const board = new Chess(fen)
    const boardArr = board.board()

    for (const row of boardArr) {
      for (const sq of row) {
        if (sq) {
          const val = PIECE_VALUES[sq.type] ?? 0
          score += sq.color === 'w' ? val : -val
        }
      }
    }

    return score
  }
}
