import type { MoveAnalysisData, ArrowConfig } from '../../types/analysis'

const ARROW_COLORS = {
  best: '#008000',
  second: '#0044ff',
  third: '#8800cc',
  threat: '#ff0000',
}

function uciToSquares(uci: string): { from: string; to: string } {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
  }
}

export function getBoardArrows(
  moveData: MoveAnalysisData | null,
  config: ArrowConfig,
): Array<{ startSquare: string; endSquare: string; color: string }> {
  if (!moveData) return []

  const arrows: Array<{ startSquare: string; endSquare: string; color: string }> = []

  if (config.showBestMove && moveData.best_move_uci) {
    const { from, to } = uciToSquares(moveData.best_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.best })
  }
  if (config.showSecondBest && moveData.second_move_uci) {
    const { from, to } = uciToSquares(moveData.second_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.second })
  }
  if (config.showThirdBest && moveData.third_move_uci) {
    const { from, to } = uciToSquares(moveData.third_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.third })
  }
  if (config.showThreats && moveData.pvs?.[0] && moveData.pvs[0].length >= 3) {
    const threatUci = moveData.pvs[0][2]
    if (threatUci) {
      const { from, to } = uciToSquares(threatUci)
      arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.threat })
    }
  }

  return arrows
}
