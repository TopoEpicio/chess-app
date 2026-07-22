import { describe, it, expect } from 'vitest'
import { MockApiClient } from '../mock-client.ts'
import type { Puzzle } from '../../types'

const defaultSettings = {
  i18n: { default_locale: 'en', supported_locales: ['en', 'it'] },
  theme: { default_theme: 'auto', default_board_theme: 'default' },
  board: { square_opacity: 1.0, piece_shadow: true },
}

describe('MockApiClient', () => {
  it('settings returns default settings structure', async () => {
    const client = new MockApiClient()
    const result = await client.settings()
    expect(result).toEqual(defaultSettings)
  })

  it('settings returns configured settings', async () => {
    const client = new MockApiClient()
    client.setSettings({
      i18n: { default_locale: 'it', supported_locales: ['it', 'en'] },
      theme: { default_theme: 'dark', default_board_theme: 'blue' },
      board: { square_opacity: 0.8, piece_shadow: false },
    })
    const result = await client.settings()
    expect(result.i18n.default_locale).toBe('it')
    expect(result.theme.default_theme).toBe('dark')
    expect(result.board.square_opacity).toBe(0.8)
  })
  it('health returns ok', async () => {
    const client = new MockApiClient()
    const result = await client.health()
    expect(result).toEqual({ status: 'ok' })
  })

  it('puzzles.list returns configured puzzles', async () => {
    const client = new MockApiClient()
    const puzzles: Puzzle[] = [
      { id: '1', userId: '1', fen: 'test', solution: ['e4'], theme: 'fork', difficulty: 3, source: 'auto', sourceGameId: null, phase: 'opening', createdAt: '' },
    ]
    client.setPuzzles(puzzles)

    const result = await client.puzzles.list()
    expect(result).toEqual(puzzles)
  })

  it('puzzles.get throws for missing puzzle', async () => {
    const client = new MockApiClient()
    await expect(client.puzzles.get(999)).rejects.toThrow('404')
  })

  it('puzzles.categoryStats counts configured puzzles', async () => {
    const client = new MockApiClient()
    client.setPuzzles([
      { id: '1', userId: '1', fen: 'a', solution: ['e4'], theme: 'fork', difficulty: 3, source: 'auto', sourceGameId: null, phase: 'opening', createdAt: '' },
      { id: '2', userId: '1', fen: 'b', solution: ['d4'], theme: 'pin', difficulty: 5, source: 'auto', sourceGameId: null, phase: 'middlegame', createdAt: '' },
    ])

    const result = await client.puzzles.categoryStats()
    expect(result.mix.total).toBe(2)
  })

  it('repertoire.getTree returns configured nodes', async () => {
    const client = new MockApiClient()
    client.setRepertoire([
      { id: '1', repertoireId: '1', parentId: null, fen: 'start', moveSan: '', annotation: '', colorCode: 'green', depth: 0, ecoCode: null, createdAt: '' },
    ])

    const result = await client.repertoire.getTree(1)
    expect(result).toHaveLength(1)
  })

  it('openings.list returns configured openings', async () => {
    const client = new MockApiClient()
    client.setOpenings([
      { id: '1', name: 'Italian', side: 'white', startingFen: 'start', startingNodeId: null, ecoCode: 'C50', colorCode: 'green', nodeCount: 10, createdAt: '' },
    ])

    const result = await client.openings.list()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Italian')
  })

  it('stats.get returns configured stats', async () => {
    const client = new MockApiClient()
    client.setStats({ date: '2024-01-01', puzzlesSolved: 5, puzzlesCorrect: 3, repertoireReviewed: 2, repertoireAccuracy: 80, gamesAnalyzed: 1, streakDays: 3 })

    const result = await client.stats.get()
    expect(result).not.toBeNull()
    expect(result!.puzzlesSolved).toBe(5)
  })

  it('stats.get returns null when no stats configured', async () => {
    const client = new MockApiClient()
    const result = await client.stats.get()
    expect(result).toBeNull()
  })
})
