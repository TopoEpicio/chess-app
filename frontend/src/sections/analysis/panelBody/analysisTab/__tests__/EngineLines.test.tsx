import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EngineLines } from '../EngineLines'
import type { LineEval } from '../../../../types/eval'

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const makeLine = (overrides: Partial<LineEval> = {}): LineEval => ({
  pv: ['e2e4', 'e7e5', 'g1f3'],
  depth: 18,
  multiPv: 1,
  cp: 0.3,
  mate: undefined,
  ...overrides,
})

describe('EngineLines', () => {
  it('renders lines with evaluation and depth', () => {
    const lines = [
      makeLine({ multiPv: 1, cp: 0.3 }),
      makeLine({ multiPv: 2, cp: -0.1 }),
    ]
    render(<EngineLines lines={lines} fen={START_FEN} />)
    expect(screen.getByText(/#1/)).toBeInTheDocument()
    expect(screen.getByText(/#2/)).toBeInTheDocument()
    const depths = screen.getAllByText(/depth 18/)
    expect(depths.length).toBeGreaterThan(0)
  })

  it('formats PV as SAN strings', () => {
    const lines = [makeLine()]
    render(<EngineLines lines={lines} fen={START_FEN} />)
    expect(screen.getByText(/e4/)).toBeInTheDocument()
    expect(screen.getByText(/e5/)).toBeInTheDocument()
    expect(screen.getByText(/Nf3/)).toBeInTheDocument()
  })

  it('converts PV using the provided fen, not the starting position', () => {
    // Engine was at a position after 1.e4 e5 2.Nf3 Nc6 (White to move).
    // PV is Bc4 Nf6. If the code used the hardcoded startFen, f1c4
    // would try to move the g1 knight first (invalid).
    const lines = [makeLine({ pv: ['f1c4', 'g8f6'] })]
    const fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'
    render(<EngineLines lines={lines} fen={fen} />)
    expect(screen.getByText(/Bc4/)).toBeInTheDocument()
    expect(screen.getByText(/Nf6/)).toBeInTheDocument()
  })

  it('handles mate evaluations', () => {
    const lines = [makeLine({ cp: undefined, mate: 3 })]
    render(<EngineLines lines={lines} fen={START_FEN} />)
    expect(screen.getByText(/M3/)).toBeInTheDocument()
  })

  it('click on PV move triggers onMoveClick', () => {
    const onMoveClick = vi.fn()
    const lines = [makeLine()]
    render(<EngineLines lines={lines} fen={START_FEN} onMoveClick={onMoveClick} />)
    const moves = screen.getAllByText(/e[45]|Nf3/)
    if (moves.length > 0) {
      fireEvent.click(moves[0])
      expect(onMoveClick).toHaveBeenCalled()
    }
  })

  it('shows positive eval in green and negative in red', () => {
    const lines = [
      makeLine({ multiPv: 1, cp: 0.5 }),
      makeLine({ multiPv: 2, cp: -0.3 }),
    ]
    const { container } = render(<EngineLines lines={lines} fen={START_FEN} />)
    const evalTexts = container.querySelectorAll('.text-emerald-600, .text-red-600')
    expect(evalTexts.length).toBeGreaterThan(0)
  })

  it('shows skeleton while loading', () => {
    render(<EngineLines lines={[]} fen={START_FEN} loading />)
    const skeletons = screen.getAllByText(/Analisi in corso/)
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
