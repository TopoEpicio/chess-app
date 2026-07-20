import { useState } from 'react'

interface Props {
  onClose: () => void
  onCreate: (name: string, description: string) => void
}

export function CreateFolderModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), description.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-box shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Nuova cartella</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="Es. Aperture Italiane"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Descrizione <span className="text-sage-400">(opzionale)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="Breve descrizione..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Annulla</button>
            <button type="submit" disabled={!name.trim()} className="btn-primary flex-1">Crea</button>
          </div>
        </form>
      </div>
    </div>
  )
}
