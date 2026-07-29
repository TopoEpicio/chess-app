import { describe, it, expect } from 'vitest'
import { findOpeningByFen, searchOpenings, openings } from '../openings'
import { Chess } from 'chess.js'

describe('openings database', () => {
  it('finds opening by full FEN', () => {
    const game = new Chess()
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6']
    for (const m of moves) game.move(m)
    const fen = game.fen()

    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
    expect(result!.name).toContain('Italian')
  })

  it('returns undefined for unknown FEN', () => {
    const result = findOpeningByFen('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
    expect(result).toBeUndefined()
  })

  it('matches FEN including castling metadata', () => {
    const fen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'
    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
  })

  it('does not match positions with different castling rights', () => {
    const sameBoardNoCastling = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w - - 4 4'
    const result = findOpeningByFen(sameBoardNoCastling)
    expect(result).toBeUndefined()
  })

  it('searches openings by name (case-insensitive)', () => {
    const results = searchOpenings('sicilian')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(o => o.name.toLowerCase().includes('sicilian'))).toBe(true)
  })

  it('searches openings by variation name', () => {
    const results = searchOpenings('najdorf')
    expect(results.length).toBeGreaterThan(0)
  })

  it('returns all openings for empty query', () => {
    const results = searchOpenings('')
    expect(results.length).toBe(openings.length)
  })

  it('returns empty array for unmatched query', () => {
    const results = searchOpenings('zzzznotfound')
    expect(results).toEqual([])
  })

  it('each opening has required fields', () => {
    for (const opening of openings) {
      expect(opening.id).toBeDefined()
      expect(opening.name).toBeDefined()
      expect(opening.fen).toBeDefined()
      expect(Array.isArray(opening.variations)).toBe(true)
    }
  })

  it('variations have valid move sequences', () => {
    for (const opening of openings) {
      for (const variation of opening.variations) {
        expect(Array.isArray(variation.moves)).toBe(true)
        if (variation.moves.length === 0) continue
        expect(variation.fen).toBeDefined()
      }
    }
  })
})
