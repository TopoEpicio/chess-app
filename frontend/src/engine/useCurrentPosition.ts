import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import {
  movesAtom,
  currentIndexAtom,
  currentFenAtom,
  canPrevAtom,
  canNextAtom,
  goToMoveAtom,
  goNextAtom,
  goPrevAtom,
} from '../state/atoms/gameAtoms'
import {
  positionEvaluationAtom,
  positionAnalysisProgressAtom,
  engineBestMoveAtom,
} from '../state/atoms/engineAtoms'

export function useCurrentPosition() {
  const [moves] = useAtom(movesAtom)
  const [currentIndex] = useAtom(currentIndexAtom)
  const [currentFen] = useAtom(currentFenAtom)
  const [canPrev] = useAtom(canPrevAtom)
  const [canNext] = useAtom(canNextAtom)

  const [positionEvaluation] = useAtom(positionEvaluationAtom)
  const [analysisProgress] = useAtom(positionAnalysisProgressAtom)
  const [bestMove] = useAtom(engineBestMoveAtom)

  const goToMove = useSetAtom(goToMoveAtom)
  const goNext = useSetAtom(goNextAtom)
  const goPrev = useSetAtom(goPrevAtom)

  return {
    moves,
    currentIndex,
    currentFen,
    canPrev,
    canNext,
    positionEvaluation,
    analysisProgress,
    bestMove,
    goToMove,
    goNext,
    goPrev,
  }
}
