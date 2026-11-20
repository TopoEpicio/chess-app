import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArrowControls } from '../ArrowControls'
import type { ArrowConfig } from '../../../types/analysis'
import { DEFAULT_ARROW_CONFIG } from '../../../types/analysis'

describe('ArrowControls', () => {
  it('renders all four checkboxes', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={DEFAULT_ARROW_CONFIG} onChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: /Best move/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Second best/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Third best/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Opponent threats/ })).toBeInTheDocument()
  })

  it('calls onChange when checkbox is toggled', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={DEFAULT_ARROW_CONFIG} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: /Second best/ }))
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_ARROW_CONFIG,
      showSecondBest: true,
    })
  })

  it('shows reset button that resets config', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={{ ...DEFAULT_ARROW_CONFIG, showThreats: true }} onChange={onChange} />)
    fireEvent.click(screen.getByText('Reset'))
    expect(onChange).toHaveBeenCalledWith(DEFAULT_ARROW_CONFIG)
  })
})