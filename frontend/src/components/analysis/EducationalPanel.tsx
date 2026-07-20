import { CoachCard } from './CoachCard'
import type { AnalysisExplanation } from '../../types/analysis'

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
    : (value > 0.5 ? 'text-green-line' : value < -0.5 ? 'text-red-line' : 'text-sage-600')
  return (
    <span className={`font-mono font-bold text-sm ${color}`}>{display}</span>
  )
}

export function EducationalPanel({ analysis, engineReady }: Props) {
  if (!engineReady) {
    return (
      <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
        <p className="text-sm text-sage-500 italic">Stockfish in caricamento...</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
        <p className="text-sm text-sage-500 italic">
          Naviga su una posizione per vedere l'analisi del coach.
        </p>
      </div>
    )
  }

  const isCritical = analysis.tacticalPatterns.some(p => p.severity === 'critical')
  const isWarning = analysis.tacticalPatterns.some(p => p.severity === 'warning')

  return (
    <div className="space-y-3">
      <CoachCard
        icon="🎯"
        title="Mossa consigliata"
        variant={isCritical ? 'error' : 'success'}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">{analysis.topMove.san}</span>
            <EvalTag value={analysis.topMove.evaluation} mate={analysis.topMove.mate} />
          </div>
          <p className="text-sage-700">{analysis.topMove.explanation}</p>
          {analysis.topMove.followUp && (
            <div className="bg-sage-50 rounded p-2 font-mono text-xs text-sage-700">
              <span className="text-sage-500 font-semibold text-[10px] uppercase tracking-wider">Follow-up: </span>
              {analysis.topMove.san} {analysis.topMove.followUp}
            </div>
          )}
        </div>
      </CoachCard>

      {analysis.alternatives.length > 0 && (
        <CoachCard icon="🔄" title="Alternative valide">
          <div className="space-y-2">
            {analysis.alternatives.map((alt, i) => (
              <div key={i} className="pb-2 border-b border-sage-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-semibold">{alt.san}</span>
                  <EvalTag value={alt.evaluation} mate={alt.mate} />
                </div>
                <p className="text-xs text-sage-600">{alt.whyWorse}</p>
              </div>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.threats.length > 0 && (
        <CoachCard
          icon="⚠️"
          title={analysis.threats.length === 1 ? 'Minaccia avversaria' : 'Minacce avversarie'}
          variant="warning"
        >
          <div className="space-y-1">
            {analysis.threats.map((t, i) => (
              <p key={i} className="text-sage-700">
                <span className="font-mono font-semibold">{t.moveSan}</span> — {t.description}
              </p>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.tacticalPatterns.length > 0 && (
        <CoachCard
          icon="⚡"
          title="Pattern tattici"
          variant={isCritical ? 'error' : isWarning ? 'warning' : 'default'}
        >
          <div className="space-y-1.5">
            {analysis.tacticalPatterns.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-xs leading-none">
                  {p.severity === 'critical' ? '🔴' : p.severity === 'warning' ? '🟡' : '🟢'}
                </span>
                <p className="text-xs text-sage-700">{p.description}</p>
              </div>
            ))}
          </div>
        </CoachCard>
      )}

      {analysis.keyConcepts.length > 0 && (
        <CoachCard icon="💡" title="Concetti chiave">
          <ul className="space-y-1 list-disc list-inside">
            {analysis.keyConcepts.map((c, i) => (
              <li key={i} className="text-xs text-sage-700">{c}</li>
            ))}
          </ul>
        </CoachCard>
      )}
    </div>
  )
}
