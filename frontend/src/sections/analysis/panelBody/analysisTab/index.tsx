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
  return (
    <div className="space-y-4">
      <div className="text-center">
        <button
          onClick={onStartAnalysis}
          disabled={!canStart}
          className="btn-primary px-4 py-2 rounded text-sm"
        >
          Analizza Partita
        </button>
        {hasGameResult && (
          <button onClick={onSaveAnalysis} className="btn-ghost px-4 py-2 rounded text-sm">
            Salva analisi
          </button>
        )}
      </div>
      {hasGameResult && (
        <div className="text-sm text-sage-700 space-y-2 bg-white rounded-box p-4 shadow-sm">
          <div><strong>Precisione Bianco:</strong> {whiteAccuracy?.toFixed(1) ?? 'N/A'}%</div>
          <div><strong>Precisione Nero:</strong> {blackAccuracy?.toFixed(1) ?? 'N/A'}%</div>
          <div><strong>Mosse analizzate:</strong> {movesCount}</div>
          <div><strong>Stato:</strong> {status}</div>
        </div>
      )}
    </div>
  )
}
