import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PanelHeader } from '../index'

describe('PanelHeader', () => {
  const defaultProps = {
    onBack: vi.fn(),
    onImportPgn: vi.fn(),
    importMsg: '',
    gameId: undefined as number | undefined,
  }

  it('renders title and description', () => {
    render(<PanelHeader {...defaultProps} />)
    expect(screen.getByText('Analisi')).toBeInTheDocument()
    expect(screen.getByText(/Analisi con Stockfish/)).toBeInTheDocument()
  })

  it('renders back button when onBack provided', () => {
    render(<PanelHeader {...defaultProps} />)
    expect(screen.getByText(/Torna indietro/)).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn()
    render(<PanelHeader {...defaultProps} onBack={onBack} />)
    fireEvent.click(screen.getByText(/Torna indietro/))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('shows game id when provided', () => {
    render(<PanelHeader {...defaultProps} gameId={42} />)
    expect(screen.getByText(/Analisi partita #42/)).toBeInTheDocument()
  })

  it('renders import button', () => {
    render(<PanelHeader {...defaultProps} />)
    expect(screen.getByText(/Importa PGN/)).toBeInTheDocument()
  })

  it('calls onImportPgn when import button clicked', () => {
    const onImportPgn = vi.fn()
    render(<PanelHeader {...defaultProps} onImportPgn={onImportPgn} />)
    fireEvent.click(screen.getByText(/Importa PGN/))
    expect(onImportPgn).toHaveBeenCalledTimes(1)
  })

  it('shows import message when provided', () => {
    render(<PanelHeader {...defaultProps} importMsg="Partita importata!" />)
    expect(screen.getByText('Partita importata!')).toBeInTheDocument()
  })
})
