import { Chess } from 'chess.js'
import type { Square, PieceSymbol } from 'chess.js'

export const getIsStalemate = (fen: string): boolean => {
  const game = new Chess(fen)
  return game.isStalemate()
}

export const getWhoIsCheckmated = (fen: string): 'w' | 'b' | null => {
  const game = new Chess(fen)
  if (!game.isCheckmate()) return null
  return game.turn()
}

export const formatUciPv = (fen: string, uciMoves: string[]): string[] => {
  const castlingRights = fen.split(' ')[2]

  let canWhiteCastleKingSide = castlingRights.includes('K')
  let canWhiteCastleQueenSide = castlingRights.includes('Q')
  let canBlackCastleKingSide = castlingRights.includes('k')
  let canBlackCastleQueenSide = castlingRights.includes('q')

  return uciMoves.map((uci) => {
    if (uci === 'e1h1' && canWhiteCastleKingSide) {
      canWhiteCastleKingSide = false
      return 'e1g1'
    }
    if (uci === 'e1a1' && canWhiteCastleQueenSide) {
      canWhiteCastleQueenSide = false
      return 'e1c1'
    }
    if (uci === 'e8h8' && canBlackCastleKingSide) {
      canBlackCastleKingSide = false
      return 'e8g8'
    }
    if (uci === 'e8a8' && canBlackCastleQueenSide) {
      canBlackCastleQueenSide = false
      return 'e8c8'
    }
    return uci
  })
}

export const uciMoveParams = (
  uciMove: string,
): {
  from: Square
  to: Square
  promotion?: string
} => ({
  from: uciMove.slice(0, 2) as Square,
  to: uciMove.slice(2, 4) as Square,
  promotion: uciMove.slice(4, 5) || undefined,
})

const getPieceValue = (piece: PieceSymbol): number => {
  switch (piece) {
    case 'p': return 1
    case 'n': return 3
    case 'b': return 3
    case 'r': return 5
    case 'q': return 9
    default: return 0
  }
}

export const getMaterialDifference = (fen: string): number => {
  const game = new Chess(fen)
  const board = game.board().flat()

  return board.reduce((acc, square) => {
    if (!square) return acc
    if (square.color === 'w') {
      return acc + getPieceValue(square.type)
    }
    return acc - getPieceValue(square.type)
  }, 0)
}

export const isSimplePieceRecapture = (
  fen: string,
  uciMoves: [string, string],
): boolean => {
  const game = new Chess(fen)
  const moves = uciMoves.map((uciMove) => uciMoveParams(uciMove))

  if (moves[0].to !== moves[1].to) return false

  const piece = game.get(moves[0].to)
  if (piece) return true

  return false
}

export const getIsPieceSacrifice = (
  fen: string,
  playedMove: string,
  bestLinePvToPlay: string[],
): boolean => {
  if (!bestLinePvToPlay.length) return false

  const game = new Chess(fen)
  const whiteToPlay = game.turn() === 'w'
  const startingMaterialDifference = getMaterialDifference(fen)

  let moves = [playedMove, ...bestLinePvToPlay]
  if (moves.length % 2 === 1) {
    moves = moves.slice(0, -1)
  }
  let nonCapturingMovesTemp = 1

  const capturedPieces: { w: PieceSymbol[]; b: PieceSymbol[] } = {
    w: [],
    b: [],
  }
  for (const move of moves) {
    try {
      const fullMove = game.move(uciMoveParams(move))
      if (fullMove.captured) {
        capturedPieces[fullMove.color as 'w' | 'b'].push(fullMove.captured as PieceSymbol)
        nonCapturingMovesTemp = 1
      } else {
        nonCapturingMovesTemp--
        if (nonCapturingMovesTemp < 0) break
      }
    } catch {
      return false
    }
  }

  for (const p of capturedPieces['w'].slice()) {
    if (capturedPieces['b'].includes(p)) {
      capturedPieces['b'].splice(capturedPieces['b'].indexOf(p), 1)
      capturedPieces['w'].splice(capturedPieces['w'].indexOf(p), 1)
    }
  }

  if (
    Math.abs(capturedPieces['w'].length - capturedPieces['b'].length) <= 1 &&
    capturedPieces['w'].concat(capturedPieces['b']).every((p) => p === 'p')
  ) {
    return false
  }

  const endingMaterialDifference = getMaterialDifference(game.fen())

  const materialDiff = endingMaterialDifference - startingMaterialDifference
  const materialDiffPlayerRelative = whiteToPlay ? materialDiff : -materialDiff

  return materialDiffPlayerRelative < 0
}
