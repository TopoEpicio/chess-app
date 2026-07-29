import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { Chess } from 'chess.js'
import { Play } from '../Play'

let squareClickHandler: ((args: { piece: { pieceType: string } | null; square: string }) => void) | undefined

vi.mock('../../components/board/ThemedBoard', () => ({
  Chessboard: ({ options }: { options: Record<string, unknown> }) => {
    squareClickHandler = options.onSquareClick as typeof squareClickHandler
    return <div data-testid="chessboard">Board</div>
  },
}))

const mockBestMove = vi.fn()

vi.mock('../../engine/useUciEngine', () => ({
  useUciEngine: () => ({
    bestMove: mockBestMove,
    ready: true,
  }),
}))

vi.mock('../../stores/engineStore', () => ({
  useEngineConfig: () => ({
    setSkillElo: vi.fn(),
  }),
}))

function firstLegalMove(fen: string) {
  const g = new Chess(fen)
  const moves = g.moves({ verbose: true })
  const m = moves[0]
  if (!m) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }
  return { bestMove: m.from + m.to + (m.promotion ?? ''), evaluation: 0.2, mate: null, depth: 18 }
}

describe('Play', () => {
  beforeEach(() => {
    squareClickHandler = undefined
    vi.clearAllMocks()
  })

  it('renders setup screen initially', () => {
    render(<Play />)
    expect(screen.getByText('Scegli il tuo colore')).toBeInTheDocument()
  })

  it('starts a game as White', () => {
    render(<Play />)
    fireEvent.click(screen.getByText('Bianco'))
    expect(screen.getByText('Partita')).toBeInTheDocument()
  })

  it('renders chessboard after starting', () => {
    render(<Play />)
    fireEvent.click(screen.getByText('Bianco'))
    expect(screen.getByTestId('chessboard')).toBeInTheDocument()
  })

  it('click own piece during turn reassigns selection', async () => {
    render(<Play />)
    fireEvent.click(screen.getByText('Bianco'))
    await waitFor(() => expect(screen.getByTestId('chessboard')).toBeInTheDocument())

    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'e2' })
    })
    // Click another own piece (knight) should reassign selection
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'N' }, square: 'g1' })
    })
    // Now click empty square for the knight move
    act(() => {
      squareClickHandler?.({ piece: null, square: 'f3' })
    })
    await waitFor(() => expect(screen.getByText('Nf3')).toBeInTheDocument())
  })

  it('click own piece during premode reassigns source', async () => {
    let deferredResolve: (v: unknown) => void
    let callIdx = 0

    mockBestMove.mockImplementation(async (fen: string) => {
      callIdx++
      if (callIdx === 2) {
        await new Promise((resolve) => { deferredResolve = resolve })
      }
      return firstLegalMove(fen)
    })

    render(<Play />)
    fireEvent.click(screen.getByText('Bianco'))
    await waitFor(() => expect(screen.getByTestId('chessboard')).toBeInTheDocument())

    // Make first two human moves
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'e2' })
      squareClickHandler?.({ piece: null, square: 'e4' })
    })
    await waitFor(() => expect(screen.getByText('e4')).toBeInTheDocument())

    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'd2' })
      squareClickHandler?.({ piece: null, square: 'd4' })
    })
    await waitFor(() => expect(screen.getByText('d4')).toBeInTheDocument())

    // Bot's turn: click pawn, then click knight (own piece) → reassigns source
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'e2' })
    })
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'N' }, square: 'g1' })
    })
    // Now click empty square to set premove from knight
    act(() => {
      squareClickHandler?.({ piece: null, square: 'f3' })
    })
    expect(screen.getByText(/Premossa/)).toBeInTheDocument()

    await act(async () => { deferredResolve(undefined) })
    await waitFor(() => {
      expect(screen.queryByText(/Premossa/)).not.toBeInTheDocument()
    })
  })

  it('stores premove during bot turn and executes after bot moves', async () => {
    let deferredResolve: (v: unknown) => void
    let callIdx = 0

    mockBestMove.mockImplementation(async (fen: string) => {
      callIdx++
      // Defer only the second bot move so we can set a premove during it
      if (callIdx === 2) {
        await new Promise((resolve) => { deferredResolve = resolve })
      }
      return firstLegalMove(fen)
    })

    render(<Play />)
    fireEvent.click(screen.getByText('Bianco'))
    await waitFor(() => expect(screen.getByTestId('chessboard')).toBeInTheDocument())

    // Human's turn: click-to-move e2e4
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'e2' })
      squareClickHandler?.({ piece: null, square: 'e4' })
    })
    await waitFor(() => expect(screen.getByText('e4')).toBeInTheDocument())

    // Human's turn: click-to-move d2d4 (bot has responded with e7e5)
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'P' }, square: 'd2' })
      squareClickHandler?.({ piece: null, square: 'd4' })
    })
    await waitFor(() => expect(screen.getByText('d4')).toBeInTheDocument())

    // Bot's turn: set a premove (g1f3) while bot is "thinking"
    act(() => {
      squareClickHandler?.({ piece: { pieceType: 'N' }, square: 'g1' })
      squareClickHandler?.({ piece: null, square: 'f3' })
    })
    expect(screen.getByText(/Premossa/)).toBeInTheDocument()

    // Let the bot finish thinking → premove should execute
    await act(async () => { deferredResolve(undefined) })

    await waitFor(() => {
      expect(screen.queryByText(/Premossa/)).not.toBeInTheDocument()
    })
    expect(screen.getByText(/Mosse/)).toBeInTheDocument()
  })
})
