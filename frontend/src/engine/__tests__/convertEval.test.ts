import { describe, it, expect } from 'vitest'
import { positionEvalToMultiPvLines } from '../convertEval'
import type { PositionEval } from '../../types/eval'
import type { MultiPvLine } from '../../types/analysis'

describe('positionEvalToMultiPvLines', () => {
  it('converts a single line with CP evaluation', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
    const eval_: PositionEval = {
      lines: [
        { pv: ['e7e5', 'd2d4'], depth: 18, multiPv: 1, cp: 30 },
      ],
      bestMove: 'e7e5',
    }

    const result = positionEvalToMultiPvLines(fen, eval_)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<MultiPvLine>({
      rank: 1,
      san: 'e5',
      uci: 'e7e5',
      evaluation: 0.3,
      mate: null,
      depth: 18,
      pv: ['e7e5', 'd2d4'],
    })
  })

  it('converts a mate line', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const eval_: PositionEval = {
      lines: [
        { pv: ['e2e4'], depth: 12, multiPv: 1, mate: 3 },
      ],
    }

    const result = positionEvalToMultiPvLines(fen, eval_)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<MultiPvLine>({
      rank: 1,
      san: 'e4',
      uci: 'e2e4',
      evaluation: 10,
      mate: 3,
      depth: 12,
      pv: ['e2e4'],
    })
  })

  it('converts multiple lines (multi-PV)', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const eval_: PositionEval = {
      lines: [
        { pv: ['e2e4'], depth: 20, multiPv: 1, cp: 25 },
        { pv: ['d2d4'], depth: 18, multiPv: 2, cp: 18 },
        { pv: ['g1f3'], depth: 16, multiPv: 3, cp: 10 },
      ],
    }

    const result = positionEvalToMultiPvLines(fen, eval_)

    expect(result).toHaveLength(3)
    expect(result[0].rank).toBe(1)
    expect(result[0].san).toBe('e4')
    expect(result[0].evaluation).toBe(0.25)
    expect(result[1].rank).toBe(2)
    expect(result[1].san).toBe('d4')
    expect(result[1].evaluation).toBe(0.18)
    expect(result[2].rank).toBe(3)
    expect(result[2].san).toBe('Nf3')
    expect(result[2].evaluation).toBe(0.1)
  })

  it('handles empty PV', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const eval_: PositionEval = {
      lines: [
        { pv: [], depth: 10, multiPv: 1, cp: 42 },
      ],
    }

    const result = positionEvalToMultiPvLines(fen, eval_)

    expect(result).toHaveLength(1)
    expect(result[0].san).toBe('')
    expect(result[0].uci).toBe('')
  })

  it('handles empty lines array', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const eval_: PositionEval = { lines: [] }

    const result = positionEvalToMultiPvLines(fen, eval_)

    expect(result).toHaveLength(0)
  })
})
