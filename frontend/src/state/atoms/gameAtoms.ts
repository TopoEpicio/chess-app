import { atom } from 'jotai'
import type { MoveItem } from '../../engine/useMoveNavigation'

export const movesAtom = atom<MoveItem[]>([])

export const currentIndexAtom = atom<number>(-1)

export const currentFenAtom = atom<string | undefined>((get) => {
  const moves = get(movesAtom)
  const currentIndex = get(currentIndexAtom)
  return currentIndex >= 0 && currentIndex < moves.length
    ? moves[currentIndex].fen
    : undefined
})

export const canPrevAtom = atom<boolean>((get) => {
  return get(currentIndexAtom) > -1
})

export const canNextAtom = atom<boolean>((get) => {
  const moves = get(movesAtom)
  const currentIndex = get(currentIndexAtom)
  return moves.length > 0 && currentIndex < moves.length - 1
})

export const setMovesAtom = atom(null, (get, set, newMoves: MoveItem[]) => {
  set(movesAtom, newMoves)
  set(currentIndexAtom, newMoves.length > 0 ? newMoves.length - 1 : -1)
})

export const goToMoveAtom = atom(null, (get, set, index: number) => {
  const moves = get(movesAtom)
  if (moves.length === 0) {
    set(currentIndexAtom, -1)
    return
  }
  set(currentIndexAtom, Math.max(-1, Math.min(index, moves.length - 1)))
})

export const goNextAtom = atom(null, (get, set) => {
  const moves = get(movesAtom)
  const currentIndex = get(currentIndexAtom)
  set(currentIndexAtom, Math.min(currentIndex + 1, moves.length - 1))
})

export const goPrevAtom = atom(null, (get, set) => {
  const currentIndex = get(currentIndexAtom)
  set(currentIndexAtom, Math.max(-1, currentIndex - 1))
})
