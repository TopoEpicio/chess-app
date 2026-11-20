import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { X, Circle, Plus } from 'lucide-react'
import { Chess } from 'chess.js'
import { parseRepertoireText } from '../../utils/repertoireParser'
import type { ParsedVariation } from '../../utils/repertoireParser'
import { api } from '../../api/client'

export function RepertoireSelector({ onSelect }: { onSelect: (opening: any) => void }) {
  const { t } = useTranslation('common')
  const [openings, setOpenings] = useState<any[]>([])
  const [whiteOpenings, setWhiteOpenings] = useState<any[]>([])
  const [blackOpenings, setBlackOpenings] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    loadOpenings()
  }, [])

  async function loadOpenings() {
    const data = await api.openings.list()
    setOpenings(data)
    setWhiteOpenings(data.filter((o: any) => o.side === 'white'))
    setBlackOpenings(data.filter((o: any) => o.side === 'black'))
  }

  const colorDot = (colorCode: string | undefined) => {
    const colors: Record<string, string> = { white: '#ffffff', black: '#000000', green: '#22c55e', yellow: '#eab308', blue: '#3b82f6' }
    return <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: colors[colorCode] || '#94a3b8' }} />
  }

  const colorLabel = (colorCode: string | undefined) => {
    if (colorCode === 'white') return t('analysis.white')
    if (colorCode === 'black') return t('analysis.black')
    if (colorCode === 'green') return 'Green'
    if (colorCode === 'yellow') return 'Yellow'
    if (colorCode === 'blue') return 'Transposition'
    return colorCode || ''
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm flex items-center gap-1.5">
          <Plus size={16} /> {t('home.newGame')}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
          <span className="text-2xl"><Circle size={12} className="inline-block" fill="white" stroke="black" /></span> {t('analysis.white')}
        </h2>
        {whiteOpenings.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] italic">No openings for White.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whiteOpenings.map(op => (
              <OpeningCard key={op.id} opening={op} onClick={() => onSelect(op)} onDeleted={loadOpenings} colorDot={colorDot} colorLabel={colorLabel} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
          <span className="text-2xl"><Circle size={12} className="inline-block" fill="black" stroke="black" /></span> {t('analysis.black')}
        </h2>
        {blackOpenings.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] italic">No openings for Black.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blackOpenings.map(op => (
              <OpeningCard key={op.id} opening={op} onClick={() => onSelect(op)} onDeleted={loadOpenings} colorDot={colorDot} colorLabel={colorLabel} />
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

function OpeningCard({ opening, onClick, onDeleted, colorDot, colorLabel }: { opening: any; onClick: () => void; onDeleted: () => void; colorDot: (code: string | undefined) => React.ReactNode; colorLabel: (code: string | undefined) => string }) {
  const { t } = useTranslation('common')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t('games.deleteConfirm'))) return
    setDeleting(true)
    api.openings.delete(opening.id).then(onDeleted).catch(() => setDeleting(false))
  }

  return (
    <div
      className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5 cursor-pointer hover:shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-base">{opening.name}</h3>
          {opening.ecoCode && (
            <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded mt-1 inline-block">
              {opening.ecoCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            {colorDot(opening.colorCode)}
            <span>{colorLabel(opening.colorCode)}</span>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100 text-sm leading-none"
            title={t('games.deleted')}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
        <span>{opening.nodeCount} moves</span>
        <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
          {opening.side === 'white' ? t('analysis.white') : t('analysis.black')}
        </span>
      </div>
    </div>
  )
}

export function CreateOpeningModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { t } = useTranslation('common')
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
        try {
          const parsed = parseRepertoireText(text)
          if (parsed.variations.length > 0) {
            setPreview(parsed.variations.map(v => ({ name: v.name, moves: v.moves.length })))
            if (!name.trim() && parsed.openingName !== 'Repertoire') {
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
        setError(t('repertoire.noValidLines'))
        return
      }
      setPreview(parsed.variations.map(v => ({ name: v.name, moves: v.moves.length })))
      if (!name.trim() && parsed.openingName !== 'Repertoire') {
        setName(parsed.openingName)
      }
    } catch {
      setError(t('repertoire.invalidText'))
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
        setError(t('repertoire.noMovesInPgn'))
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
      setError(t('repertoire.invalidPgn'))
    }
  }

  const parseAndImport = async (
    openingId: string | number,
    targetRepertoireId: number,
  ) => {
    let firstId: number | null = null
    let firstFen: string | null = null
    const fenMap = new Map<string, number>()

    const doImport = async (moves: { fen: string; san: string; annotation?: string; depth?: number }[], variationName?: string) => {
      let parentId: number | null = null
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i]
        const existing = fenMap.get(move.fen)
        if (existing) { parentId = existing; continue }
        const raw: any = await api.repertoire.createNode({
          repertoire_id: targetRepertoireId,
          parent_id: parentId,
          fen: move.fen,
          move_san: move.san,
          annotation: move.annotation || '',
          color_code: 'green',
          depth: move.depth ?? i + 1,
          eco_code: variationName || '',
        })
        fenMap.set(move.fen, raw.id)
        if (!firstId) {
          firstId = raw.id
          firstFen = move.fen
        }
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

    const resolvedFen =
      firstFen ??
      (tab === 'pgn' ? pgnMoves?.[0]?.fen : null) ??
      (tab === 'text' ? 'start' : null) ??
      'start'
    if (firstId) {
      await api.openings.update(openingId, {
        starting_fen: resolvedFen ?? 'start',
        starting_node_id: firstId,
      })
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) { setError('Enter a name for the opening.'); return }
    setCreating(true)
    setError('')
    try {
      const hasContent = (tab === 'text' && content.trim()) || (tab === 'pgn' && pgnMoves)
      const opening = await api.openings.create({ name: name.trim(), side, starting_fen: 'start' })
      const targetRepertoireId = opening.repertoireId ?? 1
      if (hasContent) {
        await parseAndImport(opening.id, targetRepertoireId)
      }
      onCreated()
    } catch {
      setError('Error during creation.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] rounded-box shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-[var(--color-border)]">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold">{t('home.newGame')}</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xl leading-none"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Opening name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="e.g. Italian, Sicilian, ..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Color</label>
            <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
              <button
                onClick={() => setSide('white')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  side === 'white' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                }`}
              ><Circle size={16} className="inline-block mr-1" fill="white" stroke="black" /> {t('analysis.white')}</button>
              <button
                onClick={() => setSide('black')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  side === 'black' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                }`}
              ><Circle size={16} className="inline-block mr-1" fill="black" stroke="black" /> {t('analysis.black')}</button>
            </div>
          </div>

          <div className="flex border-b border-[var(--color-border)]">
            <button
              onClick={() => { setTab('text'); setPreview(null); setPgnMoves(null); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'text' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >Repertoire text</button>
            <button
              onClick={() => { setTab('pgn'); setPreview(null); setPgnMoves(null); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'pgn' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >PGN</button>
          </div>

          {tab === 'text' && (
            <div>
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
                  Choose file .txt/.md
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Repertoire text <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => { setContent(e.target.value); setPreview(null); }}
                  rows={5}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="# Opening Name\n\n## Variation\n1. e4 e5 2. Nf3 Nc6"
                />
                {content.trim() && !preview && (
                  <button onClick={handlePreview} className="btn-ghost text-xs mt-1">
                    Preview variations
                  </button>
                )}
              </div>
              {preview && preview.length > 0 && (
                <div className="bg-[var(--color-bg)] rounded-lg p-3">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                    Found {preview.length} variations
                  </p>
                  {preview.map((v, i) => (
                    <p key={i} className="text-xs text-[var(--color-text-secondary)]">{v.name}: {v.moves} moves</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'pgn' && (
            <div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Paste PGN <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <textarea
                  value={pgnInput}
                  onChange={e => { setPgnInput(e.target.value); setPgnMoves(null); setError(''); }}
                  rows={5}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="1. e4 e5 2. Nf3 Nc6 3. Bc4 ..."
                />
                {!pgnMoves && (
                  <button onClick={handleParsePgn} disabled={!pgnInput.trim()} className="btn-primary w-full mt-2">
                    Analyze PGN
                  </button>
                )}
              </div>
              {pgnMoves && (
                <div className="bg-[var(--color-bg)] rounded-lg p-3">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                    {pgnMoves.length} moves found
                  </p>
                  <div className="text-xs font-mono text-[var(--color-text-secondary)] max-h-32 overflow-y-auto">
                    {pgnMoves.map((m, i) => (
                      <span key={i}>
                        {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {m.san}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-[var(--color-danger)] text-xs">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost flex-1">{t('common.cancel')}</button>
            <button onClick={handleCreate} disabled={creating} className="btn-primary flex-1">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

