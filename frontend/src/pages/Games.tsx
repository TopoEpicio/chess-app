import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { ImportBulkModal } from '../components/puzzles/ImportBulkModal.tsx'
import type { AnalysisFilters } from '../api/interface.ts'

interface GameSummary {
  id: number
  white: string | null
  black: string | null
  result: string | null
  eco: string | null
  date: string | null
  opening_name: string | null
  num_moves: number
  created_at: string
}

interface Props {
  onSelectGame: (gameId: number) => void
  onAnalyzeGame: (gameId: number) => void
}

const RESULT_OPTIONS = ['', '1-0', '0-1', '½-½', '*'] as const

export function Games({ onSelectGame, onAnalyzeGame }: Props) {
  const [games, setGames] = useState<GameSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showBulkImport, setShowBulkImport] = useState(false)

  const [filters, setFilters] = useState<AnalysisFilters>({})
  const [years, setYears] = useState<string[]>([])
  const [whiteOpts, setWhiteOpts] = useState<string[]>([])
  const [blackOpts, setBlackOpts] = useState<string[]>([])
  const [ecoOpts, setEcoOpts] = useState<string[]>([])
  const [openingOpts, setOpeningOpts] = useState<string[]>([])
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [pageSize, setPageSize] = useState(50)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.analysis.list(1, filters).then((data: any) => {
      if (cancelled) return
      setGames(data)
      const ys = new Set<string>()
      const ws = new Set<string>()
      const bs = new Set<string>()
      const es = new Set<string>()
      const os = new Set<string>()
      for (const g of data) {
        if (g.date && g.date.length >= 4) ys.add(g.date.slice(0, 4))
        if (g.white) ws.add(g.white)
        if (g.black) bs.add(g.black)
        if (g.eco) es.add(g.eco)
        if (g.opening_name) os.add(g.opening_name)
      }
      setYears(Array.from(ys).sort().reverse())
      setWhiteOpts(Array.from(ws).sort())
      setBlackOpts(Array.from(bs).sort())
      setEcoOpts(Array.from(es).sort())
      setOpeningOpts(Array.from(os).sort())
    }).catch(console.error).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [filters])

  const clearFilters = () => setFilters({})

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(null)
    await api.analysis.delete(id)
    setGames((prev) => prev.filter((g) => g.id !== id))
  }

  const handleAnalyze = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    onAnalyzeGame(id)
  }

  const countActive = Object.values(filters).filter(Boolean).length

  if (loading && games.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sage-700">Caricamento partite...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Partite</h1>
          <p className="text-sm text-sage-700">{games.length} partite importate</p>
        </div>
        <button
          className="btn-ghost text-sm border border-sage-200 hover:bg-sage-100"
          onClick={() => setShowBulkImport(true)}
        >
          + Importa blocchi
        </button>
      </div>
      {showBulkImport && <ImportBulkModal onClose={() => setShowBulkImport(false)} />}

      {(games.length > 0 || countActive > 0) && (
        <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">Anno</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.year ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value || undefined }))}
              >
                <option value="">Tutti</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">Bianco</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.white ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, white: e.target.value || undefined }))}
              >
                <option value="">Tutti</option>
                {whiteOpts.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">Nero</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.black ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, black: e.target.value || undefined }))}
              >
                <option value="">Tutti</option>
                {blackOpts.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">Esito</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.result ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, result: e.target.value || undefined }))}
              >
                {RESULT_OPTIONS.map(r => (
                  <option key={r} value={r}>{r || 'Tutti'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">ECO</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.eco ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, eco: e.target.value || undefined }))}
              >
                <option value="">Tutti</option>
                {ecoOpts.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-500">Apertura</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-sage-200 rounded text-sm bg-white text-sage-900 focus:outline-none focus:border-sage-500"
                value={filters.opening ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, opening: e.target.value || undefined }))}
              >
                <option value="">Tutti</option>
                {openingOpts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {countActive > 0 && (
            <div className="flex justify-end mt-3">
              <button onClick={clearFilters} className="text-xs text-sage-500 hover:text-sage-700 underline">
                Pulisci filtri ({countActive})
              </button>
            </div>
          )}
        </div>
      )}

      {games.length === 0 ? (
        <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-8 text-center">
          <p className="text-sage-700 mb-2">
            {countActive > 0 ? 'Nessuna partita corrisponde ai filtri' : 'Nessuna partita importata'}
          </p>
          <p className="text-sm text-sage-500">
            {countActive > 0
              ? 'Prova a modificare o rimuovere i filtri'
              : 'Vai su Analisi → Importa PGN per aggiungere la prima partita'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end gap-2 mb-3">
            <span className="text-xs text-sage-500">Mostra</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-sage-200 rounded text-xs bg-white text-sage-900 focus:outline-none focus:border-sage-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs text-sage-500">di {games.length}</span>
          </div>
          <div className="space-y-3">
            {games.slice(0, pageSize).map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 flex items-center justify-between cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-shadow"
              onClick={() => onSelectGame(g.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {g.white ?? '?'} vs {g.black ?? '?'}
                </div>
                <div className="flex items-center gap-3 text-sm text-sage-700 mt-1">
                  <span>{g.result ?? '*'}</span>
                  {g.eco && <span className="text-sage-500">{g.eco}</span>}
                  {g.date && <span className="text-sage-500">{g.date}</span>}
                  <span className="text-sage-500">{g.num_moves} mosse</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleAnalyze(e, g.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-sage-500 text-white hover:bg-sage-700 transition-colors"
                >
                  Analizza
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(g.id) }}
                  className="p-1.5 rounded-lg text-sage-400 hover:text-red-line hover:bg-red-50 transition-colors"
                  title="Elimina"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg className="w-5 h-5 text-sage-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-white rounded-box shadow-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">Eliminare questa partita?</h3>
            <p className="text-sm text-sage-700 mb-4">L'operazione non può essere annullata.</p>
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmDeleteId(null)}>Annulla</button>
              <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={() => handleDelete(confirmDeleteId)}>
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
