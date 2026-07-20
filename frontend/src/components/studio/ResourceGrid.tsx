import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../utils/youtube'
import type { StudyResource } from '../../types'

interface Props {
  resources: StudyResource[]
  onOpenOpening: (resource: StudyResource) => void
  onOpenLink: (url: string) => void
  onPlayYoutube: (resource: StudyResource) => void
  onDownload: (resource: StudyResource) => void
  onRemove: (resource: StudyResource) => void
  onDragStart?: (e: React.DragEvent, resource: StudyResource) => void
  onDragOver?: (e: React.DragEvent, resource: StudyResource) => void
  onDrop?: (e: React.DragEvent, resource: StudyResource) => void
  onContextMenu?: (e: React.MouseEvent, resource: StudyResource) => void
  draggedId?: number | null
}

const TYPE_ICONS: Record<string, string> = {
  opening: '♟️',
  pdf: '📄',
  excel: '📊',
  link: '🔗',
  youtube: '▶️',
}

const TYPE_LABELS: Record<string, string> = {
  opening: 'Apertura',
  pdf: 'Documento PDF',
  excel: 'Foglio Excel',
  link: 'Link',
  youtube: 'Video YouTube',
}

export function ResourceGrid({
  resources, onOpenOpening, onOpenLink, onPlayYoutube, onDownload, onRemove,
  onDragStart, onDragOver, onDrop, onContextMenu, draggedId,
}: Props) {
  if (resources.length === 0) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">Risorse</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((res) => (
          <ResourceCard
            key={res.id}
            resource={res}
            onOpenOpening={onOpenOpening}
            onOpenLink={onOpenLink}
            onPlayYoutube={onPlayYoutube}
            onDownload={onDownload}
            onRemove={onRemove}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onContextMenu={onContextMenu}
            isDragged={draggedId === res.id}
          />
        ))}
      </div>
    </div>
  )
}

function ResourceCard({
  resource, onOpenOpening, onOpenLink, onPlayYoutube, onDownload, onRemove,
  onDragStart, onDragOver, onDrop, onContextMenu, isDragged,
}: {
  resource: StudyResource
  onOpenOpening: (r: StudyResource) => void
  onOpenLink: (url: string) => void
  onPlayYoutube: (r: StudyResource) => void
  onDownload: (r: StudyResource) => void
  onRemove: (r: StudyResource) => void
  onDragStart?: (e: React.DragEvent, r: StudyResource) => void
  onDragOver?: (e: React.DragEvent, r: StudyResource) => void
  onDrop?: (e: React.DragEvent, r: StudyResource) => void
  onContextMenu?: (e: React.MouseEvent, r: StudyResource) => void
  isDragged: boolean
}) {
  const handleClick = () => {
    if (resource.type === 'opening') onOpenOpening(resource)
    else if (resource.type === 'link' && resource.url) onOpenLink(resource.url)
    else if (resource.type === 'youtube') onPlayYoutube(resource)
    else if (resource.type === 'pdf' || resource.type === 'excel') onDownload(resource)
  }

  const icon = TYPE_ICONS[resource.type] ?? '📄'
  const label = TYPE_LABELS[resource.type] ?? resource.type

  const thumbnail = resource.type === 'youtube' && resource.url
    ? getYouTubeThumbnail(resource.url)
    : null

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, resource)}
      onDragOver={(e) => onDragOver?.(e, resource)}
      onDrop={(e) => onDrop?.(e, resource)}
      onContextMenu={(e) => onContextMenu?.(e, resource)}
      className={`bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-all group relative ${isDragged ? 'opacity-50' : ''}`}
      onClick={handleClick}
    >
      {resource.type === 'youtube' && thumbnail ? (
        <div className="relative mb-3 rounded-lg overflow-hidden bg-black aspect-video">
          <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-xl ml-0.5">▶</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl mb-2">{icon}</div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-sage-900 truncate">{resource.name}</p>
        <p className="text-xs text-sage-500 mt-0.5">{label}</p>
        {resource.fileSize && (
          <p className="text-xs text-sage-400 mt-0.5">
            {resource.fileSize > 1024 * 1024
              ? `${(resource.fileSize / (1024 * 1024)).toFixed(1)} MB`
              : `${(resource.fileSize / 1024).toFixed(1)} KB`}
          </p>
        )}
        {resource.description && (
          <p className="text-xs text-sage-600 mt-1 line-clamp-2">{resource.description}</p>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(resource) }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-sage-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        title="Rimuovi dalla cartella"
      >
        ×
      </button>
      <div className="absolute top-2 left-2 text-sage-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-sm">
        ⠿
      </div>
    </div>
  )
}
