import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import type { StudyFolder, StudyResource, FolderContents } from '../types'
import { RepertoireViewer } from '../components/repertoire/RepertoireViewer'
import { Breadcrumb } from '../components/studio/Breadcrumb'
import { ArrowLeft, ChevronRight, FileText, BarChart3, LinkIcon, PlayIcon } from 'lucide-react'

type ResourceType = 'opening' | 'pdf' | 'excel' | 'link' | 'youtube'

interface Props {
  initialFolderId?: number | null
}

export function Studio({ initialFolderId }: Props) {
  const { t } = useTranslation('common')
  const [folderId, setFolderId] = useState<number | null>(initialFolderId ?? null)
  const [contents, setContents] = useState<FolderContents | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedOpening, setSelectedOpening] = useState<{ id: number; name: string; side: 'white' | 'black'; startingNodeId: string | null; repertoireId: number | null } | null>(null)
  const [resourceFilter, setResourceFilter] = useState<ResourceType | 'all'>('all')
  const [pageSize, setPageSize] = useState(25)

  const breadcrumb = useMemo(() => {
    const crumbs: Array<{ id: number | null; name: string }> = [{ id: null, name: t('nav.studio') }]
    // breadcrumb built from folder path
    return crumbs
  }, [folderId, t])

  const handleNavigate = (nextId: number | null) => {
    setFolderId(nextId)
  }

  const handleResourceClick = (resource: StudyResource) => {
    switch (resource.type) {
      case 'opening': {
        if (resource.openingId) {
          api.openings.get(resource.openingId).then((opening) => {
            setSelectedOpening({
              id: Number(opening.id),
              name: opening.name,
              side: opening.side,
              startingNodeId: opening.startingNodeId,
              repertoireId: opening.repertoireId,
            })
          }).catch(console.error)
        }
        break
      }
      case 'youtube': {
        if (resource.url) window.open(resource.url, '_blank', 'noopener,noreferrer')
        break
      }
      case 'link': {
        if (resource.url) window.open(resource.url, '_blank', 'noopener,noreferrer')
        break
      }
      case 'pdf':
      case 'excel': {
        if (resource.id) window.open(api.study.getDownloadUrl(resource.id), '_blank')
        break
      }
    }
  }

  const loadContents = async (id: number | null) => {
    setLoading(true)
    try {
      const data = id === null
        ? await api.study.getRootContents()
        : await api.study.getFolderContents(id)
      setContents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContents(folderId)
  }, [folderId])

  const filteredResources = resourceFilter === 'all'
    ? (contents?.resources ?? [])
    : (contents?.resources ?? []).filter(r => r.type === resourceFilter)

  const visibleFolders = contents?.folders ?? []
  const visibleResources = filteredResources.slice(0, pageSize)

  // If an opening is selected, show the repertoire viewer
  if (selectedOpening) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <button
          onClick={() => setSelectedOpening(null)}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} className="inline-block" /> {t('studio.backToStudio')}
        </button>
        {/* Legacy openings keep repertoire_id null; they read the shared tree at repertoire 1 */}
        <RepertoireViewer
          repertoireId={selectedOpening.repertoireId ?? 1}
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{t('studio.title')}</h1>
      </div>

      {folderId && (
        <button
          onClick={() => handleNavigate(contents?.folder?.parentId ?? null)}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} className="inline-block" /> {t('common.back')}
        </button>
      )}
      <Breadcrumb items={breadcrumb} onNavigate={handleNavigate} />

      {/* Filter bar */}
      {contents && contents.resources.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {[
              { value: 'all', label: <>{t('common.all')}</> },
              { value: 'opening', label: <><ChevronRight size={14} className="inline-block" /> {t('studio.openings')}</> },
              { value: 'pdf', label: <><FileText size={14} className="inline-block" /> PDF</> },
              { value: 'excel', label: <><BarChart3 size={14} className="inline-block" /> Excel</> },
              { value: 'link', label: <><LinkIcon size={14} className="inline-block" /> {t('studio.link')}</> },
              { value: 'youtube', label: <><PlayIcon size={14} className="inline-block" /> {t('studio.video')}</> },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setResourceFilter(f.value as ResourceType | 'all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  resourceFilter === f.value
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg)]'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-[var(--color-text-secondary)]">{t('common.show')}</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-[var(--color-border)] rounded text-xs bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-[var(--color-text-secondary)]">{t('common.of')} {filteredResources.length + visibleFolders.length}</span>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--color-primary)] border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleFolders.map((folder) => (
            <article
              key={folder.id}
              onClick={() => handleNavigate(folder.id)}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-text)]">{folder.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{t('common.resource_one', { count: folder.resourceCount ?? 0 })}</p>
            </article>
          ))}
          {visibleResources.map((resource) => (
            <article
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                {resource.type === 'youtube' ? (
                  <PlayIcon className="w-5 h-5" />
                ) : resource.type === 'pdf' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <LinkIcon className="w-5 h-5" />
                )}
              </div>
              <h3 className="font-semibold text-[var(--color-text)]">{resource.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{resource.type}</p>
            </article>
          ))}
          {visibleFolders.length === 0 && visibleResources.length === 0 && (
            <div className="col-span-full bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-8 text-center border border-[var(--color-border)]">
              <p className="text-[var(--color-text-secondary)]">{t('studio.noResourcesFound')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


