import { RotateCw } from 'lucide-react'

interface PanelToolbarProps {
  currentIndex: number
  totalMoves: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  boardFlipped: boolean
  onFlip: () => void
}

export function PanelToolbar({
  currentIndex,
  totalMoves,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onFlip,
}: PanelToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            canPrev ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
          }`}
        >
          &larr; Precedente
        </button>
        <span className="text-sm text-sage-700">
          {currentIndex + 1} / {totalMoves}
        </span>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            canNext ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
          }`}
        >
          Successiva &rarr;
        </button>
      </div>
      <button
        onClick={onFlip}
        className="px-3 py-1 rounded-box text-sm font-medium transition-colors bg-sage-100 hover:bg-sage-200"
        title="Capovolgi scacchiera"
      >
        <RotateCw size={16} className="inline-block" />
      </button>
    </div>
  )
}
