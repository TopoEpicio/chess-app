import { useTranslation } from 'react-i18next'
import { CoachCard } from './CoachCard'
import type { AnalysisExplanation } from '../../types/analysis'
import { Crosshair, RotateCw, AlertTriangle, Zap, Lightbulb, Circle } from 'lucide-react'

interface Props {
  analysis: AnalysisExplanation | null
  engineReady: boolean
}

function EvalTag({ value, mate }: { value: number; mate: number | null }) {
  const display = mate !== null
    ? `M${Math.abs(mate)}`
    : `${value > 0 ? '+' : ''}${value.toFixed(2)}`
  const color = mate !== null
    ? (mate > 0 ? 'text-green-line' : 'text-red-line')
    : (value > 0.5 ? 'text-green-line' : value < -0.5 ? 'text-red-line' : 'text-[var(--color-text-secondary)]')
  return (
    <span className={`font-mono font-bold text-sm ${color}`}>{display}</span>
  )
}

export function EducationalPanel({ analysis, engineReady }: Props) {
  const { t } = useTranslation('common')

  if (!engineReady) {
    return (
      <div className="bg-[var(--color-surface)] rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
        <p className="text-sm text-[var(--color-text-muted)] italic">{t('analysis.loadingEngine')}</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-[var(--color-surface)] rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
        <p className="text-sm text-[var(--color-text-muted)] italic">{t('analysis.navigateToPosition')}</p>
      </div>
    )
  }

  const isCritical = analysis.tacticalPatterns.some(p => p.severity === 'critical')
  const isWarning = analysis.tacticalPatterns.some(p => p.severity === 'warning')

  return (
    <div className="space-y-3">
      <CoachCard
        icon={<Crosshair size={18} />}
        title={t('analysis.recommendedMove')}
        variant={isCritical ? 'error' : 'success'}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">{analysis.topMove.san}</span>
            <EvalTag value={analysis.topMove.evaluation} mate={analysis.topMove.mate} />
          </div>
          <p className="text-[var(--color-text-secondary)]">{analysis.topMove.explanation}</p>
          {analysis.topMove.followUp && (
            <div className="bg-[var(--color-surface-hover)] rounded p-2 font-mono text-xs text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-muted)] font-semibold text-[10px] uppercase tracking-wider">{t('analysis.followUp')} </span>
              {analysis.topMove.san} {analysis.topMove.followUp}
            </div>
          )}
        </div>
      </CoachCard>

      {analysis.alternatives.length > 0 && (
        <CoachCard icon={<RotateCw size={18} />} title={t('analysis.validAlternatives')}>
          <div className="space-y-2">
            {analysis.alternatives.map((alt, i) => (
              <div key={i} className="pb-2 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-semibold">{alt.san}</span>
                  <EvalTag value={alt.evaluation} mate={alt.mate} />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{alt.whyWorse}</p>
              </div>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.threats.length > 0 && (
        <CoachCard
          icon={<AlertTriangle size={18} />}
          title={t('analysis.opponentThreat_other', { count: analysis.threats.length })}
          variant="warning"
        >
          <div className="space-y-1">
            {analysis.threats.map((t, i) => (
              <p key={i} className="text-[var(--color-text-secondary)]">
                <span className="font-mono font-semibold">{t.moveSan}</span> — {t.description}
              </p>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.tacticalPatterns.length > 0 && (
        <CoachCard
          icon={<Zap size={18} />}
          title={t('analysis.tacticalPatterns')}
          variant={isCritical ? 'error' : isWarning ? 'warning' : 'default'}
        >
          <div className="space-y-1.5">
            {analysis.tacticalPatterns.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex items-center">
                  {p.severity === 'critical'
                    ? <Circle size={10} fill="var(--color-danger)" color="var(--color-danger)" />
                    : p.severity === 'warning'
                    ? <Circle size={10} fill="var(--color-warning)" color="var(--color-warning)" />
                    : <Circle size={10} fill="var(--color-success)" color="var(--color-success)" />}
                </span>
                <p className="text-xs text-[var(--color-text-secondary)]">{p.description}</p>
              </div>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.keyConcepts.length > 0 && (
        <CoachCard icon={<Lightbulb size={18} />} title={t('analysis.keyConcepts')}>
          <ul className="space-y-1 list-disc list-inside">
            {analysis.keyConcepts.map((c, i) => (
              <li key={i} className="text-xs text-[var(--color-text-secondary)]">{c}</li>
            ))}
          </ul>
        </CoachCard>
      )}
    </div>
  )
}
