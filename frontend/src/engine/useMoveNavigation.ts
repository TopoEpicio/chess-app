import { useState, useCallback, useEffect } from 'react'

export interface MoveItem {
  move_number: number
  san: string
  fen: string
  is_white: boolean
}

export function useMoveNavigation(moves: MoveItem[]) {
  const [currentIndex, setCurrentIndex] = useState(-1)

  const canPrev = currentIndex > -1
  const canNext = currentIndex < moves.length - 1
  const currentFen = currentIndex >= 0 ? moves[currentIndex]?.fen : undefined

  const goToMove = useCallback((index: number) => {
    if (moves.length === 0) {
      setCurrentIndex(-1)
      return
    }
    setCurrentIndex(Math.max(-1, Math.min(index, moves.length - 1)))
  }, [moves.length])

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, moves.length - 1))
  }, [moves.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(-1, i - 1))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  return { currentIndex, goToMove, goNext, goPrev, canPrev, canNext, currentFen }
}
