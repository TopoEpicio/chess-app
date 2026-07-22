import type { MoveAnalysisData, MoveClassification } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'
import { clsx } from 'clsx'

interface Props {
  moves: MoveAnalysisData[]
  whiteAccuracy: number | null
  blackAccuracy: number | null
  whiteCpl: number | null
  blackCpl: number | null
  whiteCounts: Record<string, number>
  blackCounts: Record<string, number>
}

function accuracyColor(accuracy: number): string {
  if (accuracy >= 90) return '#7c3aed'
  if (accuracy >= 85) return '#16a34a'
  if (accuracy >= 75) return '#4d7c0f'
  if (accuracy >= 65) return '#ca8a04'
  if (accuracy >= 50) return '#ea580c'
  return '#dc2626'
}

function accuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Perfetto'
  if (accuracy >= 85) return 'Eccellente'
  if (accuracy >= 75) return 'Buono'
  if (accuracy >= 65) return 'Discreto'
  if (accuracy >= 50) return 'Mediocre'
  return 'Scarso'
}

const COUNT_ORDER: MoveClassification[] = ['brilliant', 'good', 'inaccuracy', 'mistake', 'blunder']

export function AccuracyMeter({ moves, whiteAccuracy, blackAccuracy, whiteCpl, blackCpl, whiteCounts, blackCounts }: Props) {
  const hasData = whiteAccuracy != null || blackAccuracy != null

  if (!hasData) {
    return (
      <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 text-center text-sm text-sage-500">
        Esegui prima l'analisi della partita per calcolare l'accuratezza.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">
        Accuratezza
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* White */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-sage-500 mb-2">Bianco</div>
          <div
            className="text-4xl font-bold mb-1"
            style={{ color: accuracyColor(whiteAccuracy ?? 0) }}
          >
            {whiteAccuracy ?? '—'}%
          </div>
          <div
            className="text-xs font-medium mb-3"
            style={{ color: accuracyColor(whiteAccuracy ?? 0) }}
          >
            {whiteAccuracy != null ? accuracyLabel(whiteAccuracy) : '—'}
          </div>

          <div className="text-xs text-sage-600 mb-2">
            ACPL: {whiteCpl ?? '—'}
          </div>

          <div className="space-y-0.5">
            {COUNT_ORDER.map(cls => {
              const count = whiteCounts[cls] ?? 0
              const meta = CLASSIFICATION_META[cls]
              if (count === 0) return null
              return (
                <div key={cls} className={clsx('flex items-center justify-center gap-1.5 text-xs px-2 py-0.5 rounded')}>
                  <span className="font-bold" style={{ color: meta.color }}>{meta.symbol || '✓'}</span>
                  <span className="text-sage-700">{count}</span>
                  <span className="text-sage-500">{meta.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Black */}
        <div className="text-center border-l border-sage-100">
          <div className="text-[10px] uppercase tracking-wider text-sage-500 mb-2">Nero</div>
          <div
            className="text-4xl font-bold mb-1"
            style={{ color: accuracyColor(blackAccuracy ?? 0) }}
          >
            {blackAccuracy ?? '—'}%
          </div>
          <div
            className="text-xs font-medium mb-3"
            style={{ color: accuracyColor(blackAccuracy ?? 0) }}
          >
            {blackAccuracy != null ? accuracyLabel(blackAccuracy) : '—'}
          </div>

          <div className="text-xs text-sage-600 mb-2">
            ACPL: {blackCpl ?? '—'}
          </div>

          <div className="space-y-0.5">
            {COUNT_ORDER.map(cls => {
              const count = blackCounts[cls] ?? 0
              const meta = CLASSIFICATION_META[cls]
              if (count === 0) return null
              return (
                <div key={cls} className={clsx('flex items-center justify-center gap-1.5 text-xs px-2 py-0.5 rounded')}>
                  <span className="font-bold" style={{ color: meta.color }}>{meta.symbol || '✓'}</span>
                  <span className="text-sage-700">{count}</span>
                  <span className="text-sage-500">{meta.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Best/worst moves */}
      {moves.length > 0 && (
        <div className="border-t border-sage-100 pt-3 mt-4 grid grid-cols-2 gap-4 text-xs text-sage-600">
          <div>
            Miglior mossa Bianco:{' '}
            {(() => {
              const w = moves.filter(m => m.is_white)
              if (w.length === 0) return 'N/A'
              const best = w.reduce((a, b) => a.eval_swing <= b.eval_swing ? a : b)
              return (
                <span className="font-mono">
                  {best.move_number}.{best.san} (+{(best.eval_swing * 100).toFixed(0)}cp)
                </span>
              )
            })()}
          </div>
          <div>
            Peggior mossa Nero:{' '}
            {(() => {
              const b = moves.filter(m => !m.is_white)
              if (b.length === 0) return 'N/A'
              const worst = b.reduce((a, b2) => a.eval_swing >= b2.eval_swing ? a : b2)
              return (
                <span className="font-mono">
                  {worst.move_number}...{worst.san} (+{(worst.eval_swing * 100).toFixed(0)}cp)
                </span>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}