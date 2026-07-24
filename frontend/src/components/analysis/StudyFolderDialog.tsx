import { useState, useEffect } from 'react'
import { FolderPlus, Trash2, X, Folder } from 'lucide-react'
import { listFolders, createFolder, deleteFolder } from '../../data/studyFolders'
import type { StudyFolder } from '../../data/studyFolders'

export function StudyFolderDialog() {
  const [open, setOpen] = useState(false)
  const [folders, setFolders] = useState<StudyFolder[]>([])
  const [newName, setNewName] = useState('')

  const loadFolders = async () => {
    const all = await listFolders()
    setFolders(all)
  }

  useEffect(() => {
    if (open) loadFolders()
  }, [open])

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createFolder({ name: newName.trim() })
    setNewName('')
    await loadFolders()
  }

  const handleDelete = async (id: number) => {
    await deleteFolder(id)
    await loadFolders()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-sage-600 hover:text-sage-900 transition-colors"
      >
        <Folder size={16} /> Gestisci cartelle
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sage-100">
              <h3 className="text-sm font-semibold text-sage-900">Cartelle studio</h3>
              <button onClick={() => setOpen(false)} aria-label="Chiudi" className="text-sage-400 hover:text-sage-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome cartella"
                  className="flex-1 px-3 py-2 border border-sage-200 rounded-lg text-sm outline-none focus:border-sage-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="btn-primary text-xs flex items-center gap-1.5"
                  aria-label="Crea"
                >
                  <FolderPlus size={14} /> Crea
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {folders.length === 0 ? (
                  <div className="text-center text-sm text-sage-500 py-6">Nessuna cartella creata</div>
                ) : (
                  folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-sage-50"
                    >
                      <div>
                        <div className="text-sm font-medium text-sage-900">{folder.name}</div>
                        <div className="text-xs text-sage-500">
                          {folder.openingIds.length} aperture
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(folder.id!)}
                        aria-label="Elimina"
                        className="text-sage-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
