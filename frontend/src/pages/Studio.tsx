import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import { RepertoireViewer } from '../components/repertoire/RepertoireViewer'
import { Breadcrumb } from '../components/studio/Breadcrumb'
import { FolderGrid } from '../components/studio/FolderGrid'
import { ResourceGrid } from '../components/studio/ResourceGrid'
import { FabMenu } from '../components/studio/FabMenu'
import { ContextMenu } from '../components/studio/ContextMenu'
import { FolderPickerModal } from '../components/studio/FolderPickerModal'
import { CreateFolderModal } from '../components/studio/CreateFolderModal'
import { UploadFileModal } from '../components/studio/UploadFileModal'
import { AddLinkModal } from '../components/studio/AddLinkModal'
import { YouTubePlayer } from '../components/studio/YouTubePlayer'
import { CreateOpeningModal } from '../components/repertoire/RepertoireSelector'
import type { StudyFolder, StudyResource, FolderContents, BreadcrumbItem, Opening, ResourceType } from '../types'
import { ArrowLeft, ChevronRight, FileText, BarChart3, Link as LinkIcon, Play as PlayIcon, FolderOpen, Pencil, Move, Trash2, ClipboardList, Minus } from 'lucide-react'

type CtxTarget =
  | { type: 'folder'; item: StudyFolder }
  | { type: 'resource'; item: StudyResource }

