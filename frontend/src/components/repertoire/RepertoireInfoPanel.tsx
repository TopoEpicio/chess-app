import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState<Tab>('annotations')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'annotations', label: 'Annotazioni', icon: '📝' },
    { id: 'coach', label: 'Coach', icon: '🤖' },
    { id: 'stats', label: 'Statistiche', icon: '📊' },
  ]

  if (!selectedNode) {
    return (
      <div className="bg-white rounded-box border border-sage-100 p-6 text-center h-full">
        <p className="text-sm text-sage-500">Seleziona un nodo per vedere i dettagli</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-box border border-sage-100 flex flex-col h-full">
      <div className="flex border-b border-sage-100 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
              activeTab === tab.id
                ? 'border-b-2 border-sage-500 text-sage-900'
                : 'text-sage-500 hover:text-sage-700'
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
              <span className="font-mono text-base font-semibold text-sage-900">
                {selectedNode.moveSan || 'Posizione iniziale'}
              </span>
              <button
                onClick={onEdit}
                className="text-xs px-2 py-1 rounded btn-ghost"
              >
                ✎ Modifica
              </button>
            </div>
            {selectedNode.annotation ? (
              <div className="bg-sand-50 border-l-4 border-sage-500 rounded-r-box p-3 text-sm leading-relaxed text-sage-700">
                {selectedNode.annotation}
              </div>
            ) : (
              <p className="text-sm text-sage-500 italic">
                Nessuna annotazione. Clicca Modifica per aggiungere.
              </p>
            )}
          </div>
        )}

        {activeTab === 'coach' && (
          <EducationalPanel analysis={analysis} engineReady={engineReady} />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-500">Profondità</span>
              <span className="font-mono text-sage-900">{selectedNode.depth}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-500">Stato</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedNode.colorCode === 'green' ? 'bg-green-500' :
                  selectedNode.colorCode === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sage-900">
                  {selectedNode.colorCode === 'green' ? 'Conosciuta' :
                   selectedNode.colorCode === 'yellow' ? 'Da rivedere' : 'Debole'}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-500">Codice ECO</span>
              <span className="font-mono text-sage-900">{selectedNode.ecoCode || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-500">FEN</span>
              <span className="font-mono text-xs text-sage-700 truncate max-w-[180px]" title={selectedNode.fen}>
                {selectedNode.fen.length > 30 ? selectedNode.fen.slice(0, 30) + '…' : selectedNode.fen}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sage-500">Creazione</span>
              <span className="text-sage-900">
                {selectedNode.createdAt
                  ? new Date(selectedNode.createdAt).toLocaleDateString('it-IT')
                  : '—'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
