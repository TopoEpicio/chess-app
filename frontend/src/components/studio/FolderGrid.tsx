import { useTranslation } from 'react-i18next'
import type { StudyFolder } from '../../types'
import { Folder, Pencil, Trash2 } from 'lucide-react'

interface Props {
  folders: StudyFolder[]
  onOpen: (folder: StudyFolder) => void
  onDelete: (folder: StudyFolder) => void
  onRename: (folder: StudyFolder) => void
  onContextMenu?: (e: React.MouseEvent, folder: StudyFolder) => void
}

export function FolderGrid({ folders, onOpen, onDelete, onRename, onContextMenu }: Props) {
  const { t } = useTranslation()
  if (folders.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">{t('studio.folder.title')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onOpen={onOpen}
            onDelete={onDelete}
            onRename={onRename}
            onContextMenu={onContextMenu}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

function FolderCard({ folder, onOpen, onDelete, onRename, onContextMenu, t }: {
  folder: StudyFolder
  onOpen: (f: StudyFolder) => void
  onDelete: (f: StudyFolder) => void
  onRename: (f: StudyFolder) => void
  onContextMenu?: (e: React.MouseEvent, f: StudyFolder) => void
  t: (key: string) => string
}) {
  return (
    <div
      className="bg-surface rounded-box shadow-card p-4 cursor-pointer hover:shadow-card transition-all group relative"
      onClick={() => onOpen(folder)}
      onContextMenu={(e) => onContextMenu?.(e, folder)}
    >
      <div className="flex items-start gap-3">
        <Folder size={28} className="inline-block" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-sage-900 truncate">{folder.name}</p>
          <p className="text-xs text-sage-500 mt-0.5">
            {folder.folderCount > 0 && `${folder.folderCount} ${t('studio.folder.title').toLowerCase()} `}
            {folder.resourceCount > 0 && `${folder.resourceCount} ${t('studio.tabs.resources').toLowerCase()}`}
            {folder.folderCount === 0 && folder.resourceCount === 0 && t('studio.folder.empty')}
          </p>
          {folder.description && (
            <p className="text-xs text-sage-600 mt-1 line-clamp-2">{folder.description}</p>
          )}
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onRename(folder) }}
          className="w-6 h-6 rounded bg-surface/80 text-sage-400 hover:text-sage-700 hover:bg-sage-100 flex items-center justify-center text-xs"
          title={t('studio.contextMenu.rename')}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(folder) }}
          className="w-6 h-6 rounded bg-surface/80 text-sage-400 hover:text-red-500 hover:bg-red-100 flex items-center justify-center text-xs"
          title={t('studio.contextMenu.delete')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
