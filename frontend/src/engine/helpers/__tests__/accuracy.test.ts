import { describe, it, expect } from 'vitest'
import { computeAccuracy } from '../accuracy'
import type { PositionEval } from '../../../types/eval'

const pos = (cp: number): PositionEval => ({
  lines: [{ pv: [], depth: 18, multiPv: 1, cp }],
})

describe('computeAccuracy', () => {
  it('returns 100 for both players when all moves are perfect (cp=0)', () => {
    const positions = [pos(0), pos(0), pos(0), pos(0), pos(0)]
    const acc = computeAccuracy(positions)
    expect(acc.white).toBeGreaterThan(99)
    expect(acc.black).toBeGreaterThan(99)
  })

  it('returns lower accuracy for player who blunders', () => {
    // Black plays perfectly, White blunders at position 3 (cp drops from 0 to -300)
    const positions = [
      pos(0),    // start
      pos(0),    // white moves: 50%
      pos(0),    // black moves: 50%
      pos(-300), // white blunders: ~25%
      pos(-300), // black moves: ~25%
    ]
    const acc = computeAccuracy(positions)
    expect(acc.black).toBeGreaterThan(acc.white)
    expect(acc.black).toBeGreaterThan(90)
  })

  it('handles 2-position edge case', () => {
    const acc = computeAccuracy([pos(0), pos(50)])
    expect(acc.white).toBeGreaterThan(0)
    expect(acc.white).toBeLessThanOrEqual(100)
  })

  it('clamps accuracy to [0, 100]', () => {
    const positions = [
      pos(0),    // 50%
      pos(-500), // ~15%
      pos(-500),
    ]
    const acc = computeAccuracy(positions)
    expect(acc.white).toBeGreaterThanOrEqual(0)
    expect(acc.white).toBeLessThanOrEqual(100)
  })
})
