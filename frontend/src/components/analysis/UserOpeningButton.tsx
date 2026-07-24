import { useState } from 'react'
import { Bookmark, X, Save, AlertTriangle } from 'lucide-react'
import { saveUserOpening, isDuplicateFen } from '../../data/userOpenings'

interface UserOpeningButtonProps {
  openingName?: string
  fen: string
  eco?: string
}

export function UserOpeningButton({ openingName, fen, eco }: UserOpeningButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  if (!openingName || !fen) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const isDuplicate = await isDuplicateFen(fen)
      if (isDuplicate) {
        setMessage('Apertura già salvata')
        return
      }
      await saveUserOpening({ name: openingName, fen, eco })
      setMessage('Apertura salvata')
      setTimeout(() => {
        setMessage('')
        setShowDialog(false)
      }, 1500)
    } catch {
      setMessage('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-1.5 text-sm text-sage-600 hover:text-sage-900 transition-colors"
      >
        <Bookmark size={16} /> Aggiungi alle aperture
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-40">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowDialog(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sage-100">
              <h3 className="text-sm font-semibold text-sage-900">Salva apertura</h3>
              <button onClick={() => setShowDialog(false)} aria-label="Chiudi" className="text-sage-400 hover:text-sage-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">Nome apertura</label>
                <input
                  type="text"
                  defaultValue={openingName}
                  placeholder="Nome apertura"
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm bg-sage-50 text-sage-700 cursor-default"
                  readOnly
                />
              </div>
              {eco && (
                <div className="text-xs text-sage-500">
                  ECO: <span className="font-mono">{eco}</span>
                </div>
              )}
              <div className="text-xs text-sage-500 truncate font-mono">
                FEN: {fen}
              </div>

              {message && (
                <div className={`text-sm rounded-lg p-2 text-center ${
                  message.includes('già') || message.includes('Errore')
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message.includes('già') && <AlertTriangle size={14} className="inline mr-1" />}
                  {message}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t border-sage-100">
              <button
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 text-sm text-sage-600 hover:text-sage-900 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-xs flex items-center gap-1.5"
                aria-label="Salva"
              >
                <Save size={14} />
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}