import { ArrowLeft } from 'lucide-react'

interface PanelHeaderProps {
  onBack?: () => void
  gameId?: number
  onImportPgn: () => void
  importMsg: string
  openingName?: string
}

export function PanelHeader({ onBack, gameId, onImportPgn, importMsg, openingName }: PanelHeaderProps) {
  return (
    <>
      {onBack && (
        <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
          <ArrowLeft size={16} className="inline-block" /> Torna indietro
        </button>
      )}
      {gameId !== undefined && <p className="text-sm text-sage-700 mb-4">Analisi partita #{gameId}</p>}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analisi</h1>
        <p className="text-sm text-sage-700">Analisi con Stockfish, spiegazioni e note del coach</p>
      </div>
      {openingName && (
        <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-2">
          <span className="font-medium">Apertura:</span> {openingName}
        </div>
      )}
      {importMsg && (
        <div className="mb-4 text-sm text-sage-700 bg-sage-50 rounded-lg p-2 text-center">{importMsg}</div>
      )}
      <div className="mb-4">
        <button className="btn-primary w-full" onClick={onImportPgn}>Importa PGN</button>
      </div>
    </>
  )
}
