import { useState } from 'react'
import { api } from '../../api/client.ts'
import type { BulkBlock } from '../../api/interface.ts'

type Step = 'paste' | 'preview' | 'result'

interface Props {
  onClose: () => void
}

export function ImportBulkModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('paste')
  const [text, setText] = useState('')
  const [blocks, setBlocks] = useState<BulkBlock[]>([])
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ puzzles: number; games: number; skipped: number; total: number; errors: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePreview = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await api.importBulk.preview(text)
      setBlocks(res.blocks)
      setStep('preview')
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    setLoading(true)
    setError('')
    try {
      const allTypes: Record<string, string> = { ...overrides }
      for (const b of blocks) {
        if (!(b.index in allTypes)) {
          allTypes[b.index] = b.type
        }
      }
      const res = await api.importBulk.bulk(text, allTypes)
      setResult({
        puzzles: res.puzzles.imported,
        games: res.games.imported,
        skipped: res.games.skipped,
        total: res.total,
        errors: [...res.puzzles.errors, ...res.games.errors],
      })
      setStep('result')
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={handleClose}>
      <div
        className="bg-white rounded-box shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-1">
          {step === 'paste' && 'Importa blocchi multipli'}
          {step === 'preview' && 'Conferma importazione'}
          {step === 'result' && 'Risultato importazione'}
        </h2>
        <p className="text-sm text-sage-700 mb-4">
          {step === 'paste' && 'Incolla uno o più puzzle (formato FEN + soluzione) o partite (formato PGN), separati da righe vuote.'}
          {step === 'preview' && `Rilevati ${blocks.length} blocchi. Verifica i tipi prima di importare.`}
          {step === 'result' && result && `Importati ${result.total} elementi.`}
        </p>

        {step === 'paste' && (
          <>
            <textarea
              className="w-full h-60 border border-sage-200 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:border-sage-500"
              placeholder={'Incolla qui i tuoi blocchi...\n\nEsempio puzzle:\nfen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1\nmoves: e7e6 d2d4 d7d5\ntheme: opening\ndifficulty: 3\n\nEsempio partita:\n[Event "Partita informale"]\n[White "Giocatore1"]\n[Black "Giocatore2"]\n\n1. e4 e5 2. Cf3 Cc6 3. Ac4'}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </>
        )}

        {step === 'preview' && (
          <div className="overflow-y-auto max-h-80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage-200">
                  <th className="text-left py-2 px-2 text-sage-700">#</th>
                  <th className="text-left py-2 px-2 text-sage-700">Nome</th>
                  <th className="text-left py-2 px-2 text-sage-700">Anteprima</th>
                  <th className="text-left py-2 px-2 text-sage-700">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr key={b.index} className="border-b border-sage-100">
                    <td className="py-2 px-2 text-sage-500">{b.index + 1}</td>
                    <td className="py-2 px-2 font-medium text-sage-900 max-w-[120px] truncate" title={b.name}>
                      {b.name}
                    </td>
                    <td className="py-2 px-2 text-sage-600 max-w-[200px] truncate" title={b.preview}>
                      {b.preview}
                    </td>
                    <td className="py-2 px-2">
                      {b.type === 'unknown' ? (
                        <select
                          className="px-2 py-1 border border-sage-200 rounded text-sm"
                          value={overrides[b.index] ?? 'puzzle'}
                          onChange={(e) => setOverrides(prev => ({ ...prev, [b.index]: e.target.value }))}
                        >
                          <option value="puzzle">Puzzle</option>
                          <option value="game">Partita</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-semibold uppercase tracking-wider ${b.type === 'puzzle' ? 'text-blue-600' : 'text-green-600'}`}>
                          {b.type === 'puzzle' ? 'Puzzle' : 'Partita'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.puzzles}</div>
                <div className="text-xs text-blue-600 mt-1">Puzzle importati</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{result.games}</div>
                <div className="text-xs text-green-600 mt-1">Partite importate</div>
              </div>
              {result.skipped > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{result.skipped}</div>
                  <div className="text-xs text-yellow-600 mt-1">Duplicati saltati</div>
                </div>
              )}
              <div className="bg-sage-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-sage-700">{result.total}</div>
                <div className="text-xs text-sage-600 mt-1">Totale</div>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">Errori:</p>
                <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {step === 'paste' && (
            <>
              <button className="btn-ghost" onClick={onClose}>Annulla</button>
              <button className="btn-primary" onClick={handlePreview} disabled={loading || !text.trim()}>
                {loading ? 'Analisi...' : 'Anteprima'}
              </button>
            </>
          )}
          {step === 'preview' && (
            <>
              <button className="btn-ghost" onClick={() => setStep('paste')} disabled={loading}>Indietro</button>
              <button className="btn-primary" onClick={handleImport} disabled={loading}>
                {loading ? 'Importazione...' : 'Conferma importazione'}
              </button>
            </>
          )}
          {step === 'result' && (
            <button className="btn-primary" onClick={onClose}>Chiudi</button>
          )}
        </div>
      </div>
    </div>
  )
}
