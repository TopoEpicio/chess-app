import { useTranslation } from 'react-i18next'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

interface Props {
  fen: string
  boardOrientation: 'white' | 'black'
  moveHistory: string[]
  currentMoveIdx: number
  onPrev: () => void
  onNext: () => void
  onReset: () => void
}

export function OpeningTrainerBoard({
  fen,
  boardOrientation,
  moveHistory,
  currentMoveIdx,
  onPrev,
  onNext,
  onReset,
}: Props) {
  const { t } = useTranslation()
  const game = new Chess(fen)
  moveHistory.slice(0, currentMoveIdx + 1).forEach((m) => {
    try { game.move(m) } catch { /* ignore */ }
  })

  const atStart = currentMoveIdx < 0
  const atEnd = currentMoveIdx >= moveHistory.length - 1
  const plyDisplay = currentMoveIdx + 1

  return (
    <div className="space-y-3">
      <div className="aspect-square max-w-[400px] mx-auto">
        <Chessboard
          id="opening-trainer"
          position={game.fen()}
          boardOrientation={boardOrientation}
          boardWidth={400}
          arePiecesDraggable={false}
          animationDuration={200}
        />
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onPrev}
          disabled={atStart}
          className="btn-ghost p-2 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-sage-600 font-mono min-w-[6ch] text-center">
          {atStart ? '—' : `${Math.ceil(plyDisplay / 2)}.${plyDisplay % 2 === 1 ? ' ' : '..'}`}
        </span>
        <button
          onClick={onNext}
          disabled={atEnd}
          className="btn-ghost p-2 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onReset}
          className="btn-ghost p-2 text-sage-400"
          title={t('studio.trainer.reset')}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}
