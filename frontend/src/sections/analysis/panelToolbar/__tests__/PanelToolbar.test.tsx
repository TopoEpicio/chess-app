import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PanelToolbar } from '../index'

describe('PanelToolbar', () => {
  const defaultProps = {
    currentIndex: -1,
    totalMoves: 5,
    canPrev: false,
    canNext: true,
    onPrev: vi.fn(),
    onNext: vi.fn(),
    boardFlipped: false,
    onFlip: vi.fn(),
  }

  it('renders move counter', () => {
    render(<PanelToolbar {...defaultProps} />)
    expect(screen.getByText('0 / 5')).toBeInTheDocument()
  })

  it('renders counter at current position', () => {
    render(<PanelToolbar {...defaultProps} currentIndex={2} />)
    expect(screen.getByText('3 / 5')).toBeInTheDocument()
  })

  it('disables prev button when canPrev is false', () => {
    render(<PanelToolbar {...defaultProps} />)
    expect(screen.getByText(/Precedente/)).toBeDisabled()
  })

  it('enables prev button when canPrev is true', () => {
    render(<PanelToolbar {...defaultProps} canPrev={true} />)
    expect(screen.getByText(/Precedente/)).not.toBeDisabled()
  })

  it('disables next button when canNext is false', () => {
    render(<PanelToolbar {...defaultProps} canNext={false} />)
    expect(screen.getByText(/Successiva/)).toBeDisabled()
  })

  it('calls onPrev when prev button clicked', () => {
    const onPrev = vi.fn()
    render(<PanelToolbar {...defaultProps} canPrev={true} onPrev={onPrev} />)
    fireEvent.click(screen.getByText(/Precedente/))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when next button clicked', () => {
    const onNext = vi.fn()
    render(<PanelToolbar {...defaultProps} onNext={onNext} />)
    fireEvent.click(screen.getByText(/Successiva/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('renders flip button', () => {
    render(<PanelToolbar {...defaultProps} />)
    expect(screen.getByTitle(/Capovolgi/)).toBeInTheDocument()
  })

  it('calls onFlip when flip button clicked', () => {
    const onFlip = vi.fn()
    render(<PanelToolbar {...defaultProps} onFlip={onFlip} />)
    fireEvent.click(screen.getByTitle(/Capovolgi/))
    expect(onFlip).toHaveBeenCalledTimes(1)
  })
})
