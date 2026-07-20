import { useState } from 'react'

interface Props {
  onImport: (pgn: string) => void
  onClose: () => void
}

export function PgnImporter({ onImport, onClose }: Props) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      await onImport(text)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={onClose}>
      <div
        className="bg-white rounded-box shadow-lg p-6 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-1">Importa PGN</h2>
        <p className="text-sm text-sage-700 mb-4">
          Incolla il testo PGN della partita o del libro di aperture.
        </p>
        <textarea
          className="w-full h-40 border border-sage-200 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:border-sage-500"
          placeholder="1. e4 e5 2. Cf3 Cc6 3. Ac4 ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-ghost" onClick={onClose}>Annulla</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Importazione...' : 'Importa'}
          </button>
        </div>
      </div>
    </div>
  )
}
