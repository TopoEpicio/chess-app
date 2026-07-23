import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoachTab } from '../index'

describe('CoachTab', () => {
  it('renders EducationalPanel with analysis', () => {
    render(<CoachTab analysis={null} engineReady={false} />)
    expect(screen.getByText(/Stockfish in caricamento/)).toBeInTheDocument()
  })

  it('renders placeholder when no analysis and engine ready', () => {
    render(<CoachTab analysis={null} engineReady={true} />)
    expect(screen.getByText(/Naviga su una posizione/)).toBeInTheDocument()
  })
})
