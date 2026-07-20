import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { StudyFolder } from '../../types'

interface FolderPickerModalProps {
  title: string
  excludeId?: number | null
  onSelect: (folder: StudyFolder) => void
  onClose: () => void
}

export function FolderPickerModal({ title, excludeId, onSelect, onClose }: FolderPickerModalProps) {
  const [folders, setFolders] = useState<StudyFolder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.study.getFolderTree()
      .then(setFolders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const byParent: Record<number, StudyFolder[]> = {}
  const roots: StudyFolder[] = []
  for (const f of folders) {
    if (f.id === excludeId) continue
    if (f.parentId === null || f.parentId === undefined) {
      roots.push(f)
    } else {
      (byParent[f.parentId] ??= []).push(f)
    }
  }

  function renderTree(items: StudyFolder[], depth: number): JSX.Element[] {
    return items.flatMap(f => [
      <button
        key={f.id}
        onClick={() => onSelect(f)}
        className="w-full text-left px-4 py-2 text-sm hover:bg-sage-50 transition-colors flex items-center gap-2"
        style={{ paddingLeft: 16 + depth * 20 }}
      >
        <span>📁</span>
        <span>{f.name}</span>
      </button>,
      ...renderTree(byParent[f.id] ?? [], depth + 1),
    ])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-box shadow-xl w-full max-w-md max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-sage-100">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage-500 border-t-transparent" />
            </div>
          ) : roots.length === 0 ? (
            <p className="text-sm text-sage-500 text-center py-8">Nessuna cartella disponibile</p>
          ) : (
            renderTree(roots, 0)
          )}
        </div>
        <div className="p-3 border-t border-sage-100">
          <button onClick={onClose} className="btn-ghost w-full">Annulla</button>
        </div>
      </div>
    </div>
  )
}
