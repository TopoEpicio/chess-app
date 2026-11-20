import { Chess } from 'chess.js'
import type { PositionEval } from '../types/eval'
import type { MultiPvLine } from '../types/analysis'

function sanFromUci(fen: string, uci: string): string {
  if (!uci) return ''
  try {
    const game = new Chess(fen)
    const move = game.move(uci)
    game.undo()
    return move.san
  } catch {
    return ''
  }
}

export function positionEvalToMultiPvLines(fen: string, positionEval: PositionEval): MultiPvLine[] {
  return positionEval.lines.map((line) => ({
    rank: line.multiPv,
    san: sanFromUci(fen, line.pv[0]),
    uci: line.pv[0] ?? '',
    evaluation: line.mate !== undefined ? 0 : (line.cp ?? 0) / 100,
    mate: line.mate ?? null,
    depth: line.depth,
    pv: line.pv,
  }))
}
