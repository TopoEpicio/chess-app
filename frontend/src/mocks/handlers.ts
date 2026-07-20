import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

// Mock data
const mockPuzzles = [
  {
    id: 1,
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3',
    solution: ['g1f3'],
    theme: ['opening'],
    difficulty: 3,
    source: 'test',
    phase: 'opening',
    user_id: 1,
    created_at: new Date().toISOString(),
    attempt_count: 0,
    success_count: 0,
  },
  {
    id: 2,
    fen: '8/8/8/8/8/8/8/8 w - - 0 1',
    solution: ['e2e4'],
    theme: ['tactics'],
    difficulty: 5,
    source: 'manual',
    phase: 'middlegame',
    user_id: 1,
    created_at: new Date().toISOString(),
    attempt_count: 10,
    success_count: 7,
  },
]

const mockRepertoire = {
  id: 1,
  name: 'Test Repertoire',
  color: 'white',
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moves: [],
  comment: null,
  order: 0,
  user_id: 1,
  created_at: new Date().toISOString(),
  children: [],
}

const mockAnalysis = {
  id: 1,
  user_id: 1,
  white: 'Test White',
  black: 'Test Black',
  eco: 'B20',
  event_date: '2024-01-01',
  opening_name: 'Sicilian Defense',
  pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
  engine_depth: 18,
  multipv: 3,
  status: 'completed',
  total_moves: 20,
  inaccuracies: 2,
  mistakes: 1,
  blunders: 0,
  created_at: new Date().toISOString(),
}

const mockKeyMoments = [
  {
    id: 1,
    analysis_id: 1,
    move_number: 5,
    fen_before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fen_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    classification: 'inaccuracy',
    eval_before: 20,
    eval_after: 15,
    best_move: 'e7e5',
    played_move: 'e7e6',
    explanation: 'Playing e6 instead of e5 allows White to gain space.',
  },
]

const mockStats = {
  total_puzzles: 100,
  total_correct: 75,
  accuracy: 0.75,
  total_repertoire_nodes: 50,
  total_games: 10,
  current_streak: 5,
  longest_streak: 12,
  rating_estimate: 1800,
}

const mockDailyStats = [
  {
    id: 1,
    user_id: 1,
    stat_date: '2024-01-15',
    puzzles_solved: 10,
    puzzles_correct: 8,
    repertoire_reviewed: 5,
    repertoire_accuracy: 0.8,
    games_analyzed: 1,
    streak_days: 5,
    created_at: new Date().toISOString(),
  },
]

