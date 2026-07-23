import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStore, createStore } from 'jotai'
import {
  movesAtom,
  currentIndexAtom,
  currentFenAtom,
  canPrevAtom,
  canNextAtom,
  setMovesAtom,
  goToMoveAtom,
  goNextAtom,
  goPrevAtom,
} from '../gameAtoms'
import type { MoveItem } from '../../engine/useMoveNavigation'

const sampleMoves: MoveItem[] = [
  { move_number: 1, san: 'e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', is_white: true },
  { move_number: 1, san: 'e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', is_white: false },
  { move_number: 2, san: 'Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', is_white: true },
]

function renderAtomValue<T>(atom: any) {
  const store = createStore()
  return renderHook(() => useAtomValue(atom, { store }))
}

function renderAtom<T>(atom: any) {
  const store = createStore()
  return renderHook(() => useAtom(atom, { store }))
}

describe('gameAtoms', () => {
  describe('movesAtom', () => {
    it('starts as empty array', () => {
      const { result } = renderAtomValue(movesAtom)
      expect(result.current).toEqual([])
    })
  })

  describe('currentIndexAtom', () => {
    it('starts at -1', () => {
      const { result } = renderAtomValue(currentIndexAtom)
      expect(result.current).toBe(-1)
    })
  })

  describe('currentFenAtom', () => {
    it('returns undefined when no moves loaded', () => {
      const { result } = renderAtomValue(currentFenAtom)
      expect(result.current).toBeUndefined()
    })

    it('returns undefined at index -1 even with moves', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, -1)
      const { result } = renderHook(() => useAtomValue(currentFenAtom, { store }))
      expect(result.current).toBeUndefined()
    })

    it('returns fen at current index', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, 1)
      const { result } = renderHook(() => useAtomValue(currentFenAtom, { store }))
      expect(result.current).toBe(sampleMoves[1].fen)
    })
  })

  describe('canPrevAtom', () => {
    it('returns false at index -1', () => {
      const { result } = renderAtomValue(canPrevAtom)
      expect(result.current).toBe(false)
    })

    it('returns true when index > -1', () => {
      const store = createStore()
      store.set(currentIndexAtom, 0)
      const { result } = renderHook(() => useAtomValue(canPrevAtom, { store }))
      expect(result.current).toBe(true)
    })
  })

  describe('canNextAtom', () => {
    it('returns true when moves exist and at index -1', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      const { result } = renderHook(() => useAtomValue(canNextAtom, { store }))
      expect(result.current).toBe(true)
    })

    it('returns false at last move', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, 2)
      const { result } = renderHook(() => useAtomValue(canNextAtom, { store }))
      expect(result.current).toBe(false)
    })

    it('returns false with empty moves', () => {
      const { result } = renderAtomValue(canNextAtom)
      expect(result.current).toBe(false)
    })
  })

  describe('setMovesAtom', () => {
    it('sets moves and resets index to last', () => {
      const store = createStore()
      store.set(movesAtom, [])
      store.set(currentIndexAtom, -1)
      store.set(setMovesAtom, sampleMoves)
      expect(store.get(movesAtom)).toBe(sampleMoves)
      expect(store.get(currentIndexAtom)).toBe(sampleMoves.length - 1)
    })
  })

  describe('goToMoveAtom', () => {
    it('navigates to valid index', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(goToMoveAtom, 1)
      expect(store.get(currentIndexAtom)).toBe(1)
    })

    it('clamps to -1 for invalid index', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(goToMoveAtom, -5)
      expect(store.get(currentIndexAtom)).toBe(-1)
    })

    it('clamps to last index when overshooting', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(goToMoveAtom, 100)
      expect(store.get(currentIndexAtom)).toBe(2)
    })

    it('resets to -1 with empty moves', () => {
      const store = createStore()
      store.set(movesAtom, [])
      store.set(goToMoveAtom, 0)
      expect(store.get(currentIndexAtom)).toBe(-1)
    })
  })

  describe('goNextAtom', () => {
    it('advances one step', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, 0)
      store.set(goNextAtom)
      expect(store.get(currentIndexAtom)).toBe(1)
    })

    it('stays at last index', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, 2)
      store.set(goNextAtom)
      expect(store.get(currentIndexAtom)).toBe(2)
    })
  })

  describe('goPrevAtom', () => {
    it('goes back one step', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, 1)
      store.set(goPrevAtom)
      expect(store.get(currentIndexAtom)).toBe(0)
    })

    it('stays at -1', () => {
      const store = createStore()
      store.set(movesAtom, sampleMoves)
      store.set(currentIndexAtom, -1)
      store.set(goPrevAtom)
      expect(store.get(currentIndexAtom)).toBe(-1)
    })
  })
})
