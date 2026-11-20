import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { ChessBoard } from '../ChessBoard'
import { arrowConfigAtom } from '../../../state/atoms/engineAtoms'

vi.mock('../ThemedBoard', () => ({
  Chessboard: vi.fn(({ options }: { options: Record<string, unknown> }) => (
    <div data-testid="themed-board" data-options={JSON.stringify(options)} />
  )),
}))

vi.mock('../EvalBar', () => ({
  EvalBar: () => <div data-testid="eval-bar" />,
}))

function renderWithStore(ui: React.ReactElement, store: ReturnType<typeof createStore>) {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('ChessBoard', () => {
  it('renders board with position', () => {
    const store = createStore()
    renderWithStore(
      <ChessBoard position="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1" />,
      store,
    )
    expect(screen.getByTestId('themed-board')).toBeInTheDocument()
  })

  it('renders eval bar when showEval is true', () => {
    const store = createStore()
    renderWithStore(<ChessBoard position="start" showEval />, store)
    expect(screen.getByTestId('eval-bar')).toBeInTheDocument()
  })

  it('renders without eval bar when showEval is false', () => {
    const store = createStore()
    renderWithStore(<ChessBoard position="start" showEval={false} />, store)
    expect(screen.queryByTestId('eval-bar')).not.toBeInTheDocument()
  })

  it('passes arrows from moveData to board options', () => {
    const store = createStore()
    const moveData = {
      move_number: 1,
      is_white: true,
      san: 'e4',
      fen_before: 'start',
      fen_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      played_eval: 0.2,
      best_eval: 0.22,
      best_move_san: 'e4',
      best_move_uci: 'e2e4',
      second_move_uci: null,
      second_move_eval: null,
      third_move_uci: null,
      third_move_eval: null,
      depth: 22,
      eval_swing: 0.02,
      classification: 'best' as const,
      pvs: null,
      wp_before: null,
      wp_after: null,
      wp_best: null,
      wp_loss: null,
    }
    renderWithStore(<ChessBoard position="start" moveData={moveData} />, store)
    const board = screen.getByTestId('themed-board')
    const options = JSON.parse(board.getAttribute('data-options')!)
    expect(options.arrows).toBeDefined()
    expect(options.arrows).toHaveLength(1)
    expect(options.arrows[0].color).toBe('#008000')
  })

  it('uses board orientation from prop', () => {
    const store = createStore()
    renderWithStore(
      <ChessBoard position="start" boardOrientation="black" />,
      store,
    )
    const board = screen.getByTestId('themed-board')
    const options = JSON.parse(board.getAttribute('data-options')!)
    expect(options.boardOrientation).toBe('black')
  })

  it('derives the arrows from the engine lines so they match the suggestions', () => {
    const store = createStore()
    renderWithStore(
      <ChessBoard
        position="start"
        engineLines={[
          { pv: ['d2d4', 'd7d5'], depth: 16, multiPv: 1, cp: 20 },
          { pv: ['e2e4'], depth: 16, multiPv: 2, cp: 15 },
        ]}
      />,
      store,
    )
    const board = screen.getByTestId('themed-board')
    const options = JSON.parse(board.getAttribute('data-options')!)
    expect(options.arrows).toHaveLength(1)
    expect(options.arrows[0].startSquare).toBe('d2')
    expect(options.arrows[0].endSquare).toBe('d4')
  })

  it('highlights the played move, not the engine suggestion', () => {
    const store = createStore()
    const moveData = {
      move_number: 1,
      is_white: true,
      san: 'Nf3',
      fen_before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      fen_after: 'rnbqkbnr/pppppppp/8/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      played_eval: 0.2,
      best_eval: 0.22,
      best_move_san: 'e4',
      best_move_uci: 'e2e4',
      second_move_uci: null,
      second_move_eval: null,
      third_move_uci: null,
      third_move_eval: null,
      depth: 22,
      eval_swing: 0.02,
      classification: 'good' as const,
      pvs: null,
      wp_before: null,
      wp_after: null,
      wp_best: null,
      wp_loss: null,
    }
    renderWithStore(<ChessBoard position="start" moveData={moveData} />, store)
    const board = screen.getByTestId('themed-board')
    const options = JSON.parse(board.getAttribute('data-options')!)
    // The yellow highlight must be on g1/f3 (the played move), not on e2/e4.
    expect(Object.keys(options.squareStyles ?? {})).toEqual(
      expect.arrayContaining(['g1', 'f3']),
    )
    expect(options.squareStyles?.e2).toBeUndefined()
  })

  it('renders SquareRenderer with classification icons', () => {
    const store = createStore()
    const { container } = renderWithStore(
      <ChessBoard
        position="start"
        lastMoveUci="e2e4"
        classification="blunder"
      />,
      store,
    )
    const texts = container.querySelectorAll('text')
    expect(texts.length).toBeGreaterThan(0)
    expect(container.innerHTML).toContain('??')
  })
})
