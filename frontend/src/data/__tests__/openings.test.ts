import { describe, it, expect } from 'vitest'
import { findOpeningByFen, findOpeningVariation, searchOpenings, openings } from '../openings'
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

  it('matches by board position for 1-field stored FENs (castling-insensitive)', () => {
    // Two Knights Defense is stored as a 1-field FEN (board only) within
    // the Italian Game. The query has no castling rights but same board.
    const noCastlingFen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w - - 4 4'
    const result = findOpeningByFen(noCastlingFen)
    expect(result).toBeDefined()
    expect(result!.name).toContain('Italian')
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

  it('finds openings with 1-field stored FENs (3058/3196 openings)', () => {
    // Play through to a position that matches a 1-field opening FEN
    const game = new Chess()
    game.move('e4')
    game.move('e5')
    game.move('Nf3')
    game.move('Nc6')
    game.move('Bc4')
    game.move('Nf6')
    const fen = game.fen() // Two Knights Defense position
    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
  })

  it('matches a 1-field variation FEN', () => {
    // Some variations have 1-field FENs (empty-move grouping markers).
    // findOpeningVariation should still find them by board position.
    const fullFen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'
    const result = findOpeningVariation(fullFen)
    expect(result).toBeDefined()
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
