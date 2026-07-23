import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnalysisTab } from '../index'

describe('AnalysisTab', () => {
  const defaultProps = {
    onStartAnalysis: vi.fn(),
    canStart: true,
    onSaveAnalysis: vi.fn(),
    hasGameResult: false,
    whiteAccuracy: null as number | null,
    blackAccuracy: null as number | null,
    movesCount: 0,
    status: '',
  }

  it('renders analyze button', () => {
    render(<AnalysisTab {...defaultProps} />)
    expect(screen.getByText('Analizza Partita')).toBeInTheDocument()
  })

  it('disables analyze button when canStart is false', () => {
    render(<AnalysisTab {...defaultProps} canStart={false} />)
    expect(screen.getByText('Analizza Partita')).toBeDisabled()
  })

  it('calls onStartAnalysis when analyze button clicked', () => {
    const onStartAnalysis = vi.fn()
    render(<AnalysisTab {...defaultProps} onStartAnalysis={onStartAnalysis} />)
    fireEvent.click(screen.getByText('Analizza Partita'))
    expect(onStartAnalysis).toHaveBeenCalledTimes(1)
  })

  it('renders save button when hasGameResult', () => {
    render(<AnalysisTab {...defaultProps} hasGameResult={true} />)
    expect(screen.getByText('Salva analisi')).toBeInTheDocument()
  })

  it('calls onSaveAnalysis when save button clicked', () => {
    const onSaveAnalysis = vi.fn()
    render(<AnalysisTab {...defaultProps} hasGameResult={true} onSaveAnalysis={onSaveAnalysis} />)
    fireEvent.click(screen.getByText('Salva analisi'))
    expect(onSaveAnalysis).toHaveBeenCalledTimes(1)
  })

  it('renders accuracy stats when game result exists', () => {
    render(<AnalysisTab {...defaultProps} hasGameResult={true} whiteAccuracy={85.5} blackAccuracy={72.3} movesCount={42} status='completed' />)
    expect(screen.getByText(/85.5%/)).toBeInTheDocument()
    expect(screen.getByText(/72.3%/)).toBeInTheDocument()
    expect(screen.getByText(/42/)).toBeInTheDocument()
    expect(screen.getByText(/completed/)).toBeInTheDocument()
  })
})