export function Studio() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [contents, setContents] = useState<FolderContents | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null)
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [resourceFilter, setResourceFilter] = useState<ResourceType | 'all'>('all')
  const [pageSize, setPageSize] = useState(50)

  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showCreateOpening, setShowCreateOpening] = useState(false)
  const [showUploadFile, setShowUploadFile] = useState(false)
  const [showAddLink, setShowAddLink] = useState<'link' | 'youtube' | null>(null)
  const [showYoutubePlayer, setShowYoutubePlayer] = useState<StudyResource | null>(null)
  const [renameFolder, setRenameFolder] = useState<StudyFolder | null>(null)
  const [renameResource, setRenameResource] = useState<StudyResource | null>(null)

  // Context menu
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; target: CtxTarget } | null>(null)

  // Folder picker for move/copy
  const [folderPicker, setFolderPicker] = useState<{
    mode: 'move' | 'copy'
    target: CtxTarget
  } | null>(null)

  const loadContents = useCallback(async (folderId: number | null) => {
    setLoading(true)
    try {
      if (folderId === null) {
        const data = await api.study.getRootContents()
        setContents(data)
        setBreadcrumb([])
      } else {
        const [data, bc] = await Promise.all([
          api.study.getFolderContents(folderId),
          api.study.getBreadcrumb(folderId),
        ])
        setContents(data)
        setBreadcrumb(bc)
      }
    } catch (e) {
      console.error('Failed to load studio contents:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadContents(currentFolderId) }, [currentFolderId, loadContents])

  const handleNavigate = (folderId: number | null) => {
    setCurrentFolderId(folderId)
  }

  const handleOpenOpening = (res: StudyResource) => {
    if (!res.openingId) return
    api.openings.list().then((openings) => {
      const found = openings.find(o => o.id === String(res.openingId))
      if (found) setSelectedOpening(found)
    })
  }

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener')
  }

  const handlePlayYoutube = (res: StudyResource) => {
    setShowYoutubePlayer(res)
  }

  const handleDownload = (res: StudyResource) => {
    const url = api.study.getDownloadUrl(res.id)
    window.open(url, '_blank')
  }

  const handleRemoveResource = async (res: StudyResource) => {
    if (!currentFolderId) return
    try {
      await api.study.removeFromFolder(currentFolderId, res.id)
      await loadContents(currentFolderId)
    } catch (e) {
      console.error('Failed to remove resource:', e)
    }
  }

  // Drag & drop reorder
  const handleDragStart = (e: React.DragEvent, res: StudyResource) => {
    setDraggedId(res.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, _res: StudyResource) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetRes: StudyResource) => {
    e.preventDefault()
    if (!draggedId || !currentFolderId || draggedId === targetRes.id) {
      setDraggedId(null)
      return
    }
    const ids = (contents?.resources ?? []).map(r => r.id)
    const fromIdx = ids.indexOf(draggedId)
    const toIdx = ids.indexOf(targetRes.id)
    if (fromIdx === -1 || toIdx === -1) { setDraggedId(null); return }
    ids.splice(fromIdx, 1)
    ids.splice(toIdx, 0, draggedId)
    try {
      await api.study.reorderResources(currentFolderId, ids)
      await loadContents(currentFolderId)
    } catch (e) {
      console.error('Reorder failed:', e)
    }
    setDraggedId(null)
  }

  const handleCreateFolder = async (name: string, description: string) => {
    try {
      await api.study.createFolder({ name, parentId: currentFolderId, description })
      await loadContents(currentFolderId)
      setShowCreateFolder(false)
    } catch (e) { console.error(e) }
  }

  const handleRenameFolder = async () => {
    if (!renameFolder) return
    try {
      await api.study.updateFolder(renameFolder.id, { name: renameFolder.name })
      setRenameFolder(null)
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  const handleDeleteFolder = async (folder: StudyFolder) => {
    if (!confirm(`Eliminare la cartella "${folder.name}"? Le risorse al suo interno non verranno cancellate.`)) return
    try {
      await api.study.deleteFolder(folder.id)
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  const handleCreateOpening = async () => {
    setShowCreateOpening(false)
    await loadContents(currentFolderId)
  }

  const handleUploadFile = async (file: File, name: string) => {
    try {
      const res = await api.study.uploadResource(file, name)
      if (currentFolderId) {
        await api.study.addToFolder(currentFolderId, res.id)
      }
      await loadContents(currentFolderId)
      setShowUploadFile(false)
    } catch (e) { console.error(e) }
  }

  const handleAddLink = async (name: string, url: string, description: string) => {
    try {
      const res = await api.study.createResource({
        type: showAddLink === 'youtube' ? 'youtube' : 'link',
        name, url, description,
      })
      if (currentFolderId) {
        await api.study.addToFolder(currentFolderId, res.id)
      }
      await loadContents(currentFolderId)
      setShowAddLink(null)
    } catch (e) { console.error(e) }
  }

  // --- Context menu ---
  const showContextMenu = (e: React.MouseEvent, target: CtxTarget) => {
    e.preventDefault()
    setCtxMenu({ x: e.clientX, y: e.clientY, target })
  }

  const handleRenameResourceSubmit = async () => {
    if (!renameResource) return
    try {
      await api.study.updateResource(renameResource.id, { name: renameResource.name })
      setRenameResource(null)
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  const handleDeleteResource = async (res: StudyResource) => {
    if (!confirm(`Eliminare la risorsa "${res.name}"?`)) return
    try {
      await api.study.deleteResource(res.id)
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  const handleMoveToFolder = async (targetFolder: StudyFolder) => {
    if (!folderPicker) return
    const { mode, target } = folderPicker
    setFolderPicker(null)
    try {
      if (target.type === 'folder') {
        await api.study.updateFolder(target.item.id, { parentId: targetFolder.id })
      } else {
        await api.study.addToFolder(targetFolder.id, target.item.id)
        if (currentFolderId) {
          await api.study.removeFromFolder(currentFolderId, target.item.id)
        }
      }
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  const handleCopyToFolder = async (targetFolder: StudyFolder) => {
    if (!folderPicker) return
    const { target } = folderPicker
    setFolderPicker(null)
    try {
      await api.study.addToFolder(targetFolder.id, target.item.id)
      await loadContents(currentFolderId)
    } catch (e) { console.error(e) }
  }

  // If an opening is selected, show the repertoire viewer
  if (selectedOpening) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <button
          onClick={() => setSelectedOpening(null)}
          className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} className="inline-block" /> Torna allo Studio
        </button>
        <RepertoireViewer
          repertoireId={1}
          openingName={selectedOpening.name}
          rootNodeId={selectedOpening.startingNodeId}
          side={selectedOpening.side}
          onBack={() => setSelectedOpening(null)}
          onOpeningLinked={(startingNodeId) =>
            setSelectedOpening({ ...selectedOpening, startingNodeId })
          }
        />
      </div>
    )
  }

  const filteredResources = resourceFilter === 'all'
    ? (contents?.resources ?? [])
    : (contents?.resources ?? []).filter(r => r.type === resourceFilter)

  const visibleFolders = contents?.folders ?? []
  const visibleResources = filteredResources.slice(0, pageSize)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Studio</h1>
      </div>

      {currentFolderId && (
        <button
          onClick={() => handleNavigate(contents?.folder?.parentId ?? null)}
          className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} className="inline-block" /> Torna indietro
        </button>
      )}
      <Breadcrumb items={breadcrumb} onNavigate={handleNavigate} />

      {/* Filter bar */}
      {contents && contents.resources.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {[
              { value: 'all', label: <>Tutti</> },
              { value: 'opening', label: <><ChevronRight size={14} className="inline-block" /> Aperture</> },
              { value: 'pdf', label: <><FileText size={14} className="inline-block" /> PDF</> },
              { value: 'excel', label: <><BarChart3 size={14} className="inline-block" /> Excel</> },
              { value: 'link', label: <><LinkIcon size={14} className="inline-block" /> Link</> },
              { value: 'youtube', label: <><PlayIcon size={14} className="inline-block" /> Video</> },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setResourceFilter(f.value as ResourceType | 'all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  resourceFilter === f.value
                    ? 'bg-sage-500 text-white'
                    : 'bg-white text-sage-700 border border-sage-200 hover:bg-sage-50'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-sage-500">Mostra</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-sage-200 rounded text-xs bg-white text-sage-900 focus:outline-none focus:border-sage-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-sage-500">di {filteredResources.length + visibleFolders.length}</span>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {!contents || (visibleFolders.length === 0 && visibleResources.length === 0) ? (
            <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-8 text-center">
              <p className="text-sage-700 mb-2">
                {resourceFilter !== 'all'
                  ? `Nessuna risorsa di questo tipo in questa cartella`
                  : currentFolderId
                    ? 'Questa cartella è vuota'
                    : 'Benvenuto in Studio!'}
              </p>
              <p className="text-sm text-sage-500 mb-4">
                {currentFolderId
                  ? 'Aggiungi cartelle, aperture, file o link usando il pulsante +'
                  : 'Crea la tua prima cartella per organizzare lo studio'}
              </p>
            </div>
          ) : (
            <>
              <FolderGrid
                folders={visibleFolders}
                onOpen={(f) => handleNavigate(f.id)}
                onDelete={handleDeleteFolder}
                onRename={(f) => setRenameFolder(f)}
                onContextMenu={(e, f) => showContextMenu(e, { type: 'folder', item: f })}
              />
              <ResourceGrid
                resources={visibleResources}
                onOpenOpening={handleOpenOpening}
                onOpenLink={handleOpenLink}
                onPlayYoutube={handlePlayYoutube}
                onDownload={handleDownload}
                onRemove={handleRemoveResource}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onContextMenu={(e, r) => showContextMenu(e, { type: 'resource', item: r })}
                draggedId={draggedId}
              />
            </>
          )}
        </>
      )}

      {/* FAB */}
      <FabMenu
        onAddFolder={() => setShowCreateFolder(true)}
        onAddOpening={() => setShowCreateOpening(true)}
        onUploadFile={() => setShowUploadFile(true)}
        onAddLink={() => setShowAddLink('link')}
        onAddYoutube={() => setShowAddLink('youtube')}
      />

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreate={handleCreateFolder}
        />
      )}
      {showCreateOpening && (
        <CreateOpeningModal
          onClose={handleCreateOpening}
          onCreated={handleCreateOpening}
        />
      )}
      {showUploadFile && (
        <UploadFileModal
          onClose={() => setShowUploadFile(false)}
          onUpload={handleUploadFile}
        />
      )}
      {showAddLink && (
        <AddLinkModal
          type={showAddLink}
          onClose={() => setShowAddLink(null)}
          onCreate={handleAddLink}
        />
      )}
      {showYoutubePlayer && (
        <YouTubePlayer
          url={showYoutubePlayer.url ?? ''}
          title={showYoutubePlayer.name}
          onClose={() => setShowYoutubePlayer(null)}
        />
      )}
      {renameFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRenameFolder(null)}>
          <div className="bg-white rounded-box shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Rinomina cartella</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={renameFolder.name}
                  onChange={e => setRenameFolder({ ...renameFolder, name: e.target.value })}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setRenameFolder(null)} className="btn-ghost flex-1">Annulla</button>
                <button onClick={handleRenameFolder} disabled={!renameFolder.name.trim()} className="btn-primary flex-1">Salva</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {renameResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRenameResource(null)}>
          <div className="bg-white rounded-box shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Rinomina risorsa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-sage-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={renameResource.name}
                  onChange={e => setRenameResource({ ...renameResource, name: e.target.value })}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setRenameResource(null)} className="btn-ghost flex-1">Annulla</button>
                <button onClick={handleRenameResourceSubmit} disabled={!renameResource.name.trim()} className="btn-primary flex-1">Salva</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          onClose={() => setCtxMenu(null)}
          items={
            ctxMenu.target.type === 'folder'
              ? [
                  { label: 'Apri', icon: <FolderOpen size={14} className="inline-block" />, onClick: () => handleNavigate(ctxMenu.target.item.id) },
                  { label: 'Rinomina', icon: <Pencil size={14} className="inline-block" />, onClick: () => { setRenameFolder(ctxMenu.target.item as StudyFolder) } },
                  { label: 'Sposta in...', icon: <Move size={14} className="inline-block" />, onClick: () => setFolderPicker({ mode: 'move', target: ctxMenu.target }) },
                  { label: 'Elimina', icon: <Trash2 size={14} className="inline-block" />, onClick: () => handleDeleteFolder(ctxMenu.target.item as StudyFolder), danger: true },
                ]
              : [
                  { label: 'Rinomina', icon: <Pencil size={14} className="inline-block" />, onClick: () => { setRenameResource(ctxMenu.target.item as StudyResource) } },
                  { label: 'Sposta in...', icon: <Move size={14} className="inline-block" />, onClick: () => setFolderPicker({ mode: 'move', target: ctxMenu.target }) },
                  { label: 'Copia in...', icon: <ClipboardList size={14} className="inline-block" />, onClick: () => setFolderPicker({ mode: 'copy', target: ctxMenu.target }) },
                  { label: 'Rimuovi dalla cartella', icon: <Minus size={14} className="inline-block" />, onClick: () => handleRemoveResource(ctxMenu.target.item as StudyResource) },
                  { label: 'Elimina definitivamente', icon: <Trash2 size={14} className="inline-block" />, onClick: () => handleDeleteResource(ctxMenu.target.item as StudyResource), danger: true },
                ]
          }
        />
      )}

      {/* Folder picker for move/copy */}
      {folderPicker && (
        <FolderPickerModal
          title={folderPicker.mode === 'move' ? 'Sposta in...' : 'Copia in...'}
          excludeId={folderPicker.target.type === 'folder' ? folderPicker.target.item.id : null}
          onSelect={(f) => folderPicker.mode === 'move' ? handleMoveToFolder(f) : handleCopyToFolder(f)}
          onClose={() => setFolderPicker(null)}
        />
      )}
    </div>
  )
}
