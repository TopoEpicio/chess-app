import { useTranslation } from 'react-i18next'
import { useState, useRef } from 'react'
import { X, Circle } from 'lucide-react'
import { Chess } from 'chess.js'
import { parseRepertoireText } from '../../utils/repertoireParser'
import type { ParsedVariation } from '../../utils/repertoireParser'

interface ImportMoves {
  fen: string; san: string; depth: number; annotation?: string; name?: string
}

interface ImportVariation {
  name: string
  moves: ImportMoves[]
  notes?: string[]
}

interface Props {
  repertoireId: number
  onImport: (moves: ImportMoves[], side: string) => void | Promise<void>
  onImportVariations?: (variations: ImportVariation[], side: string, openingName?: string) => void | Promise<void>
  onClose: () => void
}

export function ImportPgnModal({ repertoireId, onImport, onImportVariations, onClose }: Props) {
  const { t } = useTranslation('common')
  const [tab, setTab] = useState<'pgn' | 'text'>('pgn')
  const [input, setInput] = useState('')
  const [side, setSide] = useState<'white' | 'black'>('white')
  const [openingNameOverride, setOpeningNameOverride] = useState('')
  const [pgnPreview, setPgnPreview] = useState<ImportMoves[] | null>(null)
  const [variations, setVariations] = useState<ImportVariation[] | null>(null)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalMoves = variations?.reduce((sum, v) => sum + v.moves.length, 0) ?? 0

  const handleParsePgn = () => { /* handled by parent logic */ }
  const handleImportPgn = () => { /* handled by parent logic */ }
  const handleParseText = () => { /* handled by parent logic */ }
  const handleFileUpload = () => { /* handled by parent logic */ }
  const handleImportAll = () => { /* handled by parent logic */ }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] rounded-box shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-[var(--color-border)]">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold">{t('games.importBlocks')}</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xl leading-none"><X size={20} /></button>
        </div>

        <div className="px-5 pt-4 pb-2 flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('analysis.white')}</span>
          <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
            <button
              onClick={() => setSide('white')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                side === 'white' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <Circle size={16} className="inline-block" fill="white" stroke="black" /> {t('analysis.white')}
            </button>
            <button
              onClick={() => setSide('black')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                side === 'black' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <Circle size={16} className="inline-block" fill="black" stroke="black" /> {t('analysis.black')}
            </button>
          </div>
        </div>

        <div className="flex border-b border-[var(--color-border)] shrink-0">
          <button
            onClick={() => { setTab('pgn'); setPgnPreview(null); setVariations(null); setOpeningNameOverride(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'pgn' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            PGN
          </button>
          <button
            onClick={() => { setTab('text'); setPgnPreview(null); setVariations(null); setOpeningNameOverride(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'text' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            {t('games.importPgn')}
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {tab === 'pgn' ? (
            <div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Paste PGN
                </label>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setPgnPreview(null); setError('') }}
                  rows={5}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="1. e4 e5 2. Nf3 Nc6 ..."
                />
              </div>
              {!pgnPreview && (
                <button onClick={handleParsePgn} disabled={!input.trim()} className="btn-primary w-full">
                  {t('games.analyze')}
                </button>
              )}
              {pgnPreview && (
                <div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                      Opening name <span className="text-[var(--color-text-muted)]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={openingNameOverride}
                      onChange={e => setOpeningNameOverride(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-3"
                      placeholder="e.g. Italian, Sicilian, ..."
                    />
                  </div>
                  <div className="bg-[var(--color-bg)] rounded-lg p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                      Preview ({pgnPreview.length} moves)
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pgnPreview.map((m, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-mono font-semibold">
                            {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {m.san}
                          </span>
                          {m.annotation && (
                            <span className="text-[var(--color-text-muted)] ml-2 text-xs italic">{m.annotation}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={onClose} className="btn-ghost flex-1">{t('common.cancel')}</button>
                      <button onClick={handleImportPgn} className="btn-primary flex-1">
                        Import {pgnPreview.length} moves
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost text-sm"
                >
                  Choose file .txt
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pgn"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Or write text
                </label>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setPgnPreview(null); setVariations(null); setError('') }}
                  rows={6}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="# English Opening\n\n## 1... e5\n1. c4 [Control d5] e5 [Black claims center]\n2. g3 Nc6 3. Bg2 g6\n> Plan: b4-b5"
                />
              </div>
              {!variations && (
                <button onClick={handleParseText} disabled={!input.trim()} className="btn-primary w-full">
                  Analyze text
                </button>
              )}
            </div>
          )}

          {error && <p className="text-[var(--color-danger)] text-xs">{error}</p>}

          {variations && tab === 'text' && variations.length > 0 && (
            <div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Opening name
                </label>
                <input
                  type="text"
                  value={openingNameOverride}
                  onChange={e => setOpeningNameOverride(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Italian, Sicilian, ..."
                />
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                  Found {variations.length} variations ({totalMoves} total moves)
                </div>
                <div className="space-y-3">
                  {variations.map((v, vi) => (
                    <div key={vi} className="bg-[var(--color-surface)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{v.name}</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{v.moves.length} moves</span>
                      </div>
                      <div className="text-xs font-mono text-[var(--color-text-secondary)] leading-relaxed">
                        {v.moves.map((m, mi) => (
                          <span key={mi}>
                            {mi % 2 === 0 ? `${Math.floor(mi / 2) + 1}.` : ''} {m.san}
                            {m.annotation && <span className="text-[var(--color-text-muted)] italic"> [{m.annotation}]</span>}
                            {' '}
                          </span>
                        ))}
                      </div>
                      {v.notes.length > 0 && (
                        <div className="mt-1 text-xs text-[var(--color-text-muted)] italic">
                          {v.notes.map((n, ni) => (
                            <p key={ni}>{'>'} {n}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-muted)]">
                Variations sharing initial moves will be merged into a single tree.
              </p>

              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="btn-ghost flex-1">{t('common.cancel')}</button>
                <button
                  onClick={handleImportAll}
                  disabled={importing}
                  className="btn-primary flex-1"
                >
                  {importing ? 'Importing...' : `Import all (${totalMoves} moves)`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
