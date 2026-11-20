import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bookmark, X, Save, AlertTriangle } from 'lucide-react'
import { saveUserOpening, isDuplicateFen } from '../../data/userOpenings'

interface UserOpeningButtonProps {
  openingName?: string
  fen: string
  eco?: string
}

type SaveStatus = 'idle' | 'saved' | 'duplicate' | 'error'

export function UserOpeningButton({ openingName, fen, eco }: UserOpeningButtonProps) {
  const { t } = useTranslation('common')
  const [showDialog, setShowDialog] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(openingName ?? '')

  if (!fen) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const isDuplicate = await isDuplicateFen(fen)
      if (isDuplicate) {
        setStatus('duplicate')
        return
      }
      await saveUserOpening({ name: (name.trim() || (openingName ?? '')), fen, eco })
      setStatus('saved')
      setTimeout(() => {
        setStatus('idle')
        setShowDialog(false)
      }, 1500)
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const message = status === 'duplicate'
    ? t('analysis.openingAlreadySaved')
    : status === 'saved'
      ? t('analysis.openingSaved')
      : status === 'error'
        ? t('analysis.saveOpeningError')
        : ''

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
      >
        <Bookmark size={16} /> {t('analysis.addToOpenings')}
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-40">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowDialog(false)} />
          <div className="relative bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-[var(--color-border)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{t('analysis.saveOpening')}</h3>
              <button onClick={() => setShowDialog(false)} aria-label={t('common.close')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">{t('analysis.openingName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('analysis.openingName')}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
                />
              </div>
              {eco && (
                <div className="text-xs text-[var(--color-text-muted)]">
                  ECO: <span className="font-mono">{eco}</span>
                </div>
              )}
              <div className="text-xs text-[var(--color-text-muted)] truncate font-mono">
                FEN: {fen}
              </div>

              {message && (
                <div className={`text-sm rounded-lg p-2 text-center ${status === 'duplicate' || status === 'error' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  {status === 'duplicate' && <AlertTriangle size={14} className="inline mr-1" />}
                  {message}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--color-border)]">
              <button
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-xs flex items-center gap-1.5"
                aria-label={t('common.save')}
              >
                <Save size={14} />
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}