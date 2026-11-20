import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnalysisLayout } from '../AnalysisLayout'

describe('AnalysisLayout', () => {
  it('renders the board and side panels', () => {
    render(
      <AnalysisLayout
        board={<div data-testid="board">Board</div>}
        side={<div data-testid="side">Side</div>}
      />
    )
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('side')).toBeInTheDocument()
  })
})