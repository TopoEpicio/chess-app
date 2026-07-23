import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnalysisLayout } from '../AnalysisLayout'

describe('AnalysisLayout', () => {
  it('renders board and side panel', () => {
    render(
      <AnalysisLayout
        board={<div data-testid="board">Board</div>}
        sidePanel={<div data-testid="side-panel">Side Panel</div>}
      />
    )
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('side-panel')).toBeInTheDocument()
  })
})
