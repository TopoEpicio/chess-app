import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, BarChart3, Pencil } from 'lucide-react'
import { EducationalPanel } from '../analysis/EducationalPanel'
import type { RepertoireNode } from '../../types'
import type { AnalysisExplanation } from '../../types/analysis'

interface Props {
  selectedNode: RepertoireNode | null
  analysis: AnalysisExplanation | null
  engineReady: boolean
  onEdit: () => void
}

type Tab = 'annotations' | 'coach' | 'stats'

export function RepertoireInfoPanel({ selectedNode, analysis, engineReady, onEdit }: Props) {
  const { t, i18n } = useTranslation('common')
  const [activeTab, setActiveTab] = useState<Tab>('annotations')

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'annotations', label: t('repertoire.annotations'), icon: <Pencil size={16} /> },
    { id: 'coach', label: t('repertoire.coach'), icon: <Bot size={16} className="inline-block" /> },
    { id: 'stats', label: t('repertoire.stats'), icon: <BarChart3 size={16} className="inline-block" /> },
  ]

  if (!selectedNode) {
    return (
      <div className="bg-[var(--color-surface)] rounded-box border border-[var(--color-border)] p-6 text-center h-full">
        <p className="text-sm text-[var(--color-text-muted)]">{t('repertoire.selectNode')}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-box border border-[var(--color-border)] flex flex-col h-full">
      <div className="flex border-b border-[var(--color-border)] shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-text)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'annotations' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-base font-semibold text-[var(--color-text)]">
                {selectedNode.moveSan || t('repertoire.initialPosition')}
              </span>
              <button
                onClick={onEdit}
                className="text-xs px-2 py-1 rounded btn-ghost"
              >
                <Pencil size={14} className="inline-block" /> {t('repertoire.edit')}
              </button>
            </div>
            {selectedNode.annotation ? (
              <div className="bg-[var(--color-surface-hover)] border-l-4 border-[var(--color-primary)] rounded-r-box p-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {selectedNode.annotation}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] italic">
                {t('repertoire.noAnnotation')}
              </p>
            )}
          </div>
        )}

        {activeTab === 'coach' && (
          <EducationalPanel analysis={analysis} engineReady={engineReady} />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">{t('repertoire.depth')}</span>
              <span className="font-mono text-[var(--color-text)]">{selectedNode.depth}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">{t('repertoire.status')}</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedNode.colorCode === 'green' ? 'bg-green-500' :
                  selectedNode.colorCode === 'yellow' ? 'bg-yellow-500' :
                  selectedNode.colorCode === 'red' ? 'bg-red-500' :
                  selectedNode.colorCode === 'blue' ? 'bg-blue-500' : 'bg-slate-400'
                }`} />
                <span className="text-[var(--color-text)]">
                  {selectedNode.colorCode === 'green' ? t('repertoire.known') :
                   selectedNode.colorCode === 'yellow' ? t('repertoire.needsReview') :
                   selectedNode.colorCode === 'red' ? t('repertoire.weak') :
                   selectedNode.colorCode === 'blue' ? t('repertoire.transposition') : selectedNode.colorCode}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">{t('repertoire.ecoCode')}</span>
              <span className="font-mono text-[var(--color-text)]">{selectedNode.ecoCode || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">{t('repertoire.fen')}</span>
              <span className="font-mono text-xs text-[var(--color-text-secondary)] truncate max-w-[180px]" title={selectedNode.fen}>
                {selectedNode.fen.length > 30 ? selectedNode.fen.slice(0, 30) + '…' : selectedNode.fen}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[var(--color-text-muted)]">{t('repertoire.created')}</span>
              <span className="text-[var(--color-text)]">
                {selectedNode.createdAt
                  ? new Date(selectedNode.createdAt).toLocaleDateString(i18n.language)
                  : '—'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
