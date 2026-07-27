import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { searchOpenings } from '../../data/openings'
import type { Opening } from '../../data/openings'

interface SearchDialogProps {
  onSelect: (opening: Opening) => void
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SearchDialog({ onSelect, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Opening[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(searchOpenings(query))
    }, 150)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-sage-100">
          <Search size={18} className="text-sage-400 shrink-0" />
          <h2 id="search-dialog-title" className="sr-only">Cerca apertura</h2>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca apertura..."
            className="flex-1 text-sm outline-none placeholder:text-sage-400"
          />
          <button onClick={onClose} aria-label="Chiudi" className="text-sage-400 hover:text-sage-600">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query ? (
            <div className="p-6 text-center text-sm text-sage-500">
              Nessuna apertura trovata per &quot;{query}&quot;
            </div>
          ) : (
            results.map((opening) => (
              <button
                key={opening.id}
                onClick={() => onSelect(opening)}
                className="w-full text-left px-4 py-3 hover:bg-sage-50 transition-colors border-b border-sage-50 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-sage-900">{opening.name}</span>
                  {opening.eco && (
                    <span className="text-xs text-sage-400 font-mono">{opening.eco}</span>
                  )}
                </div>
                {opening.variations.length > 0 && (
                  <div className="mt-1 text-xs text-sage-500">
                    {opening.variations.length} variazione{opening.variations.length !== 1 ? 'i' : ''}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
