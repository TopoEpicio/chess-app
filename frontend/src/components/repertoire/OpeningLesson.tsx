import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Bot, ChevronRight, ChevronLeft, RotateCw } from 'lucide-react'
import { Chessboard } from '../board/ThemedBoard'
import { EducationalPanel } from '../analysis/EducationalPanel'
import { useUciEngine } from '../../engine/useUciEngine'
import { generateExplanation } from '../../engine/analysisEngine'
import { getDescendantIds } from '../../repertoire/tree'
import type { RepertoireNode } from '../../types'
import type { AnalysisExplanation } from '../../types/analysis'

interface Props {
  nodes: RepertoireNode[]
  rootNodeId?: string | null
  openingName?: string
  side?: 'white' | 'black'
  onExit: () => void
}

function buildMainPath(nodes: RepertoireNode[], startId: string): RepertoireNode[] {
  const childrenMap = new Map<string, RepertoireNode[]>()
  for (const node of nodes) {
    const pid = node.parentId || '__root__'
    if (!childrenMap.has(pid)) childrenMap.set(pid, [])
    childrenMap.get(pid)!.push(node)
  }

  const path: RepertoireNode[] = []
  const start = nodes.find(n => n.id === startId)
  if (!start) return path

  let current: RepertoireNode | undefined = start
  while (current) {
    path.push(current)
    const kids = (childrenMap.get(current.id) || []).sort((a, b) => a.depth - b.depth)
    const green = kids.find(k => k.colorCode === 'green')
    const yellow = kids.find(k => k.colorCode === 'yellow')
    current = green || yellow || kids[0]
  }

  return path
}

function colorDot(code: string) {
  const colors: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[code] ?? 'bg-[var(--color-surface-hover)]'}`} />
}

export function OpeningLesson({ nodes, rootNodeId, openingName, side, onExit }: Props) {
  const { t } = useTranslation('common')
  const startId = rootNodeId || nodes[0]?.id

  const visibleNodes = useMemo(() => {
    if (!rootNodeId) return nodes
    const ids = new Set(getDescendantIds(nodes, rootNodeId))
    return nodes.filter(n => ids.has(n.id))
  }, [nodes, rootNodeId])

  const path = useMemo(() => {
    if (!startId) return []
    return buildMainPath(visibleNodes, startId)
  }, [visibleNodes, startId])

  const [currentStep, setCurrentStep] = useState(0)
  const [showCoach, setShowCoach] = useState(false)
  const [boardFlipped, setBoardFlipped] = useState(side === 'black')
  const { deepAnalyze, ready: sfReady } = useUciEngine()
  const [nodeAnalysis, setNodeAnalysis] = useState<AnalysisExplanation | null>(null)

  const currentNode = path[currentStep]
  const isLastStep = currentStep >= path.length - 1

  const handlePrev = () => setCurrentStep(s => Math.max(0, s - 1))
  const handleNext = () => setCurrentStep(s => Math.min(path.length - 1, s + 1))

  const handleNodeClick = (index: number) => {
    setCurrentStep(index)
    setNodeAnalysis(null)
    const node = path[index]
    if (node) {
      deepAnalyze(node.fen).then(evals => {
        if (evals?.length) {
          setNodeAnalysis(generateExplanation({ multiPv: evals, fen: node.fen }))
        }
      })
    }
  }

  const currentFen = currentNode?.fen || 'start'

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors text-lg leading-none"
            title={t('repertoire.backToTree')}
          >
            <ArrowLeft size={16} className="inline-block" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {openingName ?? t('repertoire.lesson')}
          </h2>
          {path.length > 0 && (
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              {t('repertoire.moveCounter', { current: currentStep, total: path.length - 1 })}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowCoach(f => !f)}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
            showCoach
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-bg)]'
          }`}
        >
          <Bot size={16} className="inline-block" /> Coach
        </button>
      </div>

      {path.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-[var(--color-text-muted)]">{t('repertoire.noMovesForOpening')}</p>
        </div>
      ) : (
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left: move list */}
          <div className="w-[340px] shrink-0 bg-[var(--color-surface)] rounded-box border border-[var(--color-border)] overflow-y-auto">
            <div className="p-3 border-b border-[var(--color-border)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {t('repertoire.mainLine')}
              </span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {path.map((node, i) => {
                const isCurrent = i === currentStep
                const displayMove = node.moveSan
                const hasAnnotation = !!node.annotation
                const isRoot = i === 0

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(i)}
                    className={`w-full text-left px-3 py-2.5 transition-colors ${
                      isCurrent
                        ? 'bg-[var(--color-surface-hover)] border-l-3 border-[var(--color-primary)]'
                        : 'hover:bg-[var(--color-bg)]/50 border-l-3 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCurrent && <span className="text-[var(--color-text-muted)] text-xs font-bold shrink-0"><ChevronRight size={14} className="inline-block" /></span>}
                      {!isCurrent && <span className="w-3 shrink-0" />}
                      {!isRoot && colorDot(node.colorCode)}
                      <span className="text-xs text-[var(--color-text-muted)] font-mono shrink-0">
                        {isRoot ? '' : `${Math.ceil(i / 2)}.${i % 2 === 0 ? '...' : ''}`}
                      </span>
                      <span className={`font-mono text-sm ${
                        isCurrent ? 'font-bold text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'
                      }`}>
                        {displayMove || t('repertoire.initialPosition')}
                      </span>
                    </div>
                    {hasAnnotation && (
                      <div className={`mt-1 text-xs leading-relaxed pl-7 ${
                        isCurrent ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'
                      }`}>
                        {node.annotation}
                      </div>
                    )}
                    {!hasAnnotation && isCurrent && (
                      <div className="mt-1 text-xs leading-relaxed pl-7 text-[var(--color-text-muted)] italic">
                        {t('repertoire.noExplanation')}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center: board */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="relative" style={{ width: 520, aspectRatio: '1/1' }}>
              <Chessboard
                options={{
                  id: 'lesson-board',
                  position: currentFen === 'start' ? undefined : currentFen,
                  boardOrientation: boardFlipped ? 'black' : 'white',
                  boardStyle: {
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(45, 53, 39, 0.08)',
                  },
                }}
              />
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[var(--color-text-secondary)]"
                title={t('analysis.previousMove')}
              >
                <ChevronLeft size={16} className="inline-block" />
              </button>
              <button
                onClick={() => setBoardFlipped(f => !f)}
                className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)]"
                title={t('analysis.flipBoard')}
              >
                <RotateCw size={16} className="inline-block" />
              </button>
              <button
                onClick={handleNext}
                disabled={isLastStep}
                className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[var(--color-text-secondary)]"
                title={t('analysis.nextMove')}
              >
                <ChevronRight size={16} className="inline-block" />
              </button>
            </div>
          </div>

          {/* Right: coach panel */}
          {showCoach && (
            <div className="w-[300px] shrink-0 bg-[var(--color-surface)] rounded-box border border-[var(--color-border)] overflow-y-auto p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                {t('repertoire.coachAnalysis')}
              </div>
              {currentNode ? (
                <EducationalPanel
                  analysis={nodeAnalysis}
                  engineReady={sfReady}
                />
              ) : (
                <p className="text-sm text-[var(--color-text-muted)] italic">{t('repertoire.selectMove')}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
