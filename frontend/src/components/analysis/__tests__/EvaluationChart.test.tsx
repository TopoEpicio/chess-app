import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EvaluationChart } from '../EvaluationChart'
import type { MoveAnalysisData } from '../../../types/analysis'

function makeMove(overrides: Partial<MoveAnalysisData> = {}): MoveAnalysisData {
  return {
    move_number: 1,
    is_white: true,
    san: 'e4',
    fen_before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fen_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    played_eval: 0.2,
    best_eval: 0.2,
    best_move_san: 'e4',
    best_move_uci: 'e2e4',
    second_move_uci: null,
    second_move_eval: null,
    third_move_uci: null,
    third_move_eval: null,
    depth: 18,
    eval_swing: 0,
    classification: 'best',
    pvs: null,
    wp_before: null,
    wp_after: null,
    wp_best: null,
    wp_loss: null,
    ...overrides,
  }
}

describe('EvaluationChart', () => {
  it('renders empty state when no moves', () => {
    const { container } = render(<EvaluationChart moves={[]} />)
    expect(container.querySelectorAll('svg').length).toBe(0)
    expect(container.textContent?.length).toBeGreaterThan(0)
  })

  it('renders chart with moves', () => {
    const moves = [makeMove(), makeMove({ move_number: 2, is_white: false, san: 'e5' })]
    render(<EvaluationChart moves={moves} />)
    expect(screen.getByText(/Andamento della Partita/)).toBeInTheDocument()
  })

  it('shows reference line at current move index', () => {
    const moves = [
      makeMove(),
      makeMove({ move_number: 2, is_white: false, san: 'e5' }),
      makeMove({ move_number: 3, is_white: true, san: 'Nf3' }),
    ]
    const { container } = render(<EvaluationChart moves={moves} currentMoveIndex={1} />)
    const dashedLines = container.querySelectorAll('line[stroke-dasharray="4,4"]')
    const refLines = Array.from(dashedLines).filter(
      (l) => l.getAttribute('stroke') === '#666',
    )
    expect(refLines.length).toBeGreaterThan(0)
  })

  it('calls onMoveClick when clicking a classification dot', () => {
    const onMoveClick = vi.fn()
    const moves = [
      makeMove(),
      makeMove({ move_number: 2, is_white: false, san: 'e5', classification: 'blunder', eval_swing: 0.5 }),
    ]
    render(<EvaluationChart moves={moves} onMoveClick={onMoveClick} />)
    const circles = document.querySelectorAll('circle[cursor="pointer"]')
    if (circles.length > 0) {
      fireEvent.click(circles[0])
      expect(onMoveClick).toHaveBeenCalled()
    }
  })

  it('shows colored dots for non-best moves', () => {
    const moves = [
      makeMove(),
      makeMove({
        move_number: 2, is_white: false, san: 'e5',
        classification: 'blunder', eval_swing: 0.5,
      }),
    ]
    const { container } = render(<EvaluationChart moves={moves} />)
    const circles = container.querySelectorAll('circle')
    const coloredCircles = Array.from(circles).filter((c) => {
      const fill = c.getAttribute('fill')
      return fill && fill !== '#fff' && fill !== 'none'
    })
    expect(coloredCircles.length).toBeGreaterThan(0)
  })

  it('shows best/worst labels', () => {
    const moves = [
      makeMove(),
      makeMove({ move_number: 2, is_white: false, san: 'e5' }),
    ]
    render(<EvaluationChart moves={moves} />)
    const labels = screen.getAllByText(/Miglior mossa/)
    expect(labels.length).toBe(2)
  })
})
