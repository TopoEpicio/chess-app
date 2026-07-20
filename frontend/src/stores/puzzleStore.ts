import { create } from 'zustand'
import type { Puzzle, PuzzleCategory, CategoryStats } from '../types'
import { api } from '../api/client'

interface PuzzleState {
  puzzles: Puzzle[]
  currentPuzzle: Puzzle | null
  solved: string[]
  loading: boolean
  category: PuzzleCategory
  subcategory: string | null
  categoryStats: Record<string, CategoryStats> | null
  setCategory: (cat: PuzzleCategory) => void
  setSubcategory: (sub: string | null) => void
  setPuzzles: (puzzles: Puzzle[]) => void
  setCurrentPuzzle: (puzzle: Puzzle | null) => void
  markSolved: (id: string) => void
  loadPuzzles: (params?: { theme?: string; difficulty?: number; phase?: string; category?: string }) => Promise<void>
  loadCategoryStats: () => Promise<void>
  createPuzzle: (data: unknown) => Promise<void>
  deletePuzzle: (id: number) => Promise<void>
  generateFromGame: (gameId: number) => Promise<void>
  submitAttempt: (data: { puzzle_id: number; user_id: number; correct: boolean; time_ms?: number }) => Promise<void>
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  puzzles: [],
  currentPuzzle: null,
  solved: [],
  loading: false,
  category: 'mix',
  subcategory: null,
  categoryStats: null,
  setCategory: (cat) => set({ category: cat, subcategory: null }),
  setSubcategory: (sub) => set({ subcategory: sub }),
  setPuzzles: (puzzles) => set({ puzzles }),
  setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),
  markSolved: (id) => set((s) => ({ solved: [...s.solved, id] })),
  loadPuzzles: async (params) => {
    set({ loading: true })
    try {
      const data = await api.puzzles.list(params)
      set({ puzzles: data ?? [] })
    } catch (e) {
      console.error('Failed to load puzzles:', e)
    } finally {
      set({ loading: false })
    }
  },
  loadCategoryStats: async () => {
    try {
      const data = await api.puzzles.categoryStats()
      set({ categoryStats: data ?? null })
    } catch (e) {
      console.error('Failed to load category stats:', e)
    }
  },
  createPuzzle: async (data) => {
    try {
      await api.puzzles.create(data)
      get().loadPuzzles()
    } catch (e) {
      console.error('Failed to create puzzle:', e)
    }
  },
  deletePuzzle: async (id) => {
    try {
      await api.puzzles.delete(id)
      set((s) => ({ puzzles: s.puzzles.filter((p) => Number(p.id) !== id) }))
    } catch (e) {
      console.error('Failed to delete puzzle:', e)
    }
  },
  generateFromGame: async (gameId) => {
    try {
      await api.puzzles.generateFromGame(gameId)
      get().loadPuzzles()
    } catch (e) {
      console.error('Failed to generate puzzles:', e)
    }
  },
  submitAttempt: async (data) => {
    try {
      await api.puzzles.submitAttempt(data)
      if (data.correct) {
        get().markSolved(String(data.puzzle_id))
      }
    } catch (e) {
      console.error('Failed to submit attempt:', e)
    }
  },
}))
