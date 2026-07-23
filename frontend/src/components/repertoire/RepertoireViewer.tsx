import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ArrowLeft, Target, BookOpen, Plus } from 'lucide-react'
import { Chess } from 'chess.js'
import { ChessBoard } from '../board/ChessBoard'
import { RepertoireTree } from './RepertoireTree'
import { RepertoireInfoPanel } from './RepertoireInfoPanel'
import { RepertoireBoardControls } from './RepertoireBoardControls'
import { RepertoireNodeEditor } from './RepertoireNodeEditor'
import { RepertoireQuiz } from './RepertoireQuiz'
import { OpeningLesson } from './OpeningLesson'
import { useEngineAdapter } from '../../engine/EngineProvider'
import { generateExplanation } from '../../engine/analysisEngine'
import { normalizeNode, buildPathToNode, getDescendantIds } from '../../repertoire/tree'
import type { RepertoireNode } from '../../types'
import type { AnalysisExplanation } from '../../types/analysis'
import { api } from '../../api/client'
import { useRepertoireStore } from '../../stores/repertoireStore'

export function RepertoireViewer({
  repertoireId = 1,
  openingName,
  rootNodeId,
  side,
  onBack,
  onOpeningLinked,
}: {
  repertoireId?: number
  openingName?: string
  rootNodeId?: string | null
  side?: 'white' | 'black'
  onBack?: () => void
  onOpeningLinked?: (startingNodeId: string) => void
}) {
  const {
    nodes,
    selectedNodeId,
    setNodes,
    selectNode,
    addNode,
    removeNode,
    updateNode,
  } = useRepertoireStore()

  const [editingNode, setEditingNode] = useState<RepertoireNode | null>(null)
  const [showAddRoot, setShowAddRoot] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [lessonMode, setLessonMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEval, setShowEval] = useState(true)
  const [boardFlipped, setBoardFlipped] = useState(side === 'black')
  const { deepAnalyze, ready: sfReady } = useEngineAdapter()
  const [nodeAnalysis, setNodeAnalysis] = useState<AnalysisExplanation | null>(null)
  const analysisTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    loadTree()
  }, [repertoireId])

  const visibleNodes = useMemo(() => {
    if (!rootNodeId) return nodes
    const ids = new Set(getDescendantIds(nodes, rootNodeId))
    return nodes.filter(n => ids.has(n.id))
  }, [nodes, rootNodeId])

  const selectedNode = visibleNodes.find(n => n.id === selectedNodeId)

  const path = useMemo(() => buildPathToNode(visibleNodes, selectedNodeId), [visibleNodes, selectedNodeId])

  const pathIndex = selectedNodeId ? path.findIndex(n => n.id === selectedNodeId) : -1
  const hasPrev = pathIndex > 0
  const hasNext = pathIndex < path.length - 1 || visibleNodes.some(n => n.parentId === selectedNodeId)

  useEffect(() => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current)
    if (!selectedNodeId || !sfReady) return
    setNodeAnalysis(null)
    const node = nodes.find(n => n.id === selectedNodeId)
    if (!node) return
    analysisTimer.current = setTimeout(async () => {
      try {
        const evals = await deepAnalyze(node.fen)
        if (evals?.length) {
          const explanation = generateExplanation({ multiPv: evals, fen: node.fen })
          setNodeAnalysis(explanation)
        }
      } catch {
      }
    }, 1000)
    return () => { if (analysisTimer.current) clearTimeout(analysisTimer.current) }
  }, [selectedNodeId, sfReady])

  const loadTree = async () => {
    try {
      const data: any[] = await api.repertoire.getTree(repertoireId)
      const normalized = (data ?? []).map((n: any) => normalizeNode(n))
      setNodes(normalized)
      if (rootNodeId) {
        selectNode(rootNodeId)
      } else if (data.length > 0) {
        selectNode(data[0].id)
      }
    } catch (e) {
      console.error('Failed to load repertoire:', e)
    } finally {
      setLoading(false)
    }
  }

  const linkOpeningToNode = async (nodeId: string, fen: string) => {
    if (!openingName || rootNodeId) {
      console.log('[Link] Skipping: openingName=', openingName, 'rootNodeId=', rootNodeId)
      return
    }
    try {
      const list: any[] = await api.openings.list()
      console.log('[Link] Found', list.length, 'openings, looking for', openingName)
      const match = list.find(o => o.name === openingName)
      if (match) {
        console.log('[Link] Updating opening', match.id, 'with starting_node_id', nodeId)
        await api.openings.update(match.id, { starting_fen: fen, starting_node_id: Number(nodeId) })
      } else {
        console.log('[Link] Creating new opening', openingName)
        await api.openings.create({ name: openingName, side: side || 'white', starting_fen: fen, starting_node_id: Number(nodeId) })
      }
      onOpeningLinked?.(nodeId)
      console.log('[Link] Success')
    } catch (e) {
      console.error('[Link] Failed:', e)
    }
  }

  const handleAddRoot = () => {
    setShowAddRoot(true)
  }

  const handleAddChild = (parent: RepertoireNode) => {
    setEditingNode({
      ...parent,
      id: 'new',
      parentId: parent.id,
      moveSan: '',
      fen: 'start',
      annotation: '',
      colorCode: 'green',
      depth: parent.depth + 1,
      ecoCode: '',
    })
  }

  const handleEdit = (node: RepertoireNode) => {
    setEditingNode({ ...node })
  }

  const handleSave = async (formData: Partial<RepertoireNode>) => {
    try {
      if (formData.id === 'new' || !formData.id) {
        const raw: any = await api.repertoire.createNode({
          repertoire_id: repertoireId,
          parent_id: formData.parentId || null,
          fen: formData.fen,
          move_san: formData.moveSan,
          annotation: formData.annotation,
          color_code: formData.colorCode,
          depth: formData.depth,
          eco_code: formData.ecoCode,
        })
        const newNode = normalizeNode(raw, formData.parentId || null)
        addNode(newNode)
        selectNode(newNode.id)
        if (!formData.parentId) {
          linkOpeningToNode(newNode.id, newNode.fen)
        }
      } else {
        await api.repertoire.updateNode(formData.id, {
          annotation: formData.annotation,
          color_code: formData.colorCode,
        })
        updateNode(formData.id, formData)
      }
      setEditingNode(null)
      setShowAddRoot(false)
    } catch (e) {
      console.error('Failed to save node:', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo nodo e tutti i suoi figli?')) return
    try {
      await api.repertoire.deleteNode(id)
      removeNode(id)
    } catch (e) {
      console.error('Failed to delete node:', e)
    }
  }

  const handleCloseEditor = () => {
    setEditingNode(null)
    setShowAddRoot(false)
  }

  const handlePrevMove = useCallback(() => {
    if (pathIndex > 0) {
      selectNode(path[pathIndex - 1].id)
    }
  }, [path, pathIndex, selectNode])

  const handleNextMove = useCallback(() => {
    if (pathIndex < path.length - 1) {
      selectNode(path[pathIndex + 1].id)
    } else {
      const children = visibleNodes.filter(n => n.parentId === selectedNodeId)
      if (children.length > 0) {
        selectNode(children[0].id)
      }
    }
  }, [path, pathIndex, selectedNodeId, nodes, selectNode])

  const handleFlip = useCallback(() => {
    setBoardFlipped(f => !f)
  }, [])

  const handleToggleEval = useCallback(() => {
    setShowEval(f => !f)
  }, [])

  const breadcrumbSegments = useMemo(() => {
    return path.map((node, i) => ({
      id: node.id,
      label: node.moveSan || (i === 0 ? 'Radice' : ''),
      isLast: i === path.length - 1,
    })).filter(s => s.label)
  }, [path])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {lessonMode && selectedNode ? (
        <OpeningLesson
          nodes={visibleNodes}
          rootNodeId={selectedNode.id}
          openingName={openingName}
          side={side}
          onExit={() => setLessonMode(false)}
        />
      ) : quizMode && selectedNode ? (
        <RepertoireQuiz
          nodes={visibleNodes}
          startNodeId={selectedNode.id}
          onExit={() => setQuizMode(false)}
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-sage-500 hover:text-sage-700 transition-colors text-lg leading-none"
                  title="Tutte le aperture"
                >
                  <ArrowLeft size={16} className="inline-block" />
                </button>
              )}
              <h2 className="text-lg font-semibold text-sage-900">
                {openingName ?? 'Repertorio'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-ghost text-sm flex items-center gap-1.5"
                disabled={!selectedNode}
                title={!selectedNode ? 'Seleziona un nodo' : 'Avvia lezione'}
                onClick={() => selectedNode && setLessonMode(true)}
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Lezione</span>
              </button>
              <button
                className="btn-ghost text-sm flex items-center gap-1.5"
                disabled={!selectedNode}
                title={!selectedNode ? 'Seleziona un nodo' : 'Avvia quiz'}
                onClick={() => selectedNode && setQuizMode(true)}
              >
                <span><Target size={14} className="inline-block" /></span>
                <span className="hidden sm:inline">Quiz</span>
              </button>
              <button
                className="btn-primary text-sm flex items-center gap-1.5"
                onClick={handleAddRoot}
              >
                <Plus size={16} /> <span className="hidden sm:inline">Aggiungi radice</span>
              </button>
            </div>
          </div>

          {/* 3-panel grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 flex-1 min-h-0">
            {/* Panel 1: Tree */}
            <div className="bg-white rounded-box border border-sage-100 p-4 overflow-hidden flex flex-col min-h-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3 shrink-0">
                Albero repertorio
              </div>
              <RepertoireTree
                nodes={visibleNodes}
                selectedNodeId={selectedNodeId}
                onSelectNode={selectNode}
                onEditNode={handleEdit}
                onDeleteNode={handleDelete}
                onAddChild={handleAddChild}
              />
            </div>

            {/* Panel 2: Board + Controls */}
            <div className="space-y-4 min-w-0 overflow-y-auto">
              <div className="flex justify-center">
                <ChessBoard
                  boardWidth={520}
                  showEval={showEval}
                  boardOrientation={boardFlipped ? 'black' : 'white'}
                  position={selectedNode?.fen || 'start'}
                  onMove={({ from, to, promotion }) => {
                    if (!selectedNode) return
                    const g = new Chess(selectedNode.fen || undefined)
                    try {
                      g.move({ from, to, promotion })
                      const newFen = g.fen()
                      updateNode(selectedNode.id, { fen: newFen })
                    } catch {}
                  }}
                />
              </div>

              <RepertoireBoardControls
                path={path}
                currentNodeId={selectedNodeId}
                onSelectNode={selectNode}
                onPrevMove={handlePrevMove}
                onNextMove={handleNextMove}
                onFlip={handleFlip}
                showEval={showEval}
                onToggleEval={handleToggleEval}
                hasPrev={hasPrev}
                hasNext={hasNext}
              />
            </div>

            {/* Panel 3: Info Panel */}
            <div className="min-h-0">
              <RepertoireInfoPanel
                selectedNode={selectedNode || null}
                analysis={nodeAnalysis}
                engineReady={sfReady}
                onEdit={() => selectedNode && handleEdit(selectedNode)}
              />
            </div>
          </div>

          {/* Breadcrumb */}
          {breadcrumbSegments.length > 0 && (
            <div className="flex items-center gap-1.5 mt-4 text-xs text-sage-500 shrink-0 overflow-x-auto whitespace-nowrap">
              {onBack ? (
                <button onClick={onBack} className="hover:text-sage-700 transition-colors">{openingName ?? 'Aperture'}</button>
              ) : (
                <span className="hover:text-sage-700 transition-colors cursor-default">Repertorio</span>
              )}
              {breadcrumbSegments.map(seg => (
                <span key={seg.id} className="flex items-center gap-1.5">
                  <span className="text-sage-300">›</span>
                  {seg.isLast ? (
                    <span className="text-sage-700 font-medium">{seg.label}</span>
                  ) : (
                    <button
                      onClick={() => selectNode(seg.id)}
                      className="hover:text-sage-700 transition-colors"
                    >
                      {seg.label}
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Modals */}
          {(editingNode || showAddRoot) && (
            <RepertoireNodeEditor
              node={editingNode}
              onSave={handleSave}
              onClose={handleCloseEditor}
            />
          )}
        </>
      )}
    </div>
  )
}
