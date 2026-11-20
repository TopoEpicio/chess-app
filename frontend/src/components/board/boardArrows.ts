import type { MoveAnalysisData, ArrowConfig } from '../../types/analysis'
import type { LineEval } from '../../types/eval'

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

export interface BoardArrow {
  startSquare: string
  endSquare: string
  color: string
}

/**
 * Builds the board arrows for the current position.
 *
 * `engineLines` is the *live* engine result (the very same array that renders
 * the engine-lines table on the left). When it is available it takes priority
 * over `moveData`, so the arrow always points at the very move shown as the
 * first move of line #1 — they can never disagree.
 *
 * `moveData` (the saved game analysis) is only used as a fallback for the
 * positions where no live engine lines have been computed yet.
 */
export function getBoardArrows(
  moveData: MoveAnalysisData | null,
  config: ArrowConfig,
  engineLines?: LineEval[] | null,
): BoardArrow[] {
  const arrows: BoardArrow[] = []

  // Sort by rank so the "best / second / third" mapping is stable even if the
  // engine returns the lines out of order.
  const ranked = [...(engineLines ?? [])]
    .filter(line => Array.isArray(line.pv) && line.pv.length > 0)
    .sort((a, b) => a.multiPv - b.multiPv)

  const useEngine = ranked.length > 0

  // Best move: first move of the first principal variation.
  const bestUci = useEngine ? ranked[0].pv[0] : moveData?.best_move_uci
  // Second / third: first move of the second / third principal variation.
  const secondUci = useEngine ? ranked[1]?.pv[0] : moveData?.second_move_uci
  const thirdUci = useEngine ? ranked[2]?.pv[0] : moveData?.third_move_uci
  // Threat: the opponent's best reply, i.e. the 2nd ply of the main variation.
  const threatUci = useEngine ? ranked[0].pv[1] : moveData?.pvs?.[0]?.[1]

  if (config.showBestMove && bestUci) {
    const { from, to } = uciToSquares(bestUci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.best })
  }
  if (config.showSecondBest && secondUci) {
    const { from, to } = uciToSquares(secondUci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.second })
  }
  if (config.showThirdBest && thirdUci) {
    const { from, to } = uciToSquares(thirdUci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.third })
  }
  if (config.showThreats && threatUci) {
    const { from, to } = uciToSquares(threatUci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.threat })
  }

  return arrows
}
