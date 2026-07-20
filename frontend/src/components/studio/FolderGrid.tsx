import type { StudyFolder } from '../../types'

interface Props {
  folders: StudyFolder[]
  onOpen: (folder: StudyFolder) => void
  onDelete: (folder: StudyFolder) => void
  onRename: (folder: StudyFolder) => void
  onContextMenu?: (e: React.MouseEvent, folder: StudyFolder) => void
}

export function FolderGrid({ folders, onOpen, onDelete, onRename, onContextMenu }: Props) {
  if (folders.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">Cartelle</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onOpen={onOpen}
            onDelete={onDelete}
            onRename={onRename}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </div>
  )
}

function FolderCard({ folder, onOpen, onDelete, onRename, onContextMenu }: {
  folder: StudyFolder
  onOpen: (f: StudyFolder) => void
  onDelete: (f: StudyFolder) => void
  onRename: (f: StudyFolder) => void
  onContextMenu?: (e: React.MouseEvent, f: StudyFolder) => void
}) {
  return (
    <div
      className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-all group relative"
      onClick={() => onOpen(folder)}
      onContextMenu={(e) => onContextMenu?.(e, folder)}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">📁</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-sage-900 truncate">{folder.name}</p>
          <p className="text-xs text-sage-500 mt-0.5">
            {folder.folderCount > 0 && `${folder.folderCount} cartelle `}
            {folder.resourceCount > 0 && `${folder.resourceCount} risorse`}
            {folder.folderCount === 0 && folder.resourceCount === 0 && 'Vuota'}
          </p>
          {folder.description && (
            <p className="text-xs text-sage-600 mt-1 line-clamp-2">{folder.description}</p>
          )}
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onRename(folder) }}
          className="w-6 h-6 rounded bg-white/80 text-sage-400 hover:text-sage-700 hover:bg-sage-50 flex items-center justify-center text-xs"
          title="Rinomina"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(folder) }}
          className="w-6 h-6 rounded bg-white/80 text-sage-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-xs"
          title="Elimina"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
