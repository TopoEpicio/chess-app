import { describe, it, expect } from 'vitest'
import {
  findOpeningByFen,
  findOpeningVariation,
  findOpeningByMoves,
  searchOpenings,
  openings,
} from '../openings'
import { Chess } from 'chess.js'

describe('openings database', () => {
  it('finds opening by FEN', () => {
    const game = new Chess()
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6']
    for (const m of moves) game.move(m)
    const fen = game.fen().split(' ')[0]

    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
    expect(result!.name).toContain('Italian')
  })

  it('finds opening from an intermediate position (1.e4 e5 2.Nf3 Nc6 3.Bc4)', () => {
    const game = new Chess()
    for (const m of ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']) game.move(m)
    const result = findOpeningByFen(game.fen().split(' ')[0])
    expect(result).toBeDefined()
    expect(result!.name).toContain('Italian')
  })

  it('finds opening and variation from an intermediate position', () => {
    const game = new Chess()
    for (const m of ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']) game.move(m)
    const result = findOpeningVariation(game.fen().split(' ')[0])
    expect(result).toBeDefined()
    expect(result!.opening.name).toContain('Italian')
  })

  it('finds an opening after just 1.e4', () => {
    const game = new Chess()
    game.move('e4')
    const fen = game.fen().split(' ')[0]
    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
    const variation = findOpeningVariation(fen)
    expect(variation).toBeDefined()
    expect(['e4', 'e2e4']).toContain(variation!.variation.moves[0])
  })

  it('returns undefined for unknown FEN', () => {
    const result = findOpeningByFen('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
    expect(result).toBeUndefined()
  })

  it('matches board-only FEN (ignoring metadata)', () => {
    const fen = openings[0].fen
    const result = findOpeningByFen(fen)
    expect(result).toBeDefined()
  })

  it('searches openings by name (case-insensitive)', () => {
    const results = searchOpenings('sicilian')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((o) => o.name.toLowerCase().includes('sicilian'))).toBe(true)
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
        expect(variation.moves.length).toBeGreaterThan(0)
        expect(variation.fen).toBeDefined()
      }
    }
  })
})

describe('findOpeningByMoves', () => {
  it('resolves a known line to its opening with the correct ply', () => {
    const result = findOpeningByMoves(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'])
    expect(result).toBeDefined()
    expect(result!.opening.name).toContain('Italian')
    expect(result!.ply).toBe(5)
  })

  it('resolves a single opening move (1.e4) with ply 1', () => {
    const result = findOpeningByMoves(['e4'])
    expect(result).toBeDefined()
    expect(result!.ply).toBe(1)
  })

  it('returns undefined for an empty move list', () => {
    expect(findOpeningByMoves([])).toBeUndefined()
  })

  it('returns undefined for a non-opening sequence', () => {
    // Every legal first move is present in the dataset, so the only way to get
    // no match is a sequence that cannot begin a real game (an illegal first
    // move). 'e5' is a black move and is not a key at the trie root.
    const result = findOpeningByMoves(['e5', 'd5', 'f5'])
    expect(result).toBeUndefined()
  })

  it('prefers the deepest matching node (longer prefix => deeper ply)', () => {
    const longVariation = openings
      .flatMap((o) => o.variations)
      .find((v) => v.moves.length >= 10)
    expect(longVariation).toBeDefined()

    const shortResult = findOpeningByMoves(longVariation!.moves.slice(0, 4))
    const longResult = findOpeningByMoves(longVariation!.moves.slice(0, 10))

    expect(shortResult).toBeDefined()
    expect(longResult).toBeDefined()
    expect(shortResult!.ply).toBe(4)
    expect(longResult!.ply).toBe(10)
    expect(longResult!.ply).toBeGreaterThan(shortResult!.ply)
  })
})
