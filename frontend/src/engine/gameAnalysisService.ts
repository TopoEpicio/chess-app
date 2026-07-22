import { Chess } from 'chess.js'
import type { MultiPvLine, MoveAnalysisData, MoveClassification } from '../types/analysis'
import type { MoveItem } from './useMoveNavigation'

export interface AnalysisProgress {
  currentMove: number
  totalMoves: number
  phase: 'analyzing' | 'calculating' | 'done'
}

function evalToWinProbability(evalInPawns: number): number {
  return 1 / (1 + Math.pow(10, -evalInPawns / 4))
}

function classifyMove(
  evalSwingPawns: number,
  isBestMove: boolean,
  isTactical: boolean,
): MoveClassification {
  if (isBestMove && isTactical && evalSwingPawns < 0.3) return 'brilliant'
  if (isBestMove) return 'best'
  if (evalSwingPawns < 0.50) return 'excellent'
  if (evalSwingPawns < 1.00) return 'good'
  if (evalSwingPawns < 3.00) return 'inaccuracy'
  if (evalSwingPawns < 5.00) return 'mistake'
  return 'blunder'
}

export async function analyzeGameMoves(
  moves: MoveItem[],
  deepAnalyzeFn: (fen: string, pvCount?: number) => Promise<MultiPvLine[]>,
  onProgress: (progress: AnalysisProgress) => void,
): Promise<MoveAnalysisData[]> {
  const results: MoveAnalysisData[] = []

  for (let i = 0; i < moves.length; i++) {
    onProgress({ currentMove: i + 1, totalMoves: moves.length, phase: 'analyzing' })

    const move = moves[i]
    const gameBefore = new Chess()

    for (let j = 0; j < i; j++) {
      try { gameBefore.move(moves[j].san) } catch { break }
    }

    const fenBefore = gameBefore.fen()
    const multiPv = await deepAnalyzeFn(fenBefore, 3)

    const best = multiPv[0]
    if (!best) {
      onProgress({ currentMove: i + 1, totalMoves: moves.length, phase: 'analyzing' })
      continue
    }
    const second = multiPv.length > 1 ? multiPv[1] : null
    const third = multiPv.length > 2 ? multiPv[2] : null

    const playedGame = new Chess(fenBefore)
    try {
      playedGame.move(move.san)
    } catch { break }

    const fenAfter = playedGame.fen()

    const afterMultiPv = await deepAnalyzeFn(fenAfter, 1)
    const afterBest = afterMultiPv[0]
    if (!afterBest) {
      onProgress({ currentMove: i + 1, totalMoves: moves.length, phase: 'analyzing' })
      continue
    }
    const playedEval = afterBest.evaluation

    const bestEval = best.evaluation
    const isWhite = move.is_white
    let evalSwing = isWhite
      ? bestEval - playedEval
      : playedEval - bestEval
    evalSwing = Math.max(0, evalSwing)

    const wpBefore = evalToWinProbability(bestEval)
    const wpAfter = evalToWinProbability(playedEval)
    const wpBest = evalToWinProbability(bestEval)
    const wpLoss = Math.max(0, wpBest - wpAfter)

    const san = move.san
    const isBest = san === best.san
    const isTactical = san.includes('x') || san.includes('+') || san.includes('#') || san.includes('=')
    const classification = classifyMove(evalSwing, isBest, isTactical)

    results.push({
      move_number: move.move_number,
      is_white: isWhite,
      san,
      fen_before: fenBefore,
      fen_after: fenAfter,
      played_eval: playedEval,
      best_eval: bestEval,
      best_move_san: best.san,
      best_move_uci: best.uci,
      second_move_uci: second?.uci ?? null,
      second_move_eval: second?.evaluation ?? null,
      third_move_uci: third?.uci ?? null,
      third_move_eval: third?.evaluation ?? null,
      depth: best.depth,
      eval_swing: evalSwing,
      classification,
      pvs: multiPv.map(m => m.pv),
      wp_before: wpBefore,
      wp_after: wpAfter,
      wp_best: wpBest,
      wp_loss: wpLoss,
    })
  }

  onProgress({ currentMove: moves.length, totalMoves: moves.length, phase: 'done' })
  return results
}

export function calculateAccuracy(moves: MoveAnalysisData[]): {
  whiteAccuracy: number
  blackAccuracy: number
  whiteCpl: number
  blackCpl: number
} {
  const forWhite = moves.filter(m => m.is_white)
  const forBlack = moves.filter(m => !m.is_white)

  const calc = (playerMoves: MoveAnalysisData[]) => {
    if (playerMoves.length === 0) return { accuracy: 0, cpl: 0 }
    let totalWeight = 0
    let weightedAcc = 0
    let totalCpLoss = 0
    for (const m of playerMoves) {
      const criticality = Math.abs((m.wp_best ?? 0.5) - 0.5) * 2 + 1
      const perAcc = Math.max(0, 100 - (m.wp_loss ?? 0) * 100)
      weightedAcc += perAcc * criticality
      totalWeight += criticality
      totalCpLoss += m.eval_swing * 100
    }
    return {
      accuracy: totalWeight > 0 ? Math.round(weightedAcc / totalWeight) : 0,
      cpl: Math.round(totalCpLoss / playerMoves.length),
    }
  }

  const w = calc(forWhite)
  const b = calc(forBlack)
  return {
    whiteAccuracy: w.accuracy,
    blackAccuracy: b.accuracy,
    whiteCpl: w.cpl,
    blackCpl: b.cpl,
  }
}

export function countClassifications(moves: MoveAnalysisData[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const m of moves) {
    counts[m.classification] = (counts[m.classification] ?? 0) + 1
  }
  return counts
}