import { describe, it, expect } from 'vitest'
import { PositionEvaluator } from '../eval.ts'

describe('PositionEvaluator', () => {
  it('returns 0 for starting position', () => {
    expect(PositionEvaluator.evaluate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(0)
  })

  it('returns positive when white is up material (white has queen, black lost queen)', () => {
    const result = PositionEvaluator.evaluate('rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(result).toBeGreaterThan(0)
  })

  it('returns negative when black is up material (white lost queen, black has queen)', () => {
    const result = PositionEvaluator.evaluate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1')
    expect(result).toBeLessThan(0)
  })

  it('returns 0 when only kings remain', () => {
    expect(PositionEvaluator.evaluate('4k3/8/8/8/8/8/8/4K3 w - - 0 1')).toBe(0)
  })
})
