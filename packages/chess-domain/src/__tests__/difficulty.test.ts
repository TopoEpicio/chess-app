import { describe, it, expect } from 'vitest'
import { DifficultyCalculator } from '../difficulty.ts'

describe('DifficultyCalculator', () => {
  it('returns 6 for checkmate base difficulty', () => {
    expect(DifficultyCalculator.calculate('checkmate', 2, false)).toBe(6)
  })

  it('returns 3 for fork base difficulty', () => {
    expect(DifficultyCalculator.calculate('fork', 2, false)).toBe(3)
  })

  it('returns 5 for pin base difficulty', () => {
    expect(DifficultyCalculator.calculate('pin', 2, false)).toBe(5)
  })

  it('adds 1 when solution includes a capture', () => {
    const withCapture = DifficultyCalculator.calculate('fork', 2, true)
    const withoutCapture = DifficultyCalculator.calculate('fork', 2, false)
    expect(withCapture).toBe(withoutCapture + 1)
  })

  it('adds 2 when solution length is 4-5', () => {
    const short = DifficultyCalculator.calculate('fork', 2, false)
    const medium = DifficultyCalculator.calculate('fork', 4, false)
    expect(medium).toBe(short + 2)
  })

  it('adds 4 when solution length is 6+', () => {
    const base = DifficultyCalculator.calculate('hanging_piece', 1, false)
    const long = DifficultyCalculator.calculate('hanging_piece', 6, false)
    expect(long).toBe(base + 4)
  })

  it('clamps to 1-10 range', () => {
    expect(DifficultyCalculator.calculate('hanging_piece', 1, false)).toBeGreaterThanOrEqual(1)
    expect(DifficultyCalculator.calculate('checkmate', 10, true)).toBeLessThanOrEqual(10)
  })

  it('uses default difficulty 3 for unknown themes', () => {
    const result = DifficultyCalculator.calculate('unknown_theme', 2, false)
    expect(result).toBe(3)
  })
})
