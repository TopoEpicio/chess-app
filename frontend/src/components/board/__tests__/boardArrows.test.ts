import { describe, it, expect } from 'vitest'
import { getBoardArrows } from '../boardArrows'
import type { MoveAnalysisData, ArrowConfig } from '../../../types/analysis'

const ALL_ON: ArrowConfig = {
  showBestMove: true,
  showSecondBest: true,
  showThirdBest: true,
  showThreats: true,
}

const ALL_OFF: ArrowConfig = {
  showBestMove: false,
  showSecondBest: false,
  showThirdBest: false,
  showThreats: false,
}

const sampleMove: MoveAnalysisData = {
  move_number: 1,
  is_white: true,
  san: 'e4',
  fen_before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  fen_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  played_eval: 0.2,
  best_eval: 0.22,
  best_move_san: 'e4',
  best_move_uci: 'e2e4',
  second_move_uci: 'd2d4',
  second_move_eval: 0.18,
  third_move_uci: 'c2c4',
  third_move_eval: 0.15,
  depth: 22,
  eval_swing: 0.02,
  classification: 'best',
  pvs: [['e2e4', 'e7e5', 'd2d4']],
  wp_before: 0.5,
  wp_after: 0.52,
  wp_best: 0.52,
  wp_loss: 0,
}

const sampleMoveNoThreat: MoveAnalysisData = {
  ...sampleMove,
  pvs: [['e2e4']],
}

describe('getBoardArrows', () => {
  it('returns empty array when moveData is null', () => {
    expect(getBoardArrows(null, ALL_ON)).toEqual([])
  })

  it('returns empty array when all flags are off', () => {
    expect(getBoardArrows(sampleMove, ALL_OFF)).toEqual([])
  })

  it('returns best move arrow (green) when flag is on', () => {
    const result = getBoardArrows(sampleMove, { showBestMove: true, showSecondBest: false, showThreats: false, showThirdBest: false })
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ startSquare: 'e2', endSquare: 'e4', color: '#008000' })
  })

  it('includes best + second + third arrows when flags on', () => {
    const result = getBoardArrows(sampleMove, ALL_ON)
    expect(result).toHaveLength(4)
    expect(result[0].color).toBe('#008000')
    expect(result[1].color).toBe('#0044ff')
    expect(result[2].color).toBe('#8800cc')
    expect(result[3].color).toBe('#ff0000')
  })

  it('includes threat only when pvs has 3+ moves', () => {
    const withThreat = getBoardArrows(sampleMove, { showBestMove: false, showSecondBest: false, showThirdBest: false, showThreats: true })
    expect(withThreat).toHaveLength(1)
    expect(withThreat[0].color).toBe('#ff0000')

    expect(getBoardArrows(sampleMoveNoThreat, ALL_ON)).toHaveLength(3)
  })

  it('handles promotion UCI (5 chars)', () => {
    const promo = { ...sampleMove, best_move_uci: 'e7e8q' }
    const result = getBoardArrows(promo, { showBestMove: true, showSecondBest: false, showThirdBest: false, showThreats: false })
    expect(result[0]).toEqual({ startSquare: 'e7', endSquare: 'e8', color: '#008000' })
  })

  it('ignores second/third when uci is null', () => {
    const moveNoSecond = { ...sampleMove, second_move_uci: null, third_move_uci: null }
    const result = getBoardArrows(moveNoSecond, { showBestMove: false, showSecondBest: true, showThirdBest: true, showThreats: false })
    expect(result).toHaveLength(0)
  })
})
