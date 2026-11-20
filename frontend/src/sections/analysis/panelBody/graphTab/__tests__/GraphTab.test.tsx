import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GraphTab } from '../index'
import type { MoveAnalysisData } from '../../../../../types/analysis'

const makeMove = (overrides: Partial<MoveAnalysisData> = {}): MoveAnalysisData => ({
  move_number: 1,
  is_white: true,
  san: 'e4',
  fen_before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  fen_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  played_eval: 0.2,
  best_eval: 0.3,
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
})

describe('GraphTab', () => {
  it('renders chart section title', () => {
    render(<GraphTab moves={[makeMove(), makeMove({ move_number: 1, is_white: false, san: 'e5' })]} />)
    expect(screen.getByText('Game trend')).toBeInTheDocument()
  })

  it('shows empty state when no moves', () => {
    render(<GraphTab moves={[]} />)
    expect(screen.getByText(/No data available/)).toBeInTheDocument()
  })
})
