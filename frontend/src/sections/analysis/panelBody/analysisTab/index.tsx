import { useTranslation } from 'react-i18next'

interface AnalysisTabProps {
  onStartAnalysis: () => void
  canStart: boolean
  onSaveAnalysis: () => void
  hasGameResult: boolean
  whiteAccuracy: number | null
  blackAccuracy: number | null
  movesCount: number
  status: string
}

export function AnalysisTab({
  onStartAnalysis,
  canStart,
  onSaveAnalysis,
  hasGameResult,
  whiteAccuracy,
  blackAccuracy,
  movesCount,
  status,
}: AnalysisTabProps) {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-4">
      <div className="text-center">
        <button
          onClick={onStartAnalysis}
          disabled={!canStart}
          className="btn-primary px-4 py-2 rounded text-sm"
        >
          {t('analysis.analyzeGame')}
        </button>
        {hasGameResult && (
          <button onClick={onSaveAnalysis} className="btn-ghost px-4 py-2 rounded text-sm">
            {t('analysis.saved')}
          </button>
        )}
      </div>
      {hasGameResult && (
        <div className="text-sm text-[var(--color-text-secondary)] space-y-2 bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
          <div><strong>{t('analysis.whiteAccuracy')}:</strong> {whiteAccuracy?.toFixed(1) ?? t('analysis.na')}%</div>
          <div><strong>{t('analysis.blackAccuracy')}:</strong> {blackAccuracy?.toFixed(1) ?? t('analysis.na')}%</div>
          <div><strong>{t('analysis.totalMoves')}:</strong> {movesCount}</div>
          <div><strong>{t('play.status')}:</strong> {status}</div>
        </div>
      )}
    </div>
  )
}
