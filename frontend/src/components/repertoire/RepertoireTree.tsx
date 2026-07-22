import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Trash2, Pencil, X } from 'lucide-react'
import type { RepertoireNode } from '../../types'
import { filterTree, buildTree } from '../../repertoire/tree'

interface Props {
  nodes: RepertoireNode[]
  selectedNodeId: string | null
  onSelectNode: (id: string) => void
  onEditNode: (node: RepertoireNode) => void
  onDeleteNode: (id: string) => void
  onAddChild: (parent: RepertoireNode) => void
}

function TreeNode({
  node,
  depth = 0,
  selectedNodeId,
  onSelect,
  onEdit,
  onDelete,
  onAddChild,
}: {
  node: RepertoireNode
  depth?: number
  selectedNodeId: string | null
  onSelect: (id: string) => void
  onEdit: (node: RepertoireNode) => void
  onDelete: (id: string) => void
  onAddChild: (parent: RepertoireNode) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  const colorStyles: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors duration-150 ${
          selectedNodeId === node.id
            ? 'bg-sage-100'
            : 'hover:bg-sage-50'
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={e => {
          e.stopPropagation()
          onSelect(node.id)
        }}
      >
        <button
          onClick={e => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          className={`p-0.5 rounded transition-colors duration-150 ${hasChildren ? '' : 'invisible'}`}
        >
          {hasChildren ? (expanded ? <ChevronDown size={12} className="inline-block" /> : <ChevronRight size={12} className="inline-block" />) : ''}
        </button>

        <span
          className={`w-2 h-2 rounded-full shrink-0 ${colorStyles[node.colorCode] || colorStyles.green}`}
        />

        <span className="text-sm font-mono flex-1 truncate text-sage-900">{node.moveSan || '(radice)'}</span>

        {node.ecoCode && (
          <span className="text-[10px] bg-sage-100 text-sage-600 px-1.5 py-0.5 rounded shrink-0">
            {node.ecoCode}
          </span>
        )}

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={e => { e.stopPropagation(); onAddChild(node) }}
            className="p-1 text-sage-600 hover:bg-sage-100 rounded text-xs leading-none"
            title="Aggiungi figlio"
          >
            +
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit(node) }}
            className="p-1 text-sage-600 hover:bg-sage-100 rounded text-xs leading-none"
            title="Modifica"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(node.id) }}
            className="p-1 text-red-500 hover:bg-red-50 rounded text-xs leading-none"
            title="Elimina"
          >
            <Trash2 size={12} className="inline-block" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function RepertoireTree({
  nodes,
  selectedNodeId,
  onSelectNode,
  onEditNode,
  onDeleteNode,
  onAddChild,
}: Props) {
  const [search, setSearch] = useState('')

  const filteredNodes = useMemo(() => filterTree(nodes, search), [nodes, search])
  const roots = useMemo(() => buildTree(filteredNodes), [filteredNodes])

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filtra linee..."
          className="w-full text-sm px-3 py-2 pr-8 rounded-lg border border-sage-200 bg-sage-50 text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition-all duration-150"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 text-xs"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
        {roots.length === 0 ? (
          <div className="text-center text-sage-500 py-8 px-2">
            <p className="text-sm">
              {search
                ? 'Nessun risultato per la ricerca.'
                : 'Nessuna linea nel repertorio. Importa un PGN o aggiungi una radice.'}
            </p>
          </div>
        ) : (
          roots.map(root => (
            <TreeNode
              key={root.id}
              node={root}
              selectedNodeId={selectedNodeId}
              onSelect={onSelectNode}
              onEdit={onEditNode}
              onDelete={onDeleteNode}
              onAddChild={onAddChild}
            />
          ))
        )}
      </div>
    </div>
  )
}
