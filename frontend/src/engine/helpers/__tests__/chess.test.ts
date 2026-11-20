import { describe, it, expect } from 'vitest'
import { uciMoveParams, getMaterialDifference, formatUciPv } from '../chess'

describe('uciMoveParams', () => {
  it('parses regular move', () => {
    const result = uciMoveParams('e2e4')
    expect(result).toEqual({ from: 'e2', to: 'e4', promotion: undefined })
  })

  it('parses promotion move', () => {
    const result = uciMoveParams('e7e8q')
    expect(result).toEqual({ from: 'e7', to: 'e8', promotion: 'q' })
  })
})

describe('getMaterialDifference', () => {
  it('returns 0 for starting position', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    expect(getMaterialDifference(fen)).toBe(0)
  })

  it('returns positive when white has extra material', () => {
    // White has king+queen (e1, e2), black only king (e8)
    const fen = '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1'
    expect(getMaterialDifference(fen)).toBe(9)
  })

  it('returns negative when black has extra material', () => {
    // Black has king+rook (e8, h8), white only king (e1)
    const fen = '4k2r/8/8/8/8/8/8/4K3 w - - 0 1'
    expect(getMaterialDifference(fen)).toBe(-5)
  })
})

describe('formatUciPv', () => {
  it('returns UCI moves unchanged for non-castle positions', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    expect(formatUciPv(fen, ['e2e4', 'e7e5'])).toEqual(['e2e4', 'e7e5'])
  })

  it('converts e1h1 to e1g1 when white can castle kingside', () => {
    const fen = '4k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
    expect(formatUciPv(fen, ['e1h1'])).toEqual(['e1g1'])
  })

  it('converts e1a1 to e1c1 when white can castle queenside', () => {
    const fen = '4k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
    expect(formatUciPv(fen, ['e1a1'])).toEqual(['e1c1'])
  })

  it('converts e8h8 to e8g8 when black can castle kingside', () => {
    const fen = '4k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
    expect(formatUciPv(fen, ['e8h8'])).toEqual(['e8g8'])
  })

  it('converts e8a8 to e8c8 when black can castle queenside', () => {
    const fen = '4k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
    expect(formatUciPv(fen, ['e8a8'])).toEqual(['e8c8'])
  })
})
