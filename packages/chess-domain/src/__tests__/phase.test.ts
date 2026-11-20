import { describe, it, expect } from 'vitest'
import { PhaseDetector } from '../phase.ts'

describe('PhaseDetector', () => {
  it('detects opening for move number <= 12', () => {
    expect(PhaseDetector.detect('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 8)).toBe('opening')
  })

  it('detects endgame when non-pawn pieces <= 7 per side', () => {
    expect(PhaseDetector.detect('4k3/8/8/8/8/8/8/4K3 w - - 0 1', 30)).toBe('endgame')
  })

  it('detects middlegame for positions between opening and endgame', () => {
    expect(PhaseDetector.detect('r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3', 15)).toBe('middlegame')
  })
})
