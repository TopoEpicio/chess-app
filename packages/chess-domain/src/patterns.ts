import { Chess } from 'chess.js'
import type { PuzzleTheme } from './types.ts'

export class PatternDetector {
  static detect(fen: string, _moveSan: string): PuzzleTheme[] {
    const game = new Chess(fen)
    const patterns: PuzzleTheme[] = []

    if (game.isCheckmate()) {
      return ['checkmate']
    }

    const turn = game.turn()
    const oppColor = turn === 'w' ? 'b' : 'w'
    const board = game.board()

    for (const row of board) {
      for (const sq of row) {
        if (!sq || sq.color !== turn) continue
        const moves = game.moves({ square: sq.square, verbose: true })
        const captures = moves.filter(m => m.captured)
        if (captures.length >= 2) {
          patterns.push('fork')
        }
      }
    }

    if (!patterns.includes('fork')) {
      for (const row of board) {
        for (const sq of row) {
          if (!sq || sq.color !== oppColor || sq.type === 'k') continue
          const attackers = game.attackers(sq.square, turn)
          if (attackers.length === 0) continue
          const defenders = game.attackers(sq.square, oppColor)
          if (attackers.length > defenders.length) {
            patterns.push('hanging_piece')
          }
        }
      }
    }

    if (!patterns.length && game.isCheck()) {
      patterns.push('double_attack')
    }

    return patterns
  }
}
