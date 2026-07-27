import { useState } from 'react'
import type { MoveAnalysisData, MoveClassification } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'
import { clsx } from 'clsx'

interface Props {
  moves: MoveAnalysisData[]
  classificationCounts?: Record<string, number>
  currentIndex: number
  onMoveSelect: (moveIndex: number) => void
}

type FilterMode = 'all' | 'errors' | 'blunders'

function evalDisplay(eval_: number): string {
  if (eval_ === 0) return '0.0'
  return eval_ > 0 ? `+${eval_.toFixed(1)}` : eval_.toFixed(1)
}

export function MoveClassificationTable({ moves, classificationCounts = {}, currentIndex, onMoveSelect }: Props) {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null)

  const pairs: Array<{
    wi: number
    bi?: number
    w: MoveAnalysisData
    b?: MoveAnalysisData
    moveNum: number
  }> = []

  for (let i = 0; i < moves.length; i++) {
    if (moves[i].is_white) {
      const bi = i + 1 < moves.length && !moves[i + 1].is_white ? i + 1 : undefined
      pairs.push({
        wi: i,
        bi,
        w: moves[i],
        b: bi !== undefined ? moves[bi] : undefined,
        moveNum: moves[i].move_number,
      })
    }
  }

  const filteredPairs = filter === 'all'
    ? pairs
    : pairs.filter(p => {
        const wErr = p.w.classification !== 'best' && p.w.classification !== 'excellent' && p.w.classification !== 'good' && p.w.classification !== 'book' && p.w.classification !== 'forced'
        const bErr = p.b && p.b.classification !== 'best' && p.b.classification !== 'excellent' && p.b.classification !== 'good' && p.b.classification !== 'book' && p.b.classification !== 'forced'
        if (filter === 'blunders') return p.w.classification === 'blunder' || p.b?.classification === 'blunder'
        return wErr || bErr
      })

  const [expandWhite, setExpandWhite] = useState<string | null>(null)
  const [expandBlack, setExpandBlack] = useState<string | null>(null)

  const countsByClassification = moves.reduce<Record<string, { white: number; black: number }>>((acc, m) => {
    if (!acc[m.classification]) acc[m.classification] = { white: 0, black: 0 }
    if (m.is_white) acc[m.classification].white++
    else acc[m.classification].black++
    return acc
  }, {})

  const summaryOrder: MoveClassification[] = ['brilliant', 'good', 'inaccuracy', 'mistake', 'blunder']

  function navigateToClassification(classification: string, isWhite: boolean) {
    const startSearch = currentIndex === -1 ? 0 : currentIndex + 1
    for (let i = startSearch; i < moves.length; i++) {
      if (moves[i].classification === classification && moves[i].is_white === isWhite) {
        onMoveSelect(i)
        return
      }
    }
    for (let i = 0; i < currentIndex; i++) {
      if (moves[i].classification === classification && moves[i].is_white === isWhite) {
        onMoveSelect(i)
        return
      }
    }
  }

  return (
    <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-sage-500">
          Mosse
        </div>
        <div className="flex gap-1">
          {(['all', 'errors', 'blunders'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={clsx(
                'px-2 py-1 rounded text-[10px] font-medium transition-colors',
                filter === mode
                  ? 'bg-sage-500 text-white'
                  : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
              )}
            >
              {mode === 'all' ? 'Tutte' : mode === 'errors' ? 'Errori' : 'Blunder'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-0.5 text-sm max-h-80 overflow-y-auto">
        {filteredPairs.length === 0 && (
          <p className="text-sage-500 italic text-center py-4">Nessuna mossa corrisponde al filtro</p>
        )}

        {filteredPairs.map((pair) => {
          const wMeta = CLASSIFICATION_META[pair.w.classification] ?? CLASSIFICATION_META.best
          const bMeta = pair.b ? (CLASSIFICATION_META[pair.b.classification] ?? CLASSIFICATION_META.best) : null
          const isWhiteActive = pair.wi === currentIndex
          const isBlackActive = pair.bi !== undefined && pair.bi === currentIndex

          return (
            <div
              key={pair.wi}
              className="grid grid-cols-[36px_1fr_46px_24px_1fr_46px_24px] gap-1 px-2 py-1.5 rounded hover:bg-sage-50/50"
            >
              <span className="text-sage-500 flex items-center">{pair.moveNum}.</span>

              <div className="relative">
                <span
                  className={clsx(
                    'cursor-pointer font-mono px-1 rounded text-[13px]',
                    isWhiteActive ? 'bg-sage-100 font-semibold ring-1 ring-sage-300' : 'hover:bg-sage-50',
                    wMeta.label !== 'Miglior mossa' && `border-l-2`,
                  )}
                  style={{ borderLeftColor: wMeta.color, borderLeftStyle: wMeta.label !== 'Miglior mossa' ? 'solid' : 'none', borderLeftWidth: wMeta.label !== 'Miglior mossa' ? 2 : 0 }}
                  onClick={() => onMoveSelect(pair.wi)}
                  onMouseEnter={() => setTooltipIdx(pair.wi)}
                  onMouseLeave={() => setTooltipIdx(null)}
                >
                  {pair.w.san}
                </span>

                {tooltipIdx === pair.wi && pair.w.best_move_san !== pair.w.san && (
                  <div className="absolute z-10 left-0 -bottom-10 bg-[#302e2b] text-white text-[11px] px-3 py-1.5 rounded whitespace-nowrap pointer-events-none">
                    Best: {pair.w.best_move_san} ({evalDisplay(pair.w.best_eval)})
                  </div>
                )}
              </div>

              <span className="text-[11px] text-sage-500 font-mono flex items-center">{evalDisplay(pair.w.played_eval)}</span>

              <span className="flex items-center justify-center" style={{ color: wMeta.color }}>
                <span className={clsx('text-[10px]', wMeta.symbol ? 'font-bold' : 'text-sage-300')}>
                  {wMeta.symbol || '•'}
                </span>
              </span>

              {pair.b ? (
                <>
                  <div className="relative">
                    <span
                      className={clsx(
                        'cursor-pointer font-mono px-1 rounded text-[13px]',
                        isBlackActive ? 'bg-sage-100 font-semibold ring-1 ring-sage-300' : 'hover:bg-sage-50',
                        bMeta!.label !== 'Miglior mossa' && `border-l-2`,
                      )}
                      style={{ borderLeftColor: bMeta!.color, borderLeftStyle: bMeta!.label !== 'Miglior mossa' ? 'solid' : 'none', borderLeftWidth: bMeta!.label !== 'Miglior mossa' ? 2 : 0 }}
                      onClick={() => onMoveSelect(pair.bi!)}
                      onMouseEnter={() => setTooltipIdx(pair.bi!)}
                      onMouseLeave={() => setTooltipIdx(null)}
                    >
                      {pair.b.san}
                    </span>
                    {tooltipIdx === pair.bi && pair.b.best_move_san !== pair.b.san && (
                      <div className="absolute z-10 left-0 -bottom-10 bg-[#302e2b] text-white text-[11px] px-3 py-1.5 rounded whitespace-nowrap pointer-events-none">
                        Best: {pair.b.best_move_san} ({evalDisplay(pair.b.best_eval)})
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-sage-500 font-mono flex items-center">{evalDisplay(pair.b.played_eval)}</span>
                  <span className="flex items-center justify-center" style={{ color: bMeta!.color }}>
                    <span className={clsx('text-[10px]', bMeta!.symbol ? 'font-bold' : 'text-sage-300')}>
                      {bMeta!.symbol || '•'}
                    </span>
                  </span>
                </>
              ) : (
                <><span /><span /><span /></>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="border-t border-sage-100 pt-3 mt-3">
        <div className="flex flex-wrap gap-2 text-[11px]">
          {summaryOrder.map(cls => {
            const meta = CLASSIFICATION_META[cls]
            const count = classificationCounts[cls] ?? 0
            if (count === 0 && cls !== 'good') return null
            const cc = countsByClassification[cls]
            const whiteCount = cc?.white ?? 0
            const blackCount = cc?.black ?? 0
            return (
              <div key={cls} className="flex items-center gap-1 px-2 py-1 rounded-full bg-sage-50">
                <span className="font-bold" style={{ color: meta.color }}>{meta.symbol || '✓'}</span>
                {whiteCount > 0 && (
                  <button
                    onClick={() => navigateToClassification(cls, true)}
                    className="text-sage-700 hover:text-emerald-600 hover:underline cursor-pointer"
                    title={`Vai alla prima ${meta.label.toLowerCase()} del bianco`}
                  >
                    {whiteCount}W
                  </button>
                )}
                {blackCount > 0 && (
                  <button
                    onClick={() => navigateToClassification(cls, false)}
                    className="text-sage-700 hover:text-red-600 hover:underline cursor-pointer"
                    title={`Vai alla prima ${meta.label.toLowerCase()} del nero`}
                  >
                    {blackCount}B
                  </button>
                )}
                <span className="text-sage-500">{meta.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}