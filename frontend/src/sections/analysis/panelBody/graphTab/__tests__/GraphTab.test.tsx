import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GraphTab } from '../index'

describe('GraphTab', () => {
  it('renders chart section title', () => {
    render(<GraphTab moves={[{ uci: 'e2e4' }, { uci: 'e7e5' }]} />)
    expect(screen.getByText('Andamento della Partita')).toBeInTheDocument()
  })

  it('shows empty state when no moves', () => {
    render(<GraphTab moves={[]} />)
    expect(screen.getByText(/Nessun dato disponibile/)).toBeInTheDocument()
  })
})
