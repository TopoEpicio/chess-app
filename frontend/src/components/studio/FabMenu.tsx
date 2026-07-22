import { useState, useRef, useEffect } from 'react'
import { Folder, BookOpen, FileText, Link, Play, X, Plus } from 'lucide-react'

interface Props {
  onAddFolder: () => void
  onAddOpening: () => void
  onUploadFile: () => void
  onAddLink: () => void
  onAddYoutube: () => void
}

export function FabMenu({ onAddFolder, onAddOpening, onUploadFile, onAddLink, onAddYoutube }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const items = [
    { label: 'Nuova cartella', icon: <Folder size={16} className="inline-block" />, action: onAddFolder },
    { label: 'Nuova apertura', icon: <BookOpen size={16} />, action: onAddOpening },
    { label: 'Carica file', icon: <FileText size={16} className="inline-block" />, action: onUploadFile },
    { label: 'Aggiungi link', icon: <Link size={16} className="inline-block" />, action: onAddLink },
    { label: 'Aggiungi video YouTube', icon: <Play size={16} className="inline-block" />, action: onAddYoutube },
  ]

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-1 mb-2">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { setOpen(false); item.action() }}
              className="flex items-center gap-2 bg-white-pure rounded-lg shadow-lg px-4 py-2.5 text-sm text-sage-900 hover:bg-sage-50 transition-colors whitespace-nowrap border border-sage-100"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-sage-500 text-white rounded-full shadow-lg hover:bg-sage-700 transition-colors text-2xl flex items-center justify-center"
      >
        {open ? <X size={20} /> : <Plus size={20} />}
      </button>
    </div>
  )
}
