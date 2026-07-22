import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Chess } from 'chess.js'
import { Chessboard } from '../board/ThemedBoard'
import type { RepertoireNode } from '../../types'

interface Props {
  node: RepertoireNode | null
  onSave: (data: Partial<RepertoireNode>) => void
  onClose: () => void
}

export function RepertoireNodeEditor({ node, onSave, onClose }: Props) {
  const [fen, setFen] = useState(node?.fen || 'start')
  const [moveSan, setMoveSan] = useState(node?.moveSan || '')
  const [annotation, setAnnotation] = useState(node?.annotation || '')
  const [colorCode, setColorCode] = useState(node?.colorCode || 'green')
  const [ecoCode, setEcoCode] = useState(node?.ecoCode || '')
  const [depth, setDepth] = useState(node?.depth || 0)
  const [error, setError] = useState('')

  const gameRef = useState(() => new Chess())[0]

  useEffect(() => {
    if (fen !== 'start') {
      try {
        gameRef.load(fen)
      } catch {
        setError('FEN non valida')
        return
      }
    } else {
      gameRef.reset()
    }
    setError('')
  }, [fen])

  const handleFenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFen(e.target.value)
    setError('')
  }

  const handleMoveSanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoveSan(e.target.value)
  }

  const handleSave = () => {
    if (fen !== 'start') {
      try {
        const testGame = new Chess()
        testGame.load(fen)
      } catch {
        setError('FEN non valida')
        return
      }
    }
    onSave({ fen, moveSan, annotation, colorCode, ecoCode, depth })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-box shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-sage-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {node ? 'Modifica nodo' : 'Nuovo nodo'}
          </h2>
          <button
            onClick={onClose}
            className="text-sage-500 hover:text-sage-700 text-xl leading-none"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">
              FEN Position
            </label>
            <input
              type="text"
              value={fen}
              onChange={handleFenChange}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-sage-700 mb-1">
                Mossa (SAN)
              </label>
              <input
                type="text"
                value={moveSan}
                onChange={handleMoveSanChange}
                className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="es. e4"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-700 mb-1">
                Profondità
              </label>
              <input
                type="number"
                value={depth}
                onChange={e => setDepth(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">
              Colore
            </label>
            <div className="flex gap-2">
              {(['green', 'yellow', 'red'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setColorCode(c)}
                  className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                    colorCode === c
                      ? 'border-sage-700 scale-105'
                      : 'border-transparent hover:border-sage-300'
                  }`}
                  style={{ backgroundColor: c === 'green' ? '#5cb85c' : c === 'yellow' ? '#f0ad4e' : '#d9534f' }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">
              Codice ECO
            </label>
            <input
              type="text"
              value={ecoCode}
              onChange={e => setEcoCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="es. C54"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">
              Annotazione
            </label>
            <textarea
              value={annotation}
              onChange={e => setAnnotation(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="Note sulla posizione..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              {node ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-sage-100">
          <div style={{ width: 250, aspectRatio: '1/1' }}>
            <Chessboard
              options={{
                id: 'editor-board',
                position: fen === 'start' ? undefined : fen,
                allowDragging: false,
                boardStyle: {
                  borderRadius: '8px',
                  boxShadow: '0 2px 12px rgba(45, 53, 39, 0.08)',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}