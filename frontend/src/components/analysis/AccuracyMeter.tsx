import { useTranslation } from 'react-i18next'
import type { MoveAnalysisData, MoveClassification } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'
import { clsx } from 'clsx'

function accuracyColor(accuracy: number): string {
  if (accuracy >= 90) return 'var(--color-primary)'
  if (accuracy >= 85) return 'var(--color-success)'
  if (accuracy >= 75) return 'var(--color-success)'
  if (accuracy >= 65) return 'var(--color-warning)'
  if (accuracy >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

function accuracyLabel(accuracy: number, t: (key: string) => string): string {
  if (accuracy >= 90) return t('analysis.accuracyLabel.perfect')
  if (accuracy >= 85) return t('analysis.accuracyLabel.excellent')
  if (accuracy >= 75) return t('analysis.accuracyLabel.good')
  if (accuracy >= 65) return t('analysis.accuracyLabel.fair')
  if (accuracy >= 50) return t('analysis.accuracyLabel.mediocre')
  return t('analysis.accuracyLabel.poor')
}

export function AccuracyMeter({ moves, whiteAccuracy, blackAccuracy, whiteCpl, blackCpl, whiteCounts, blackCounts }: Props) {
  const { t } = useTranslation('common')
  const hasData = whiteAccuracy != null || blackAccuracy != null

  if (!hasData) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 text-center text-sm text-[var(--color-text-muted)]">
        {t('analysis.noData')}
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
        {t('analysis.accuracy')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* White */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">{t('analysis.white')}</div>
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
            {whiteAccuracy != null ? accuracyLabel(whiteAccuracy, t) : '—'}
          </div>

          <div className="text-xs text-[var(--color-text-secondary)] mb-2">
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
                  <span className="text-[var(--color-text-secondary)]">{count}</span>
                  <span className="text-[var(--color-text-muted)]">{t(`analysis.cls.${cls}`)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Black */}
        <div className="text-center border-l border-[var(--color-border)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">{t('analysis.black')}</div>
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
            {blackAccuracy != null ? accuracyLabel(blackAccuracy, t) : '—'}
          </div>

          <div className="text-xs text-[var(--color-text-secondary)] mb-2">
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
                  <span className="text-[var(--color-text-secondary)]">{count}</span>
                  <span className="text-[var(--color-text-muted)]">{t(`analysis.cls.${cls}`)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Best/worst moves */}
      {moves.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-3 mt-4 grid grid-cols-2 gap-4 text-xs text-[var(--color-text-secondary)]">
          <div>
            {t('analysis.bestMoveWhiteLabel')} {' '}
            {(() => {
              const w = moves.filter(m => m.is_white)
              if (w.length === 0) return t('analysis.na')
              const best = w.reduce((a, b) => a.eval_swing <= b.eval_swing ? a : b)
              return (
                <span className="font-mono">
                  {best.move_number}.{best.san} (+{(best.eval_swing * 100).toFixed(0)}cp)
                </span>
              )
            })()}
          </div>
          <div>
            {t('analysis.bestMoveBlackLabel')} {' '}
            {(() => {
              const b = moves.filter(m => !m.is_white)
              if (b.length === 0) return t('analysis.na')
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

interface Props {
  moves: MoveAnalysisData[]
  whiteAccuracy: number | null
  blackAccuracy: number | null
  whiteCpl: number | null
  blackCpl: number | null
  whiteCounts: Record<string, number>
  blackCounts: Record<string, number>
}

const COUNT_ORDER: MoveClassification[] = ['brilliant', 'good', 'inaccuracy', 'mistake', 'blunder']
