import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMoveNavigation, type MoveItem } from '../useMoveNavigation'

const sampleMoves: MoveItem[] = [
  { move_number: 1, san: 'e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', is_white: true },
  { move_number: 1, san: 'e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', is_white: false },
  { move_number: 2, san: 'Nf3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', is_white: true },
]

describe('useMoveNavigation', () => {
  it('starts at index -1 (before first move)', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(true)
  })

  it('goNext advances one move', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    act(() => result.current.goNext())
    expect(result.current.currentIndex).toBe(0)
    expect(result.current.canPrev).toBe(true)
  })

  it('goPrev goes back', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    act(() => result.current.goNext())
    act(() => result.current.goNext())
    act(() => result.current.goPrev())
    expect(result.current.currentIndex).toBe(0)
  })

  it('goToMove jumps to specific index', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    act(() => result.current.goToMove(2))
    expect(result.current.currentIndex).toBe(2)
    expect(result.current.canNext).toBe(false)
  })

  it('goToMove(-1) resets to before first move', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    act(() => result.current.goToMove(1))
    act(() => result.current.goToMove(-1))
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.canPrev).toBe(false)
  })

  it('handles empty moves list', () => {
    const { result } = renderHook(() => useMoveNavigation([]))
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(false)
  })

  it('currentFen returns undefined at start', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    expect(result.current.currentFen).toBeUndefined()
  })

  it('currentFen returns fen at current index', () => {
    const { result } = renderHook(() => useMoveNavigation(sampleMoves))
    act(() => result.current.goToMove(1))
    expect(result.current.currentFen).toBe(sampleMoves[1].fen)
  })
})
