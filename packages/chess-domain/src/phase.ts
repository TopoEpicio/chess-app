import { Chess } from 'chess.js'
import type { GamePhase } from './types.ts'

export class PhaseDetector {
  static detect(fen: string, moveNumber: number): GamePhase {
    if (moveNumber <= 12) {
      return 'opening'
    }

    const board = new Chess(fen)
    let nonPawnPieces = 0
    const boardArr = board.board()

    for (const row of boardArr) {
      for (const sq of row) {
        if (sq && sq.type !== 'p' && sq.type !== 'k') {
          nonPawnPieces++
        }
      }
    }

    if (nonPawnPieces <= 7) {
      return 'endgame'
    }

    return 'middlegame'
  }
}
