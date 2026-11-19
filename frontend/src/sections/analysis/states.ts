import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { PositionEval, GameEval, CurrentPosition, SavedEvals } from '../../types/eval'
import type { MoveItem } from '../../engine/useMoveNavigation'
import { Chess } from 'chess.js'

/** Engine status for game analysis */
export type EngineStatus = 'idle' | 'analyzing' | 'completed' | 'error'

/** Game analysis atoms */
export const gameEvalAtom = atom<GameEval | undefined>(undefined)
export const gameAtom = atom(new Chess())
export const boardAtom = atom(new Chess())
export const currentPositionAtom = atom<CurrentPosition>({
  fen: new Chess().fen(),
})

export const boardOrientationAtom = atom<boolean>(true)
export const showBestMoveArrowAtom = atom<boolean>(true)
export const showPlayerMoveIconAtom = atom<boolean>(true)

export const engineDepthAtom = atom<number>(16)
export const engineMultiPvAtom = atom<number>(3)
export const engineWorkersNbAtom = atomWithStorage('engineWorkersNb', 2)
export const evaluationProgressAtom = atom<number>(0)

export const savedEvalsAtom = atom<SavedEvals>({})

export const selectedTabAtom = atom<'summary' | 'moves'>('summary')

/** Moves and navigation atoms (derived from gameAtoms) */
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

/** Game analysis status and progress */
export const engineStatusAtom = atom<EngineStatus>('idle')
export const engineErrorAtom = atom<string | null>(null)
export const gameAnalysisProgressAtom = atom<number>(0)
export const gameAnalysisResultsAtom = atom<GameEval | null>(null)

/** Position analysis status and progress */
export const positionEvaluationAtom = atom<PositionEval | null>(null)
export const positionAnalysisProgressAtom = atom<number>(0)
export const engineBestMoveAtom = atom<string | undefined>(undefined)

/** Write-only atoms for updating state */
export const setEngineStatusAtom = atom(null, (_get, set, status: EngineStatus) => {
  set(engineStatusAtom, status)
})

export const setEngineErrorAtom = atom(null, (_get, set, error: string | null) => {
  set(engineErrorAtom as any, error)
})

export const setGameAnalysisProgressAtom = atom(null, (_get, set, progress: number) => {
  set(gameAnalysisProgressAtom, Math.max(0, Math.min(100, progress)))
})

export const setGameAnalysisResultsAtom = atom(null, (_get, set, results: GameEval | null) => {
  set(gameAnalysisResultsAtom as any, results)
  if (results !== null) {
    set(gameAnalysisProgressAtom, 100)
  }
})

export const setPositionEvaluationAtom = atom(null, (_get, set, evaluation: PositionEval | null) => {
  set(positionEvaluationAtom as any, evaluation)
})

export const setPositionAnalysisProgressAtom = atom(null, (_get, set, progress: number) => {
  set(positionAnalysisProgressAtom, Math.max(0, Math.min(100, progress)))
})

export const setEngineBestMoveAtom = atom(null, (_get, set, move: string | undefined) => {
  set(engineBestMoveAtom as any, move)
})

export const resetGameAnalysisAtom = atom(null, (_get, set) => {
  set(gameAnalysisProgressAtom, 0)
  set(gameAnalysisResultsAtom as any, null)
  set(engineStatusAtom, 'idle')
  set(engineErrorAtom as any, null)
})

export const resetPositionAnalysisAtom = atom(null, (_get, set) => {
  set(positionEvaluationAtom as any, null)
  set(positionAnalysisProgressAtom, 0)
  set(engineBestMoveAtom as any, undefined)
})
