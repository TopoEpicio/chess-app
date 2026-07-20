import { Chess } from 'chess.js'
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
  const moves = buildDisplayMoves(path)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPrevMove}
          disabled={!hasPrev}
          className="p-2 rounded hover:bg-sage-100 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-sage-700"
          title="Mossa precedente"
        >
          ◀
        </button>
        <button
          onClick={onNextMove}
          disabled={!hasNext}
          className="p-2 rounded hover:bg-sage-100 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-sage-700"
          title="Mossa successiva"
        >
          ▶
        </button>
        <button
          onClick={onFlip}
          className="p-2 rounded hover:bg-sage-100 transition-colors duration-150 text-sage-700"
          title="Capovolgi scacchiera"
        >
          🔄
        </button>
        <button
          onClick={onToggleEval}
          className={`p-2 rounded hover:bg-sage-100 transition-colors duration-150 ${
            showEval ? 'text-sage-700' : 'text-sage-400'
          }`}
          title={showEval ? 'Nascondi valutazione' : 'Mostra valutazione'}
        >
          📊
        </button>
      </div>

      {moves.length > 0 && (
        <div className="bg-white rounded-box border border-sage-100 p-3">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm">
            {moves.flatMap(m => [
              <span
                key={`num-${m.number}`}
                className="text-sage-500 font-mono text-xs pt-0.5"
              >
                {m.number}.
              </span>,
              <button
                key={`w-${m.number}`}
                onClick={() => m.whiteNodeId && onSelectNode(m.whiteNodeId)}
                className={`font-mono text-left px-1.5 py-0.5 rounded transition-colors duration-150 ${
                  m.whiteNodeId === currentNodeId
                    ? 'bg-sage-100 font-semibold text-sage-900'
                    : 'hover:bg-sage-50 text-sage-700'
                }`}
              >
                {m.white || ''}
              </button>,
              <button
                key={`b-${m.number}`}
                onClick={() => m.blackNodeId && onSelectNode(m.blackNodeId)}
                className={`font-mono text-left px-1.5 py-0.5 rounded transition-colors duration-150 ${
                  m.blackNodeId === currentNodeId
                    ? 'bg-sage-100 font-semibold text-sage-900'
                    : 'hover:bg-sage-50 text-sage-700'
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
