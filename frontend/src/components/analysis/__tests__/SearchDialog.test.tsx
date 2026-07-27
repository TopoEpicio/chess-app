import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchDialog } from '../SearchDialog'

describe('SearchDialog', () => {
  it('renders search input', () => {
    render(<SearchDialog onSelect={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByPlaceholderText(/Cerca apertura/)).toBeInTheDocument()
  })

  it('shows results when typing', async () => {
    render(<SearchDialog onSelect={vi.fn()} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/Cerca apertura/)
    fireEvent.change(input, { target: { value: 'sicilian' } })
    await waitFor(() => {
      const items = screen.getAllByText(/Sicilian/)
      expect(items.length).toBeGreaterThan(0)
    })
  })

  it('calls onSelect when result is clicked', async () => {
    const onSelect = vi.fn()
    render(<SearchDialog onSelect={onSelect} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/Cerca apertura/)
    fireEvent.change(input, { target: { value: 'italian' } })
    await waitFor(() => {
      const items = screen.getAllByText(/Italian Game/)
      fireEvent.click(items[0])
      expect(onSelect).toHaveBeenCalled()
    })
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<SearchDialog onSelect={vi.fn()} onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /chiudi/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows empty state for no results', async () => {
    render(<SearchDialog onSelect={vi.fn()} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/Cerca apertura/)
    fireEvent.change(input, { target: { value: 'zzzznotfound' } })
    await waitFor(() => {
      expect(screen.getByText(/Nessuna apertura/)).toBeInTheDocument()
    })
  })

  it('shows ECO code when available', async () => {
    render(<SearchDialog onSelect={vi.fn()} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/Cerca apertura/)
    fireEvent.change(input, { target: { value: 'italian' } })
    await waitFor(() => {
      const codes = screen.getAllByText(/C5[0-9]/)
      expect(codes.length).toBeGreaterThan(0)
    })
  })

  it('has dialog role and aria-modal', () => {
    render(<SearchDialog onSelect={vi.fn()} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'search-dialog-title')
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    render(<SearchDialog onSelect={vi.fn()} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
