import { useState, useRef } from 'react'

interface Props {
  onClose: () => void
  onUpload: (file: File, name: string) => void
}

export function UploadFileModal({ onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      if (!name) setName(f.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    onUpload(file, name.trim() || file.name)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-box shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Carica file</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
            {!file ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-sage-200 rounded-lg p-8 text-center hover:border-sage-500 transition-colors cursor-pointer"
              >
                <p className="text-sage-500 text-sm">Clicca per selezionare un file</p>
                <p className="text-xs text-sage-400 mt-1">PDF, Excel (.pdf, .xls, .xlsx)</p>
              </button>
            ) : (
              <div className="bg-sage-50 rounded-lg p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-sage-900 truncate">{file.name}</p>
                  <p className="text-xs text-sage-500">{formatSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); setName('') }}
                  className="text-sage-400 hover:text-red-500 text-sm"
                >
                  Rimuovi
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="Nome del file"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Annulla</button>
            <button type="submit" disabled={!file} className="btn-primary flex-1">Carica</button>
          </div>
        </form>
      </div>
    </div>
  )
}
