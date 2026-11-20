import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('common')
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
        setError(t('repertoire.invalidFen'))
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
        setError(t('repertoire.invalidFen'))
        return
      }
    }
    onSave({ fen, moveSan, annotation, colorCode, ecoCode, depth })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] rounded-box shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {node ? t('repertoire.editNode') : t('repertoire.newNode')}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-xl leading-none"
            aria-label={t('common.close')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.fen')}
            </label>
            <input
              type="text"
              value={fen}
              onChange={handleFenChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.moveSan')}
            </label>
            <input
              type="text"
              value={moveSan}
              onChange={handleMoveSanChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder={t('repertoire.movePlaceholder')}
              />
            </div>
            <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.depth')}
            </label>
            <input
              type="number"
              value={depth}
              onChange={e => setDepth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.color')}
            </label>
            <div className="flex gap-2">
              {(['green', 'yellow', 'red'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setColorCode(c)}
                  className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                    colorCode === c
                      ? 'border-[var(--color-text)] scale-105'
                      : 'border-transparent hover:border-[var(--color-border)]'
                  }`}
                  style={{ backgroundColor: c === 'green' ? 'var(--color-success)' : c === 'yellow' ? 'var(--color-warning)' : 'var(--color-danger)' }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.ecoCode')}
            </label>
            <input
              type="text"
              value={ecoCode}
              onChange={e => setEcoCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder={t('repertoire.ecoPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              {t('repertoire.annotation')}
            </label>
            <textarea
              value={annotation}
              onChange={e => setAnnotation(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder={t('repertoire.annotationPlaceholder')}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              {node ? t('common.save') : t('common.create')}
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-[var(--color-border)]">
          <div style={{ width: 250, aspectRatio: '1/1' }}>
            <Chessboard
              options={{
                id: 'editor-board',
                position: fen === 'start' ? undefined : fen,
                allowDragging: false,
                boardStyle: {
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow)',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
