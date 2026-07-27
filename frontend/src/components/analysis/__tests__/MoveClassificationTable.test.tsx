import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoveClassificationTable } from '../MoveClassificationTable'
import type { MoveAnalysisData } from '../../../types/analysis'

const makeMove = (overrides: Partial<MoveAnalysisData>): MoveAnalysisData => ({
  move_number: 1,
  is_white: true,
  classification: 'best',
  san: 'e4',
  fen_before: '',
  fen_after: '',
  played_eval: 0,
  best_eval: 0,
  best_move_san: 'e4',
  best_move_uci: 'e2e4',
  second_move_uci: null,
  second_move_eval: null,
  third_move_uci: null,
  third_move_eval: null,
  depth: 18,
  eval_swing: 0,
  pvs: null,
  wp_before: null,
  wp_after: null,
  wp_best: null,
  wp_loss: null,
  ...overrides,
})

const moves: MoveAnalysisData[] = [
  makeMove({ move_number: 1, is_white: true, classification: 'blunder', san: 'e4' }),
  makeMove({ move_number: 1, is_white: false, classification: 'blunder', san: 'e5' }),
  makeMove({ move_number: 2, is_white: true, classification: 'best', san: 'Nf3' }),
  makeMove({ move_number: 2, is_white: false, classification: 'best', san: 'Nc6' }),
  makeMove({ move_number: 3, is_white: true, classification: 'blunder', san: 'Ng5' }),
]

const counts = { blunder: 3, best: 2 }

describe('MoveClassificationTable', () => {
  it('navigates to the next blunder of the same color wrapping from the end', () => {
    const onMoveSelect = vi.fn()

    const { rerender } = render(
      <MoveClassificationTable
        moves={moves}
        classificationCounts={counts}
        currentIndex={0}
        onMoveSelect={onMoveSelect}
      />,
    )

    fireEvent.click(screen.getByTitle(/blunder del bianco/i))
    expect(onMoveSelect).toHaveBeenCalledWith(4)
  })

  it('wraps to the first blunder when at the last one', () => {
    const onMoveSelect = vi.fn()

    render(
      <MoveClassificationTable
        moves={moves}
        classificationCounts={counts}
        currentIndex={4}
        onMoveSelect={onMoveSelect}
      />,
    )

    fireEvent.click(screen.getByTitle(/blunder del bianco/i))
    expect(onMoveSelect).toHaveBeenCalledWith(0)
  })

  it('does not navigate when the current move is the only match', () => {
    const onMoveSelect = vi.fn()

    const singleMoves: MoveAnalysisData[] = [
      makeMove({ move_number: 1, is_white: true, classification: 'blunder' }),
      makeMove({ move_number: 1, is_white: false, classification: 'best' }),
    ]

    render(
      <MoveClassificationTable
        moves={singleMoves}
        classificationCounts={{ blunder: 1, best: 1 }}
        currentIndex={0}
        onMoveSelect={onMoveSelect}
      />,
    )

    fireEvent.click(screen.getByTitle(/blunder del bianco/i))
    expect(onMoveSelect).not.toHaveBeenCalled()
  })
})
