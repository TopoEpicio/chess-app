import { describe, it, expect } from 'vitest'
import { getMovesClassification, MoveClassification } from '../moveClassification'
import type { PositionEval } from '../../../types/eval'

const pos2 = (overrides: Partial<PositionEval> & { lines: PositionEval['lines'] }): PositionEval => ({
  lines: [
    { pv: ['e2e4'], depth: 18, multiPv: 1, cp: 20 },
    { pv: ['d2d4'], depth: 18, multiPv: 2, cp: 10 },
  ],
  ...overrides,
})

const fenStart = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const fenAfterE4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'

describe('getMovesClassification', () => {
  it('classifies first position as-is (no previous move)', () => {
    const positions: PositionEval[] = [
      { lines: [{ pv: ['e2e4'], depth: 18, multiPv: 1, cp: 20 }] },
    ]
    const result = getMovesClassification(positions, [], [fenStart])
    expect(result).toHaveLength(1)
    expect(result[0].moveClassification).toBeUndefined()
  })

  it('classifies as Best when played move equals best move', () => {
    const positions: PositionEval[] = [
      pos2({ bestMove: 'e2e4' }),
      { lines: [{ pv: ['e7e5'], depth: 18, multiPv: 1, cp: 10 }] },
    ]
    const result = getMovesClassification(
      positions,
      ['e2e4'],
      [fenStart, fenAfterE4],
    )
    expect(result[1].moveClassification).toBe(MoveClassification.Best)
  })

  it('classifies as Excellent when win% drop is small (<= 2%)', () => {
    // cp 54 → ~59.9% win prob, cp 49 → ~59.0% win prob, diff < 2% → Excellent
    const positions: PositionEval[] = [
      pos2({ bestMove: 'e2e4' }),
      { lines: [{ pv: ['e7e5'], depth: 18, multiPv: 1, cp: 49 }] },
    ]
    const result = getMovesClassification(
      positions,
      ['d2d4'],
      [fenStart, fenAfterE4],
    )
    expect(result[1].moveClassification).toBe(MoveClassification.Excellent)
  })

  it('classifies as Blunder when win% drops by > 20%', () => {
    // cp 500 → ~98.2%, cp -300 → ~25.0%, diff > 20% → Blunder
    const positions: PositionEval[] = [
      pos2({ bestMove: 'e2e4' }),
      { lines: [{ pv: ['e7e5'], depth: 18, multiPv: 1, cp: -300 }] },
    ]
    const result = getMovesClassification(
      positions,
      ['d2d4'],
      [fenStart, fenAfterE4],
    )
    expect(result[1].moveClassification).toBe(MoveClassification.Blunder)
  })

  it('classifies as Forced when previous position has only 1 line', () => {
    const positions: PositionEval[] = [
      { lines: [{ pv: ['e2e4'], depth: 18, multiPv: 1, cp: 20 }] },
      { lines: [{ pv: ['e7e5'], depth: 18, multiPv: 1, cp: 15 }] },
    ]
    const result = getMovesClassification(
      positions,
      ['e7e5'],
      [fenAfterE4, 'rnbqkbnr/pppppppp/8/8/4P3/4p3/PPPP1PPP/RNBQKBNR w KQkq - 0 1'],
    )
    expect(result[1].moveClassification).toBe(MoveClassification.Forced)
  })

  it('classifies as Inaccuracy when win% drops between 5-10%', () => {
    // cp 300 → ~89.5%, cp 50 → ~54.6%, diff ~35% but from black perspective
    const positions: PositionEval[] = [
      pos2({ bestMove: 'd2d4' }),
      { lines: [{ pv: ['e7e5'], depth: 18, multiPv: 1, cp: 30 }] },
    ]
    const result = getMovesClassification(
      positions,
      ['e7e5'],
      [
        fenStart,
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 3',
      ],
    )
    expect(result[1].moveClassification).toBe(MoveClassification.Excellent)
  })
})
