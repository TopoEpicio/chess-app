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
}

interface Props {
  repertoireId: number
  onImport: (moves: ImportMoves[], side: string) => void | Promise<void>
  onImportVariations?: (variations: ImportVariation[], side: string, openingName?: string) => void | Promise<void>
  onClose: () => void
}

export function ImportPgnModal({ repertoireId: _repertoireId, onImport, onImportVariations, onClose }: Props) {
  const [tab, setTab] = useState<'pgn' | 'text'>('pgn')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [pgnPreview, setPgnPreview] = useState<ImportMoves[] | null>(null)
  const [variations, setVariations] = useState<ParsedVariation[] | null>(null)
  const [importing, setImporting] = useState(false)
  const [side, setSide] = useState<'white' | 'black'>('white')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openingNameOverride, setOpeningNameOverride] = useState('')

  const handleParsePgn = () => {
    setError('')
    setVariations(null)
    setPgnPreview(null)
    try {
      const game = new Chess()
      game.loadPgn(input)
      const history = game.history({ verbose: true })
      if (history.length === 0) {
        setError('Nessuna mossa trovata nel PGN.')
        return
      }
      let comments: { fen: string; comment: string }[] = []
      try { comments = (game as any).getComments?.() ?? [] } catch {}

        const moves: ImportMoves[] = []
          const tempGame = new Chess()
          for (let i = 0; i < history.length; i++) {
            const m = history[i]
            tempGame.move(m.san)
            const comment = comments.find((c: any) => c.fen === tempGame.fen())
            moves.push({
              fen: tempGame.fen(),
              san: m.san,
              depth: i + 1,
              annotation: comment?.comment || '',
            })
          }
          setPgnPreview(moves)
          setOpeningNameOverride('')
    } catch {
      setError('PGN non valido. Verifica il formato.')
    }
  }

  const handleParseText = () => {
    setError('')
    setPgnPreview(null)
    setVariations(null)
    try {
      const parsed = parseRepertoireText(input)
      if (parsed.variations.length === 0) {
        setError('Nessuna variazione trovata. Verifica il formato.')
        return
      }
      if (parsed.variations.every(v => v.moves.length === 0)) {
        setError('Nessuna mossa valida trovata nel testo.')
        return
      }
      setVariations(parsed.variations)
      setOpeningNameOverride(parsed.openingName !== 'Repertorio' ? parsed.openingName : '')
    } catch {
      setError('Formato testo non valido. Controlla la guida per il formato corretto.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result
      if (typeof content === 'string') {
        setInput(content)
        setPgnPreview(null)
        setVariations(null)
        setError('')
        setOpeningNameOverride('')
        setTab('text')
      }
    }
    reader.readAsText(file)
  }

  const handleImportPgn = async () => {
    if (!pgnPreview || pgnPreview.length === 0) return
    try {
      if (onImportVariations && openingNameOverride) {
        await onImportVariations(
          [{ name: '', moves: pgnPreview }],
          side,
          openingNameOverride,
        )
      } else {
        await onImport(pgnPreview, side)
      }
    } catch (e) {
      console.error('PGN import failed:', e)
    }
    onClose()
  }

  const handleImportAll = async () => {
    if (!variations || variations.length === 0) return
    setImporting(true)
    const vars: ImportVariation[] = variations
      .filter(v => v.moves.length > 0)
      .map(v => ({
        name: v.name !== 'Variazione' ? v.name : '',
        moves: v.moves.map(m => ({
          fen: m.fen,
          san: m.san,
          depth: m.depth,
          annotation: m.annotation || '',
        })),
      }))
    try {
      if (onImportVariations) {
        await onImportVariations(vars, side, openingNameOverride || undefined)
      } else {
        for (const v of vars) {
          await onImport(v.moves, side)
        }
      }
    } catch (e) {
      console.error('Import failed:', e)
    }
    onClose()
  }

  const totalMoves = variations?.reduce((sum, v) => sum + v.moves.length, 0) ?? 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-box shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-sage-100 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold">Importa nel Repertorio</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700 text-xl leading-none"><X size={20} /></button>
        </div>

        <div className="px-5 pt-4 pb-2 flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">Per il</span>
          <div className="flex rounded-lg overflow-hidden border border-sage-200">
            <button
              onClick={() => setSide('white')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                side === 'white' ? 'bg-sage-500 text-white' : 'bg-white text-sage-700 hover:bg-sage-50'
              }`}
            >
              <Circle size={16} className="inline-block" fill="white" stroke="black" /> Bianco
            </button>
            <button
              onClick={() => setSide('black')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                side === 'black' ? 'bg-sage-500 text-white' : 'bg-white text-sage-700 hover:bg-sage-50'
              }`}
            >
              <Circle size={16} className="inline-block" fill="black" stroke="black" /> Nero
            </button>
          </div>
        </div>

        <div className="flex border-b border-sage-100 shrink-0">
          <button
            onClick={() => { setTab('pgn'); setPgnPreview(null); setVariations(null); setOpeningNameOverride(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'pgn' ? 'text-sage-900 border-b-2 border-sage-500' : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            PGN
          </button>
          <button
            onClick={() => { setTab('text'); setPgnPreview(null); setVariations(null); setOpeningNameOverride(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'text' ? 'text-sage-900 border-b-2 border-sage-500' : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            Testo studio
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {tab === 'pgn' && (
            <>
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">
                  Incolla PGN <span className="text-sage-400">(supporta commenti per annotazioni)</span>
                </label>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setPgnPreview(null); setError('') }}
                  rows={5}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="1. e4 e5 2. Cf3 Cc6 ..."
                />
              </div>
              {!pgnPreview && (
                <button onClick={handleParsePgn} disabled={!input.trim()} className="btn-primary w-full">
                  Analizza PGN
                </button>
              )}
              {pgnPreview && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-sage-700 mb-1">
                      Nome apertura <span className="text-sage-400">(opzionale)</span>
                    </label>
                    <input
                      type="text"
                      value={openingNameOverride}
                      onChange={e => setOpeningNameOverride(e.target.value)}
                      className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 mb-3"
                      placeholder="Es. Italiana, Siciliana, ..."
                    />
                  </div>
                  <div className="bg-sage-50 rounded-lg p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
                      Anteprima ({pgnPreview.length} mosse)
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pgnPreview.map((m, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-mono font-semibold">
                            {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {m.san}
                          </span>
                          {m.annotation && (
                            <span className="text-sage-600 ml-2 text-xs italic">{m.annotation}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={onClose} className="btn-ghost flex-1">Annulla</button>
                    <button onClick={handleImportPgn} className="btn-primary flex-1">
                      Importa {pgnPreview.length} mosse
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'text' && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost text-sm"
                >
                  Scegli file .txt
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
                <label className="block text-xs font-medium text-sage-700 mb-1">
                  Oppure scrivi il testo
                </label>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setPgnPreview(null); setVariations(null); setError('') }}
                  rows={6}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="# English Opening\n\n## 1... e5\n1. c4 [Control d5] e5 [Black claims center]\n2. g3 Nc6 3. Bg2 g6\n> Piano: b4-b5"
                />
              </div>
              {!variations && (
                <button onClick={handleParseText} disabled={!input.trim()} className="btn-primary w-full">
                  Analizza testo
                </button>
              )}
            </>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {variations && tab === 'text' && variations.length > 0 && (
            <>
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">
                  Nome apertura
                </label>
                <input
                  type="text"
                  value={openingNameOverride}
                  onChange={e => setOpeningNameOverride(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="Es. Italiana, Siciliana, ..."
                />
              </div>
              <div className="bg-sage-50 rounded-lg p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
                  Trovate {variations.length} variazioni ({totalMoves} mosse totali)
                </div>
                <div className="space-y-3">
                  {variations.map((v, vi) => (
                    <div key={vi} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{v.name}</span>
                        <span className="text-xs text-sage-500">{v.moves.length} mosse</span>
                      </div>
                      <div className="text-xs font-mono text-sage-700 leading-relaxed">
                        {v.moves.map((m, mi) => (
                          <span key={mi}>
                            {mi % 2 === 0 ? `${Math.floor(mi / 2) + 1}.` : ''} {m.san}
                            {m.annotation && <span className="text-sage-500 italic"> [{m.annotation}]</span>}
                            {' '}
                          </span>
                        ))}
                      </div>
                      {v.notes.length > 0 && (
                        <div className="mt-1 text-xs text-sage-500 italic">
                          {v.notes.map((n, ni) => (
                            <p key={ni}>{'>'} {n}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-sage-500">
                Le variazioni che condividono mosse iniziali verranno unite in un unico albero.
              </p>

              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="btn-ghost flex-1">Annulla</button>
                <button
                  onClick={handleImportAll}
                  disabled={importing}
                  className="btn-primary flex-1"
                >
                  {importing ? 'Importazione in corso...' : `Importa tutte (${totalMoves} mosse)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}