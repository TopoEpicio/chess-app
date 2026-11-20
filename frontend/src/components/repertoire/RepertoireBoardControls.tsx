import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { ChevronLeft, ChevronRight, RotateCw, BarChart3 } from 'lucide-react'
import type { RepertoireNode } from '../../types'

interface Props {
  path: RepertoireNode[]
  currentNodeId: string | null
  onSelectNode: (id: string) => void
  onPrevMove: () => void
  onNextMove: () => void
  onFlip: () => void
  showEval: boolean
  onToggleEval: () => void
  hasPrev: boolean
  hasNext: boolean
}

function buildDisplayMoves(path: RepertoireNode[]) {
  if (path.length < 2) return []

  const moves: { number: number; white?: string; black?: string; whiteNodeId?: string; blackNodeId?: string }[] = []
  let moveNum = 1
  let pendingWhite: { num: number; san: string; nodeId: string } | null = null

  for (let i = 1; i < path.length; i++) {
    const node = path[i]
    if (!node.moveSan) continue

    const parentFen = path[i - 1].fen || 'start'
    let isWhite = false
    try {
      const g = new Chess(parentFen)
      isWhite = g.turn() === 'w'
    } catch {
      isWhite = false
    }

    if (isWhite) {
      if (pendingWhite) {
        moves.push({ number: pendingWhite.num, white: pendingWhite.san, whiteNodeId: pendingWhite.nodeId })
        moveNum++
      }
      pendingWhite = { num: moveNum, san: node.moveSan, nodeId: node.id }
    } else {
      if (pendingWhite) {
        moves.push({
          number: pendingWhite.num,
          white: pendingWhite.san,
          whiteNodeId: pendingWhite.nodeId,
          black: node.moveSan,
          blackNodeId: node.id,
        })
        pendingWhite = null
        moveNum++
      } else {
        moves.push({ number: moveNum, black: node.moveSan, blackNodeId: node.id })
        moveNum++
      }
    }
  }

  if (pendingWhite) {
    moves.push({ number: pendingWhite.num, white: pendingWhite.san, whiteNodeId: pendingWhite.nodeId })
  }

  return moves
}

export function RepertoireBoardControls({
  path,
  currentNodeId,
  onSelectNode,
  onPrevMove,
  onNextMove,
  onFlip,
  showEval,
  onToggleEval,
  hasPrev,
  hasNext,
}: Props) {
  const { t } = useTranslation('common')
  const moves = buildDisplayMoves(path)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPrevMove}
          disabled={!hasPrev}
          className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-[var(--color-text-secondary)]"
          title={t('analysis.previousMove')}
        >
            <ChevronLeft size={16} className="inline-block" />
        </button>
        <button
          onClick={onNextMove}
          disabled={!hasNext}
          className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-[var(--color-text-secondary)]"
          title={t('analysis.nextMove')}
        >
            <ChevronRight size={16} className="inline-block" />
          </button>
          <button
            onClick={onFlip}
          className="p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors duration-150 text-[var(--color-text-secondary)]"
          title={t('analysis.flipBoard')}
        >
            <RotateCw size={16} className="inline-block" />
        </button>
        <button
          onClick={onToggleEval}
          className={`p-2 rounded hover:bg-[var(--color-surface-hover)] transition-colors duration-150 ${
            showEval ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
          }`}
          title={showEval ? t('analysis.hideEvaluation') : t('analysis.showEvaluation')}
        >
            <BarChart3 size={16} className="inline-block" />
        </button>
      </div>

      {moves.length > 0 && (
        <div className="bg-[var(--color-surface)] rounded-box border border-[var(--color-border)] p-3">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm">
            {moves.flatMap(m => [
              <span
                key={`num-${m.number}`}
                className="text-[var(--color-text-muted)] font-mono text-xs pt-0.5"
              >
                {m.number}.
              </span>,
              <button
                key={`w-${m.number}`}
                onClick={() => m.whiteNodeId && onSelectNode(m.whiteNodeId)}
                className={`font-mono text-left px-1.5 py-0.5 rounded transition-colors duration-150 ${
                  m.whiteNodeId === currentNodeId
                    ? 'bg-[var(--color-surface-hover)] font-semibold text-[var(--color-text)]'
                    : 'hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
                }`}
              >
                {m.white || ''}
              </button>,
              <button
                key={`b-${m.number}`}
                onClick={() => m.blackNodeId && onSelectNode(m.blackNodeId)}
                className={`font-mono text-left px-1.5 py-0.5 rounded transition-colors duration-150 ${
                  m.blackNodeId === currentNodeId
                    ? 'bg-[var(--color-surface-hover)] font-semibold text-[var(--color-text)]'
                    : 'hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
                }`}
              >
                {m.black || ''}
              </button>,
            ])}
          </div>
        </div>
      )}
    </div>
  )
}
