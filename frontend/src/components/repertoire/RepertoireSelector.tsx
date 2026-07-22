import { useEffect, useState, useRef } from 'react'
import { Circle, X, Plus } from 'lucide-react'
import { Chess } from 'chess.js'
import { api } from '../../api/client'
import { parseRepertoireText } from '../../utils/repertoireParser'
import type { Opening } from '../../types'

interface Props {
  onSelect: (opening: Opening) => void
}

function colorDot(code: string) {
  const colors: Record<string, string> = {
    green: 'bg-green-line',
    yellow: 'bg-yellow-line',
    red: 'bg-red-line',
  }
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[code] ?? 'bg-sage-200'}`} />
}

function colorLabel(code: string) {
  const labels: Record<string, string> = {
    green: 'Conosciuta',
    yellow: 'Da rivedere',
    red: 'Debole',
  }
  return labels[code] ?? code
}

export function RepertoireSelector({ onSelect }: Props) {
  const [openings, setOpenings] = useState<Opening[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const loadOpenings = () => {
    api.openings.list()
      .then(setOpenings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOpenings() }, [])

  const whiteOpenings = openings.filter(o => o.side === 'white')
  const blackOpenings = openings.filter(o => o.side === 'black')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm flex items-center gap-1.5">
          <Plus size={16} /> Nuova apertura
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
          <span className="text-2xl"><Circle size={12} className="inline-block" fill="white" stroke="black" /></span> Bianco
        </h2>
        {whiteOpenings.length === 0 ? (
          <p className="text-sm text-sage-500 italic">Nessuna apertura per il bianco.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whiteOpenings.map(op => (
              <OpeningCard key={op.id} opening={op} onClick={() => onSelect(op)} onDeleted={loadOpenings} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
          <span className="text-2xl"><Circle size={12} className="inline-block" fill="black" stroke="black" /></span> Nero
        </h2>
        {blackOpenings.length === 0 ? (
          <p className="text-sm text-sage-500 italic">Nessuna apertura per il nero.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blackOpenings.map(op => (
              <OpeningCard key={op.id} opening={op} onClick={() => onSelect(op)} onDeleted={loadOpenings} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateOpeningModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); loadOpenings() }}
        />
      )}
    </div>
  )
}

function OpeningCard({ opening, onClick, onDeleted }: { opening: Opening; onClick: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Eliminare l'apertura "${opening.name}"?`)) return
    setDeleting(true)
    api.openings.delete(opening.id).then(onDeleted).catch(() => setDeleting(false))
  }

  return (
    <div
      className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-all hover:-translate-y-0.5 group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-base">{opening.name}</h3>
          {opening.ecoCode && (
            <span className="text-xs font-mono text-sage-500 bg-sage-50 px-2 py-0.5 rounded mt-1 inline-block">
              {opening.ecoCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-sage-500">
            {colorDot(opening.colorCode)}
            <span>{colorLabel(opening.colorCode)}</span>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sage-300 hover:text-red-line transition-colors opacity-0 group-hover:opacity-100 text-sm leading-none"
            title="Elimina apertura"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-sage-700">
        <span>{opening.nodeCount} mosse</span>
        <span className="text-xs uppercase tracking-wider font-semibold text-sage-400">
          {opening.side === 'white' ? 'Bianco' : 'Nero'}
        </span>
      </div>
    </div>
  )
}

export function CreateOpeningModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [tab, setTab] = useState<'text' | 'pgn'>('text')
  const [name, setName] = useState('')
  const [side, setSide] = useState<'white' | 'black'>('white')
  const [content, setContent] = useState('')
  const [pgnInput, setPgnInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ name: string; moves: number }[] | null>(null)
  const [pgnMoves, setPgnMoves] = useState<{ fen: string; san: string }[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') {
        setContent(text)
        setPreview(null)
        setError('')
        // auto-preview
        try {
          const parsed = parseRepertoireText(text)
          if (parsed.variations.length > 0) {
            setPreview(parsed.variations.map(v => ({ name: v.name, moves: v.moves.length })))
            if (!name.trim() && parsed.openingName !== 'Repertorio') {
              setName(parsed.openingName)
            }
          }
        } catch {}
      }
    }
    reader.readAsText(file)
  }

  const handlePreview = () => {
    setError('')
    setPreview(null)
    if (!content.trim()) return
    try {
      const parsed = parseRepertoireText(content)
      if (parsed.variations.length === 0) {
        setError('Nessuna variazione trovata nel testo.')
        return
      }
      setPreview(parsed.variations.map(v => ({ name: v.name, moves: v.moves.length })))
      if (!name.trim() && parsed.openingName !== 'Repertorio') {
        setName(parsed.openingName)
      }
    } catch {
      setError('Formato testo non valido.')
    }
  }

  const handleParsePgn = () => {
    setError('')
    setPgnMoves(null)
    try {
      const game = new Chess()
      game.loadPgn(pgnInput)
      const history = game.history({ verbose: true })
      if (history.length === 0) {
        setError('Nessuna mossa trovata nel PGN.')
        return
      }
      const moves: { fen: string; san: string }[] = []
      const tempGame = new Chess()
      for (const m of history) {
        tempGame.move(m.san)
        moves.push({ fen: tempGame.fen(), san: m.san })
      }
      setPgnMoves(moves)
    } catch {
      setError('PGN non valido. Verifica il formato.')
    }
  }

  const parseAndImport = async (openingId: number) => {
    let firstId: number | null = null
    const fenMap = new Map<string, number>()

    const doImport = async (moves: { fen: string; san: string; annotation?: string; depth?: number }[], variationName?: string) => {
      let parentId: number | null = null
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i]
        const existing = fenMap.get(move.fen)
        if (existing) { parentId = existing; continue }
        const raw: any = await api.repertoire.createNode({
          repertoire_id: 1,
          parent_id: parentId,
          fen: move.fen,
          move_san: move.san,
          annotation: move.annotation || '',
          color_code: 'green',
          depth: move.depth ?? i + 1,
          eco_code: variationName || '',
        })
        fenMap.set(move.fen, raw.id)
        if (!firstId) firstId = raw.id
        parentId = raw.id
      }
    }

    if (tab === 'pgn' && pgnMoves) {
      await doImport(pgnMoves)
    } else if (tab === 'text' && content.trim()) {
      const p = parseRepertoireText(content)
      for (const v of p.variations) {
        await doImport(v.moves.map(m => ({ ...m, annotation: m.annotation })), v.name)
      }
    }

    if (firstId) {
      const fen = tab === 'pgn' && pgnMoves
        ? pgnMoves[0]?.fen || 'start'
        : 'start'
      await api.openings.update(openingId, {
        starting_fen: fen,
        starting_node_id: firstId,
      })
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) { setError('Inserisci un nome per l\'apertura.'); return }
    setCreating(true)
    setError('')
    try {
      const hasContent = (tab === 'text' && content.trim()) || (tab === 'pgn' && pgnMoves)
      const opening = await api.openings.create({ name: name.trim(), side, starting_fen: 'start' })
      if (hasContent) {
        await parseAndImport(opening.id)
      }
      onCreated()
    } catch {
      setError('Errore durante la creazione.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-box shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-sage-100 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold">Nuova apertura</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700 text-xl leading-none"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Nome apertura</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="Es. Italiana, Siciliana, ..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1.5">Colore</label>
            <div className="flex rounded-lg overflow-hidden border border-sage-200">
              <button
                onClick={() => setSide('white')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  side === 'white' ? 'bg-sage-500 text-white' : 'bg-white text-sage-700 hover:bg-sage-50'
                }`}
              ><Circle size={16} className="inline-block mr-1" fill="white" stroke="black" /> Bianco</button>
              <button
                onClick={() => setSide('black')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  side === 'black' ? 'bg-sage-500 text-white' : 'bg-white text-sage-700 hover:bg-sage-50'
                }`}
              ><Circle size={16} className="inline-block mr-1" fill="black" stroke="black" /> Nero</button>
            </div>
          </div>

          <div className="flex border-b border-sage-100">
            <button
              onClick={() => { setTab('text'); setPreview(null); setPgnMoves(null); setError('') }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'text' ? 'text-sage-900 border-b-2 border-sage-500' : 'text-sage-500 hover:text-sage-700'
              }`}
            >Testo repertorio</button>
            <button
              onClick={() => { setTab('pgn'); setPreview(null); setPgnMoves(null); setError('') }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'pgn' ? 'text-sage-900 border-b-2 border-sage-500' : 'text-sage-500 hover:text-sage-700'
              }`}
            >PGN</button>
          </div>

          {tab === 'text' && (
            <>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost text-sm"
                >
                  Scegli file .txt/.md
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">
                  Testo repertorio <span className="text-sage-400">(opzionale)</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => { setContent(e.target.value); setPreview(null) }}
                  rows={5}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="# Nome Apertura\n\n## Variazione\n1. e4 e5 2. Cf3 Cc6"
                />
                {content.trim() && !preview && (
                  <button onClick={handlePreview} className="btn-ghost text-xs mt-1">
                    Anteprima variazioni
                  </button>
                )}
              </div>
              {preview && preview.length > 0 && (
                <div className="bg-sage-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-sage-600 mb-2">
                    Trovate {preview.length} variazioni
                  </p>
                  {preview.map((v, i) => (
                    <p key={i} className="text-xs text-sage-700">{v.name}: {v.moves} mosse</p>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'pgn' && (
            <>
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">
                  Incolla PGN <span className="text-sage-400">(opzionale)</span>
                </label>
                <textarea
                  value={pgnInput}
                  onChange={e => { setPgnInput(e.target.value); setPgnMoves(null); setError('') }}
                  rows={5}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="1. e4 e5 2. Cf3 Cc6 3. Ac4 ..."
                />
                {!pgnMoves && (
                  <button onClick={handleParsePgn} disabled={!pgnInput.trim()} className="btn-primary w-full mt-2">
                    Analizza PGN
                  </button>
                )}
              </div>
              {pgnMoves && (
                <div className="bg-sage-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-sage-600 mb-2">
                    {pgnMoves.length} mosse trovate
                  </p>
                  <div className="text-xs font-mono text-sage-700 max-h-32 overflow-y-auto">
                    {pgnMoves.map((m, i) => (
                      <span key={i}>
                        {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {m.san}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost flex-1">Annulla</button>
            <button onClick={handleCreate} disabled={creating} className="btn-primary flex-1">
              {creating ? 'Creazione...' : 'Crea'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
