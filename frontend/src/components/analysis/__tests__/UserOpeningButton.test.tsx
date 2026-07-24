import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserOpeningButton } from '../UserOpeningButton'
import * as userOpenings from '../../../data/userOpenings'

vi.mock('../../../data/userOpenings', () => ({
  saveUserOpening: vi.fn(),
  isDuplicateFen: vi.fn(),
}))

describe('UserOpeningButton', () => {
  const mockOpening = {
    name: 'Italian Game',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    eco: 'C50',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(userOpenings.isDuplicateFen).mockResolvedValue(false)
    vi.mocked(userOpenings.saveUserOpening).mockResolvedValue({
      id: 1,
      name: 'Italian Game',
      fen: mockOpening.fen,
      eco: 'C50',
      createdAt: '2025-01-01T00:00:00.000Z',
    })
  })

  it('renders add button when openingName is provided', () => {
    render(<UserOpeningButton openingName={mockOpening.name} fen={mockOpening.fen} eco={mockOpening.eco} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not render when openingName is missing', () => {
    const { container } = render(<UserOpeningButton openingName={undefined} fen="" />)
    expect(container.innerHTML).toBe('')
  })

  it('opens save dialog on click', async () => {
    render(<UserOpeningButton openingName={mockOpening.name} fen={mockOpening.fen} eco={mockOpening.eco} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByPlaceholderText(/nome apertura/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /salva/i })).toBeInTheDocument()
  })

  it('pre-fills opening name in dialog', async () => {
    render(<UserOpeningButton openingName={mockOpening.name} fen={mockOpening.fen} eco={mockOpening.eco} />)
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByDisplayValue(mockOpening.name)
    expect(input).toBeInTheDocument()
  })

  it('saves opening and shows success message', async () => {
    render(<UserOpeningButton openingName={mockOpening.name} fen={mockOpening.fen} eco={mockOpening.eco} />)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))
    await waitFor(() => {
      expect(screen.getByText(/salvata/i)).toBeInTheDocument()
    })
    expect(userOpenings.saveUserOpening).toHaveBeenCalledWith({
      name: mockOpening.name,
      fen: mockOpening.fen,
      eco: mockOpening.eco,
    })
  })

  it('shows duplicate message when FEN already exists', async () => {
    vi.mocked(userOpenings.isDuplicateFen).mockResolvedValue(true)
    render(<UserOpeningButton openingName={mockOpening.name} fen={mockOpening.fen} eco={mockOpening.eco} />)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))
    await waitFor(() => {
      expect(screen.getByText(/già/i)).toBeInTheDocument()
    })
    expect(userOpenings.saveUserOpening).not.toHaveBeenCalled()
  })
})