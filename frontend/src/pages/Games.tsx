import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { ImportBulkModal } from '../components/puzzles/ImportBulkModal.tsx'
import type { AnalysisFilters } from '../api/interface.ts'
import { ArrowRight } from 'lucide-react'

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
  const { t } = useTranslation('common')
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

  const countActive = Object.values(filters).filter(Boolean).length

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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-[var(--color-text-secondary)]">{t('games.loadingGames')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('games.title')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{t('games.imported', { count: games.length })}</p>
        </div>
        <button
          className="btn-ghost text-sm border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
          onClick={() => setShowBulkImport(true)}
        >
          {t('games.importBlocks')}
        </button>
      </div>
      {showBulkImport && <ImportBulkModal onClose={() => setShowBulkImport(false)} />}

      {(games.length > 0 || countActive > 0) && (
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-4 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterYear')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.year ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value || undefined }))}
              >
                <option value=""> {t('games.filterAll')}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterWhite')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.white ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, white: e.target.value || undefined }))}
              >
                <option value=""> {t('games.filterAll')}</option>
                {whiteOpts.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterBlack')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.black ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, black: e.target.value || undefined }))}
              >
                <option value=""> {t('games.filterAll')}</option>
                {blackOpts.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterResult')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.result ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, result: e.target.value || undefined }))}
              >
                {RESULT_OPTIONS.map(r => (
                  <option key={r} value={r}>{r || t('games.filterAll')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterEco')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.eco ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, eco: e.target.value || undefined }))}
              >
                <option value=""> {t('games.filterAll')}</option>
                {ecoOpts.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('games.filterOpening')}</label>
              <select
                className="mt-1 w-full px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                value={filters.opening ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, opening: e.target.value || undefined }))}
              >
                <option value=""> {t('games.filterAll')}</option>
                {openingOpts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {countActive > 0 && (
            <div className="flex justify-end mt-3">
              <button onClick={clearFilters} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] underline">
                {t('games.clearFilters', { count: countActive })}
              </button>
            </div>
          )}
        </div>
      )}

      {games.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-8 text-center">
          <p className="text-[var(--color-text-secondary)] mb-2">
            {countActive > 0 ? t('games.noGamesMatch') : t('games.noGames')}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {countActive > 0
              ? t('games.modifyFilters')
              : <> {t('games.goToAnalysis')} <ArrowRight size={12} className="inline-block" /></>}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end gap-2 mb-3">
            <span className="text-xs text-[var(--color-text-secondary)]">{t('games.show')}</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-[var(--color-border)] rounded text-xs bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs text-[var(--color-text-secondary)]">{t('games.of')} {games.length}</span>
          </div>
          <div className="space-y-3">
            {games.slice(0, pageSize).map((g) => (
            <div
              key={g.id}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-4 flex items-center justify-between cursor-pointer hover:shadow-[var(--shadow-lg)] transition-shadow"
              onClick={() => onSelectGame(g.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {g.white ?? '?'} vs {g.black ?? '?'}
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mt-1">
                  <span>{g.result ?? '*'}</span>
                  {g.eco && <span className="text-[var(--color-text-secondary)]">{g.eco}</span>}
                  {g.date && <span className="text-[var(--color-text-secondary)]">{g.date}</span>}
                  <span className="text-[var(--color-text-secondary)]">{g.num_moves} {t('analysis.movesLabel')} </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleAnalyze(e, g.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  {t('games.analyze')}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(g.id) }}
                  className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
                  title={t('common.delete')}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">{t('games.deleteConfirm')}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{t('games.cannotUndo')}</p>
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmDeleteId(null)}>{t('common.cancel')}</button>
              <button className="btn-primary bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)]" onClick={() => handleDelete(confirmDeleteId)}>
                {t('games.deleted')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
