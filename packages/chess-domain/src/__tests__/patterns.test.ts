import { describe, it, expect } from 'vitest'
import { PatternDetector } from '../patterns.ts'

describe('PatternDetector', () => {
  it('detects checkmate', () => {
    const result = PatternDetector.detect(
      'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
      '',
    )
    expect(result).toEqual(['checkmate'])
  })

  it('detects fork when a knight attacks two enemy pieces', () => {
    const result = PatternDetector.detect(
      '4k3/2q1q3/8/3N4/8/8/4P3/4K3 w - - 0 1',
      '',
    )
    expect(result).toContain('fork')
  })

  it('detects hanging piece when an enemy piece has no defenders', () => {
    const result = PatternDetector.detect(
      '4k3/8/8/8/4q3/8/8/4RK2 w - - 0 1',
      '',
    )
    expect(result).toContain('hanging_piece')
  })

  it('returns empty array for opening position with no tactic', () => {
    const result = PatternDetector.detect(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      '',
    )
    expect(result).toEqual([])
  })

  it('returns empty array when only kings remain', () => {
    const result = PatternDetector.detect(
      '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
      '',
    )
    expect(result).toEqual([])
  })
})
