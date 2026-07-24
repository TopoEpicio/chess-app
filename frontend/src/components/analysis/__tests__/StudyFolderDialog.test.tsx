import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudyFolderDialog } from '../StudyFolderDialog'
import * as studyFolders from '../../../data/studyFolders'

vi.mock('../../../data/studyFolders', () => ({
  listFolders: vi.fn(),
  createFolder: vi.fn(),
  deleteFolder: vi.fn(),
  addOpeningToFolder: vi.fn(),
  removeOpeningFromFolder: vi.fn(),
}))

describe('StudyFolderDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(studyFolders.listFolders).mockResolvedValue([])
    vi.mocked(studyFolders.createFolder).mockResolvedValue({
      id: 1,
      name: 'New Folder',
      description: '',
      openingIds: [],
      createdAt: '2025-01-01T00:00:00.000Z',
    })
  })

  it('shows trigger button that opens dialog', async () => {
    render(<StudyFolderDialog />)
    expect(screen.getByRole('button', { name: /gestisci/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /gestisci/i }))
    expect(screen.getByRole('heading', { name: /cartelle/i })).toBeInTheDocument()
  })

  it('loads and displays folders on open', async () => {
    vi.mocked(studyFolders.listFolders).mockResolvedValue([
      { id: 1, name: 'Italian', description: '', openingIds: [1, 2], createdAt: '' },
      { id: 2, name: 'Sicilian', description: '', openingIds: [], createdAt: '' },
    ])
    render(<StudyFolderDialog />)
    await userEvent.click(screen.getByRole('button', { name: /gestisci/i }))
    await waitFor(() => {
      expect(screen.getByText('Italian')).toBeInTheDocument()
      expect(screen.getByText('Sicilian')).toBeInTheDocument()
    })
  })

  it('creates a new folder', async () => {
    render(<StudyFolderDialog />)
    await userEvent.click(screen.getByRole('button', { name: /gestisci/i }))
    const input = screen.getByPlaceholderText(/nome cartella/i)
    await userEvent.type(input, 'My Openings')
    await userEvent.click(screen.getByRole('button', { name: /crea/i }))
    await waitFor(() => {
      expect(studyFolders.createFolder).toHaveBeenCalledWith({ name: 'My Openings' })
    })
    expect(studyFolders.listFolders).toHaveBeenCalled()
  })

  it('deletes a folder', async () => {
    vi.mocked(studyFolders.listFolders).mockResolvedValue([
      { id: 1, name: 'Italian', description: '', openingIds: [], createdAt: '' },
    ])
    render(<StudyFolderDialog />)
    await userEvent.click(screen.getByRole('button', { name: /gestisci/i }))
    await waitFor(() => {
      expect(screen.getByText('Italian')).toBeInTheDocument()
    })
    const deleteButtons = screen.getAllByRole('button', { name: /elimina/i })
    await userEvent.click(deleteButtons[0])
    await waitFor(() => {
      expect(studyFolders.deleteFolder).toHaveBeenCalledWith(1)
    })
  })

  it('shows empty state when no folders exist', async () => {
    render(<StudyFolderDialog />)
    await userEvent.click(screen.getByRole('button', { name: /gestisci/i }))
    await waitFor(() => {
      expect(screen.getByText(/nessuna/i)).toBeInTheDocument()
    })
  })
})
