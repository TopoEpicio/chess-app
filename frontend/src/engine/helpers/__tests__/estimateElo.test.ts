import { describe, it, expect } from 'vitest'
import { computeEstimatedElo } from '../estimateElo'
import type { PositionEval } from '../../../types/eval'

const pos = (cp: number): PositionEval => ({
  lines: [{ pv: [], depth: 18, multiPv: 1, cp }],
})

describe('computeEstimatedElo', () => {
  it('returns undefined with fewer than 2 positions', () => {
    expect(computeEstimatedElo([pos(0)])).toBeUndefined()
  })

  it('returns 3100 for perfect play (no CPL)', () => {
    const positions = [pos(0), pos(0), pos(0), pos(0), pos(0)]
    const elo = computeEstimatedElo(positions)
    expect(elo!.white).toBeGreaterThan(3000)
    expect(elo!.black).toBeGreaterThan(3000)
  })

  it('returns lower ELO for player who blunders', () => {
    // Black plays perfectly, White blunders
    const positions = [
      pos(0),    // start
      pos(0),    // after white's move: 50%
      pos(0),    // after black's move: 50%
      pos(-300), // after white's blunder: ~25%
      pos(-300), // after black's move: ~25%
    ]
    const elo = computeEstimatedElo(positions)
    expect(elo!.white).toBeLessThan(elo!.black)
  })

  it('adjusts estimate when actual rating is provided', () => {
    const positions = [pos(0), pos(0), pos(0), pos(0)]
    const withRating = computeEstimatedElo(positions, 1500, 1500)
    const withoutRating = computeEstimatedElo(positions)
    expect(withRating).toBeDefined()
    expect(withoutRating).toBeDefined()
  })

  it('caps CPL at 1000 per move', () => {
    const positions = [pos(0), pos(-2000), pos(-2000)]
    const elo = computeEstimatedElo(positions)
    expect(elo!.white).toBeGreaterThan(0)
  })
})
