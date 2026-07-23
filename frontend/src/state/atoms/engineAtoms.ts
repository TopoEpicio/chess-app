import { atom } from 'jotai'
import type { PositionEval, GameEval } from '../../types/eval'
import type { ArrowConfig } from '../../types/analysis'
import { DEFAULT_ARROW_CONFIG } from '../../types/analysis'

export type EngineStatus = 'idle' | 'analyzing' | 'completed' | 'error'

export const engineStatusAtom = atom<EngineStatus>('idle')
export const engineErrorAtom = atom<string | null>(null)

export const gameAnalysisProgressAtom = atom<number>(0)
export const gameAnalysisResultsAtom = atom<GameEval | null>(null)

export const positionEvaluationAtom = atom<PositionEval | null>(null)
export const positionAnalysisProgressAtom = atom<number>(0)
export const engineBestMoveAtom = atom<string | undefined>(undefined)

export const engineDepthAtom = atom<number>(16)
export const engineMultiPvAtom = atom<number>(3)
export const engineSkillLevelAtom = atom<number>(20)
export const arrowConfigAtom = atom<ArrowConfig>(DEFAULT_ARROW_CONFIG)

export const setEngineStatusAtom = atom(null, (get, set, status: EngineStatus) => {
  set(engineStatusAtom, status)
})

export const setEngineErrorAtom = atom(null, (get, set, error: string | null) => {
  set(engineErrorAtom, error)
})

export const setGameAnalysisProgressAtom = atom(null, (get, set, progress: number) => {
  set(gameAnalysisProgressAtom, Math.max(0, Math.min(100, progress)))
})

export const setGameAnalysisResultsAtom = atom(null, (get, set, results: GameEval | null) => {
  set(gameAnalysisResultsAtom, results)
  if (results !== null) {
    set(gameAnalysisProgressAtom, 100)
  }
})

export const setPositionEvaluationAtom = atom(null, (get, set, evaluation: PositionEval | null) => {
  set(positionEvaluationAtom, evaluation)
})

export const setPositionAnalysisProgressAtom = atom(null, (get, set, progress: number) => {
  set(positionAnalysisProgressAtom, Math.max(0, Math.min(100, progress)))
})

export const setEngineBestMoveAtom = atom(null, (get, set, move: string | undefined) => {
  set(engineBestMoveAtom, move)
})

export const resetGameAnalysisAtom = atom(null, (get, set) => {
  set(gameAnalysisProgressAtom, 0)
  set(gameAnalysisResultsAtom, null)
  set(engineStatusAtom, 'idle')
  set(engineErrorAtom, null)
})

export const resetPositionAnalysisAtom = atom(null, (get, set) => {
  set(positionEvaluationAtom, null)
  set(positionAnalysisProgressAtom, 0)
  set(engineBestMoveAtom, undefined)
})
