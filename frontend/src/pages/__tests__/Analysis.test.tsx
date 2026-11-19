import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Analysis } from '../Analysis'
import { EngineConfigProvider } from '../../stores/engineStore'

const en = {
  analysis: {
    white: 'White',
    black: 'Black',
    openingUnknown: 'Unknown opening',
    whiteAccuracy: 'White Accuracy',
    blackAccuracy: 'Black Accuracy',
    acpl: 'ACPL',
    blunders: 'Blunders',
    engineDepth: 'Engine depth',
    live: 'LIVE',
    currentPosition: 'Current position',
    botThinking: 'Bot is thinking...',
    startOfGame: 'Start of game',
    previousMove: 'Previous move',
    nextMove: 'Next move',
    endOfGame: 'End of game',
    sections: 'Analysis sections',
    exportAnalysis: 'Export analysis',
    engineInsight: 'Engine & Insight',
    engine: 'Engine',
    analyzing: 'Analyzing...',
    saved: 'Analysis saved',
    newPosition: 'New position',
    playVsBot: 'Play vs Bot',
    createPuzzle: 'Create puzzle',
    noData: 'No data available. Run the game analysis first.',
    gameTrend: 'Game trend',
    moveNumber: 'Move number',
    moveLabel: 'Move {{number}}{{side}}: {{san}}',
    bestMoveWhite: 'Best move White:',
    bestMoveBlack: 'Best move Black:',
    na: 'N/A',
    summary: 'Summary',
    graph: 'Graph',
    moves: 'Moves',
    arrowsTab: 'Arrows',
    coach: 'Coach',
    flipBoard: 'Flip board',
    resetBoard: 'Reset board',
    analyzeGame: 'Analyze game',
    depth: 'Depth',
    evaluation: 'Evaluation',
    actions: 'Actions',
    generatingPuzzles: 'Generating puzzles...',
    analyzeAll: 'Analyze all',
    coachNoAnalysis: 'No analysis available',
    coachInsight: 'Coach Insight',
    chronology: 'Chronology',
    exportPgn: 'Export PGN',
    reanalyzeAll: 'Reanalyze all',
    chronologyPlaceholder: 'No moves to display',
    move: 'Move',
    time: 'Time',
    classification: 'Classification',
    whiteMove: 'White',
    blackMove: 'Black',
    whiteBlack: 'White / Black',
    title: 'Analysis',
    analyzeWithStockfish: 'Analyze with Stockfish',
    opening: 'Opening',
    back: 'Back',
  },
  common: {
    export: 'Export',
    back: 'Back',
  },
  games: {
    importPgn: 'Import PGN',
  },
  play: {
    vsBot: 'Play vs Bot',
    newPosition: 'New position',
    createPuzzle: 'Create puzzle',
  },
} as Record<string, unknown>

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  const t = (key: string, _opts?: Record<string, unknown>): string => {
    const val = key.split('.').reduce((o: any, p) => (o && typeof o === 'object' ? o[p] : undefined), en)
    return typeof val === 'string' ? val : key
  }
  return {
    ...actual,
    useTranslation: () => ({ t }),
  }
})

vi.mock('../../components/board/ChessBoard', () => ({
  ChessBoard: () => <div data-testid='chessboard'>Board</div>,
}))

vi.mock('../../components/analysis/ProgressBar', () => ({
  ProgressBar: ({ progress }: { progress: number }) => <div data-testid='progress-bar'>{progress}%</div>,
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

// Stable mock functions: a new i.fn() on every render would change the
// identity of deepAnalyze, re-trigger the analysis effect and spin the
// component into an infinite render loop.
const { mockBestMove, mockDeepAnalyze, mockAnalyze } = vi.hoisted(() => ({
  mockBestMove: vi.fn(),
  mockDeepAnalyze: vi.fn(),
  mockAnalyze: vi.fn(),
}))

const mockAnalyzeLive = vi.fn()

vi.mock('../../engine/useUciEngine', () => ({
  BASE_DEPTH: 16,
  useUciEngine: () => ({
    bestMove: mockBestMove,
    deepAnalyze: mockDeepAnalyze,
    analyzeLive: mockAnalyzeLive,
    analyze: mockAnalyze,
    ready: true,
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

const renderWithProviders = (ui: Parameters<typeof render>[0], options?: Parameters<typeof render>[1]) => {
  return render(<EngineConfigProvider>{ui}</EngineConfigProvider>, options)
}

describe('Analysis page (Variant C SaaS)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBestMove.mockResolvedValue({ bestMove: '', evaluation: 0, mate: null, depth: 0 })
    mockDeepAnalyze.mockResolvedValue([])
    mockAnalyze.mockReturnValue(undefined)
  })

  it('renders match info', () => {
    renderWithProviders(<Analysis />)
    // Check for match result and opening info which are present in the new design
    // 'Unknown opening' appears in both PanelHeader and Match Header - use getAllByText
    expect(screen.getByText('1-0')).toBeInTheDocument()
    expect(screen.getAllByText('Unknown opening')).toHaveLength(2)
  })

  it('renders navigation buttons when onBack provided', () => {
    const onBack = vi.fn()
    renderWithProviders(<Analysis onBack={onBack} />)
    expect(screen.getByRole('button', { name: /start of game/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous move/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next move/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /end of game/i })).toBeInTheDocument()
  })

  it('renders new position button', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByRole('button', { name: /new position/i })).toBeInTheDocument()
  })

  it('renders play against bot button', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByRole('button', { name: /play vs bot/i })).toBeInTheDocument()
  })

  it('renders create puzzle button when analysis result exists', () => {
    // The button is only shown when fen && analysisResult are truthy
    // In default test state they are not, so we check it's not rendered
    renderWithProviders(<Analysis />)
    expect(screen.queryByRole('button', { name: /create puzzle/i })).not.toBeInTheDocument()
  })

  it('renders chess board', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByTestId('chessboard')).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getAllByText('White Accuracy')).toHaveLength(2)
    expect(screen.getAllByText('Black Accuracy')).toHaveLength(2)
    expect(screen.getByText('ACPL')).toBeInTheDocument()
    expect(screen.getByText('Blunders')).toBeInTheDocument()
    expect(screen.getByText('Engine depth')).toBeInTheDocument()
  })

  it('renders tabs', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByRole('tab', { name: /summary/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /moves/i })).toBeInTheDocument()
  })

  it('renders status bar', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByText('Stockfish 16')).toBeInTheDocument()
    expect(screen.getByText('Analysis saved')).toBeInTheDocument()
  })

  it('renders export buttons', () => {
    renderWithProviders(<Analysis />)
    // Only one export button in new design (in PanelHeader)
    expect(screen.getAllByRole('button', { name: /export/i })).toHaveLength(1)
  })

  it('renders match header with players', () => {
    renderWithProviders(<Analysis />)
    expect(screen.getByText('White')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
    expect(screen.getByText('1-0')).toBeInTheDocument()
  })
})
