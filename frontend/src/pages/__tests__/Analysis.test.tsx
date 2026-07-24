import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Analysis } from '../Analysis'

vi.mock('../../components/board/ChessBoard', () => ({
  ChessBoard: () => <div data-testid="chessboard">Board</div>,
}))

vi.mock('../../components/analysis/ProgressBar', () => ({
  ProgressBar: ({ progress }: { progress: number }) => <div data-testid="progress-bar">{progress}%</div>,
}))

vi.mock('../../components/analysis/TabNav', () => ({
  TabNav: ({ selected }: { selected: string }) => <div data-testid="tab-nav">{selected}</div>,
}))

vi.mock('../../api/client', () => ({
  api: {
    analysis: {
      getMoves: vi.fn().mockResolvedValue([]),
      getAnalysisResult: vi.fn().mockResolvedValue(null),
      saveAnalysis: vi.fn(),
      importPgn: vi.fn(),
    },
    puzzles: {
      create: vi.fn(),
      generateFromGame: vi.fn(),
    },
  },
}))

vi.mock('../../engine/useUciEngine', () => ({
  useUciEngine: () => ({
    bestMove: vi.fn().mockResolvedValue({ bestMove: '', evaluation: 0, mate: null, depth: 0 }),
    deepAnalyze: vi.fn().mockResolvedValue([]),
    analyze: vi.fn(),
    ready: false,
    evalInfo: null,
    error: null,
  }),
}))

vi.mock('../../engine/analysisEngine', () => ({
  generateExplanation: () => ({
    topMove: { san: 'e4', evaluation: 0.2, mate: null, explanation: '', followUp: '' },
    alternatives: [],
    threats: [],
    tacticalPatterns: [],
    keyConcepts: [],
  }),
}))

describe('Analysis page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title', () => {
    render(<Analysis />)
    expect(screen.getByText('Analisi')).toBeInTheDocument()
  })

  it('renders back button when onBack provided', () => {
    const onBack = vi.fn()
    render(<Analysis onBack={onBack} />)
    expect(screen.getByText(/Torna indietro/)).toBeInTheDocument()
  })

  it('shows game id when provided', () => {
    render(<Analysis gameId={42} />)
    expect(screen.getByText(/Analisi partita #42/)).toBeInTheDocument()
  })

  it('renders import button', () => {
    render(<Analysis />)
    expect(screen.getByText('Importa PGN')).toBeInTheDocument()
  })

  it('renders navigation toolbar', () => {
    render(<Analysis />)
    expect(screen.getByText('Posizione libera')).toBeInTheDocument()
    expect(screen.getByTitle(/Capovolgi/)).toBeInTheDocument()
  })

  it('renders tab navigation', () => {
    render(<Analysis />)
    expect(screen.getByTestId('tab-nav')).toBeInTheDocument()
  })

  it('renders new position button', () => {
    render(<Analysis />)
    expect(screen.getByText('Nuova posizione')).toBeInTheDocument()
  })

  it('renders chess board', () => {
    render(<Analysis />)
    expect(screen.getByTestId('chessboard')).toBeInTheDocument()
  })
})
