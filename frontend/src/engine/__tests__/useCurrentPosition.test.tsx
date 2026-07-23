import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { useCurrentPosition } from '../useCurrentPosition'
import {
  movesAtom,
  currentIndexAtom,
  setMovesAtom,
  goToMoveAtom,
} from '../../state/atoms/gameAtoms'
import {
  setPositionEvaluationAtom,
  setPositionAnalysisProgressAtom,
  setEngineBestMoveAtom,
} from '../../state/atoms/engineAtoms'
import type { MoveItem } from '../useMoveNavigation'
import type { PositionEval } from '../../types/eval'

const sampleMoves: MoveItem[] = [
  { move_number: 1, san: 'e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', is_white: true },
  { move_number: 1, san: 'e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', is_white: false },
]

const samplePositionEval: PositionEval = {
  lines: [
    { pv: ['e2e4', 'e7e5'], depth: 18, multiPv: 1, cp: 20 },
  ],
}

function renderUseCurrentPosition(store: ReturnType<typeof createStore>) {
  return renderHook(() => useCurrentPosition(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  })
}

describe('useCurrentPosition', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
  })

  it('returns default game state with no moves', () => {
    const { result } = renderUseCurrentPosition(store)
    expect(result.current.moves).toEqual([])
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.currentFen).toBeUndefined()
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(false)
  })

  it('returns game state from atoms', () => {
    store.set(setMovesAtom, sampleMoves)
    store.set(goToMoveAtom, 1)
    const { result } = renderUseCurrentPosition(store)
    expect(result.current.moves).toBe(sampleMoves)
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.currentFen).toBe(sampleMoves[1].fen)
    expect(result.current.canPrev).toBe(true)
    expect(result.current.canNext).toBe(false)
  })

  it('returns engine state from atoms', () => {
    store.set(setPositionEvaluationAtom, samplePositionEval)
    store.set(setPositionAnalysisProgressAtom, 75)
    store.set(setEngineBestMoveAtom, 'e2e4')
    const { result } = renderUseCurrentPosition(store)
    expect(result.current.positionEvaluation).toBe(samplePositionEval)
    expect(result.current.analysisProgress).toBe(75)
    expect(result.current.bestMove).toBe('e2e4')
  })

  it('goToMove dispatches to goToMoveAtom', () => {
    store.set(setMovesAtom, sampleMoves)
    const { result } = renderUseCurrentPosition(store)
    act(() => result.current.goToMove(0))
    expect(store.get(currentIndexAtom)).toBe(0)
  })

  it('goNext dispatches to goNextAtom', () => {
    store.set(setMovesAtom, sampleMoves)
    store.set(goToMoveAtom, 0)
    const { result } = renderUseCurrentPosition(store)
    act(() => result.current.goNext())
    expect(store.get(currentIndexAtom)).toBe(1)
  })

  it('goPrev dispatches to goPrevAtom', () => {
    store.set(setMovesAtom, sampleMoves)
    store.set(goToMoveAtom, 1)
    const { result } = renderUseCurrentPosition(store)
    act(() => result.current.goPrev())
    expect(store.get(currentIndexAtom)).toBe(0)
  })
})