// Handlers
export const handlers = [
  // Health
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', version: '0.1.0' })
  }),
  http.get('/api/ready', () => {
    return HttpResponse.json({
      status: 'ready',
      checks: { database: 'ok', redis: 'ok' },
      version: '0.1.0',
    })
  }),
  http.get('/api/health/deep', () => {
    return HttpResponse.json({
      status: 'ok',
      checks: {
        database: { status: 'ok', latency_ms: 1 },
        tables: { status: 'ok', missing: [] },
      },
      version: '0.1.0',
    })
  }),

  // Puzzles
  http.get('/api/puzzles', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '20')
    const theme = url.searchParams.get('theme')
    const difficulty = url.searchParams.get('difficulty')

    let filtered = [...mockPuzzles]
    if (theme) filtered = filtered.filter((p) => p.theme.includes(theme))
    if (difficulty) filtered = filtered.filter((p) => p.difficulty === parseInt(difficulty))

    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      items,
      total: filtered.length,
      page,
      page_size: pageSize,
      pages: Math.ceil(filtered.length / pageSize),
    })
  }),

  http.get('/api/puzzles/:id', ({ params }) => {
    const puzzle = mockPuzzles.find((p) => p.id === parseInt(params.id as string))
    if (!puzzle) {
      return HttpResponse.json(
        { error: { type: 'about:blank', title: 'Not Found', status: 404, detail: 'Puzzle not found', instance: '/api/puzzles/999', error_code: 'NOT_FOUND', correlation_id: 'test' } },
        { status: 404 }
      )
    }
    return HttpResponse.json(puzzle)
  }),

  http.post('/api/puzzles', async ({ request }) => {
    const body = await request.json()
    const newPuzzle = {
      id: mockPuzzles.length + 1,
      ...body,
      user_id: 1,
      created_at: new Date().toISOString(),
      attempt_count: 0,
      success_count: 0,
    }
    mockPuzzles.push(newPuzzle)
    return HttpResponse.json(newPuzzle, { status: 201 })
  }),

  http.get('/api/puzzles/stats/summary', () => {
    return HttpResponse.json({
      by_theme: { opening: 5, tactics: 3, endgame: 2 },
      by_difficulty: { 1: 2, 2: 3, 3: 5, 4: 2, 5: 3 },
      by_phase: { opening: 4, middlegame: 4, endgame: 2 },
      recent_accuracy: 0.8,
    })
  }),

  // Repertoire
  http.get('/api/repertoire', ({ request }) => {
    const url = new URL(request.url)
    const color = url.searchParams.get('color')
    let filtered = [mockRepertoire]
    if (color) filtered = filtered.filter((r) => r.color === color)

    return HttpResponse.json(filtered)
  }),

  http.get('/api/repertoire/:id/tree', ({ params }) => {
    const repertoire = { ...mockRepertoire, id: parseInt(params.id as string) }
    return HttpResponse.json(repertoire)
  }),

  http.post('/api/repertoire', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 2, ...body, user_id: 1, created_at: new Date().toISOString() },
      { status: 201 }
    )
  }),

  // Analysis
  http.get('/api/analysis', () => {
    return HttpResponse.json([mockAnalysis])
  }),

  http.get('/api/analysis/:id', ({ params }) => {
    return HttpResponse.json({ ...mockAnalysis, id: parseInt(params.id as string) })
  }),

  http.get('/api/analysis/:id/key-moments', ({ params }) => {
    return HttpResponse.json(mockKeyMoments)
  }),

  http.post('/api/analysis', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 2, ...body, user_id: 1, status: 'pending', created_at: new Date().toISOString() },
      { status: 201 }
    )
  }),

  // Stats
  http.get('/api/stats/summary', () => {
    return HttpResponse.json(mockStats)
  }),

  http.get('/api/stats/daily', ({ request }) => {
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    return HttpResponse.json(mockDailyStats.slice(0, days))
  }),

  http.get('/api/stats/streak', () => {
    return HttpResponse.json({ current: 5, longest: 12, history: [] })
  }),

  // Openings
  http.get('/api/openings', () => {
    return HttpResponse.json([
      { id: 1, name: 'Sicilian Defense', eco_code: 'B20', moves: ['e2e4', 'c7c5'], description: '' },
      { id: 2, name: 'French Defense', eco_code: 'C00', moves: ['e2e4', 'e7e6'], description: '' },
    ])
  }),

  // Import
  http.post('/api/import/pgn', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      games_imported: 1,
      errors: [],
    })
  }),

  // Study
  http.get('/api/study/folders', () => {
    return HttpResponse.json([
      { id: 1, name: 'Le mie aperture', description: 'Aperture importate in precedenza', parent_id: null, color: '#22c55e', icon: 'folder', user_id: 1, created_at: new Date().toISOString(), children_count: 0, resources_count: 0, children: [] },
    ])
  }),

  http.get('/api/study/resources', () => {
    return HttpResponse.json([
      { id: 1, type: 'opening', name: 'Sicilian Defense', description: '', url: null, file_path: null, pgn_content: null, opening_id: 1, user_id: 1, created_at: new Date().toISOString(), file_size: null, mime_type: null },
    ])
  }),
]

// Worker for browser
export const worker = setupWorker(...handlers)