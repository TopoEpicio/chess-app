import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArrowControls } from '../ArrowControls'
import type { ArrowConfig } from '../../../types/analysis'
import { DEFAULT_ARROW_CONFIG } from '../../../types/analysis'

describe('ArrowControls', () => {
  it('renders all four checkboxes', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={DEFAULT_ARROW_CONFIG} onChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: /Miglior mossa/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Seconda migliore/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Terza migliore/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Minacce avversarie/ })).toBeInTheDocument()
  })

  it('calls onChange when checkbox is toggled', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={DEFAULT_ARROW_CONFIG} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: /Seconda migliore/ }))
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_ARROW_CONFIG,
      showSecondBest: true,
    })
  })

  it('shows default button that resets config', () => {
    const onChange = vi.fn()
    render(<ArrowControls config={{ ...DEFAULT_ARROW_CONFIG, showThreats: true }} onChange={onChange} />)
    fireEvent.click(screen.getByText('Default'))
    expect(onChange).toHaveBeenCalledWith(DEFAULT_ARROW_CONFIG)
  })
})
