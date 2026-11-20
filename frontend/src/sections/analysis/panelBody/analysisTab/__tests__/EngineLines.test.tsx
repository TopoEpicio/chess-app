import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EngineLines } from '../EngineLines'
import type { LineEval } from '../../../../../types/eval'

const makeLine = (overrides: Partial<LineEval> = {}): LineEval => ({
  pv: ['e2e4', 'e7e5', 'g1f3'],
  depth: 18,
  multiPv: 1,
  cp: 0.3,
  mate: undefined,
  ...overrides,
})

describe('EngineLines', () => {
  it('renders lines with evaluation and without a per-line depth label', () => {
    const lines = [
      makeLine({ multiPv: 1, cp: 0.3 }),
      makeLine({ multiPv: 2, cp: -0.1 }),
    ]
    render(<EngineLines lines={lines} />)
    expect(screen.getByText(/#1/)).toBeInTheDocument()
    expect(screen.getByText(/#2/)).toBeInTheDocument()
    // The live depth is shown once under the board, not on every line.
    expect(screen.queryByText(/depth/i)).not.toBeInTheDocument()
  })

  it('renders lines in rank order so #1 matches the best-move arrow', () => {
    const lines = [
      makeLine({ multiPv: 2, pv: ['e2e4'], cp: 0.9 }),
      makeLine({ multiPv: 1, pv: ['d2d4'], cp: 0.1 }),
    ]
    const { container } = render(<EngineLines lines={lines} />)
    const notations = [...container.querySelectorAll('.font-mono.text-xs.leading-5')]
    expect(notations[0].textContent).toBe('1. d4')
    expect(notations[1].textContent).toBe('1. e4')
  })

  it('formats PV as SAN strings', () => {
    const lines = [makeLine()]
    render(<EngineLines lines={lines} />)
    expect(screen.getByText(/e4/)).toBeInTheDocument()
    expect(screen.getByText(/e5/)).toBeInTheDocument()
    expect(screen.getByText(/Nf3/)).toBeInTheDocument()
  })

  it('renders the PV in inline notation with move numbers', () => {
    const lines = [makeLine({ pv: ['e2e4', 'e7e5', 'g1f3', 'b8c6'] })]
    const { container } = render(<EngineLines lines={lines} />)
    const notation = container.querySelector('.font-mono.text-xs.leading-5')
    expect(notation).not.toBeNull()
    expect(notation?.textContent).toBe('1. e4 e5 2. Nf3 Nc6')
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
  })

  it('uses the "N..." prefix when the line starts with a Black move', () => {
    const lines = [makeLine({ pv: ['e7e5', 'g1f3'] })]
    const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
    const { container } = render(<EngineLines lines={lines} fen={fen} />)
    const notation = container.querySelector('.font-mono.text-xs.leading-5')
    expect(notation?.textContent).toBe('1... e5 2. Nf3')
  })

  it('handles mate evaluations', () => {
    const lines = [makeLine({ cp: undefined, mate: 3 })]
    render(<EngineLines lines={lines} />)
    expect(screen.getByText(/M3/)).toBeInTheDocument()
  })

  it('click on PV move triggers onMoveClick', () => {
    const onMoveClick = vi.fn()
    const lines = [makeLine()]
    render(<EngineLines lines={lines} onMoveClick={onMoveClick} />)
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
    const { container } = render(<EngineLines lines={lines} />)
    const evalTexts = container.querySelectorAll('.text-emerald-600, .text-red-600')
    expect(evalTexts.length).toBeGreaterThan(0)
  })

  it('shows skeleton while loading', () => {
    render(<EngineLines lines={[]} loading />)
    const skeletons = screen.getAllByText(/Analyzing position/)
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
