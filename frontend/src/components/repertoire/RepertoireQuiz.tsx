import { useState, useMemo, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import type { RepertoireNode } from '../../types'

interface Props {
  nodes: RepertoireNode[]
  startNodeId: string
  onExit: () => void
}

function buildPath(nodes: RepertoireNode[], startId: string): RepertoireNode[] {
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

export function RepertoireQuiz({ nodes, startNodeId, onExit }: Props) {
  const path = useMemo(() => buildPath(nodes, startNodeId), [nodes, startNodeId])
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: string } | null>(null)

  if (path.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-sage-700">Nodo selezionato non ha mosse da testare.</p>
        <button onClick={onExit} className="btn-primary">Torna all'albero</button>
      </div>
    )
  }

  const currentFen = path[step].fen
  const expected = path[step + 1]?.moveSan
  const totalSteps = path.length - 1
  const isLast = step >= path.length - 2
  const isComplete = isLast
  const score = results.filter(Boolean).length

  const handleDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare || feedback || isComplete) return false

    try {
      const testGame = new Chess(currentFen)
      const move = testGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
      if (!move) return false

      if (move.san === expected) {
        setResults(prev => [...prev, true])
        setStep(prev => Math.min(prev + 1, path.length - 2))
        setFeedback(null)
      } else {
        setFeedback({ correct: false, expected })
      }

      return true
    } catch {
      return false
    }
  }, [currentFen, expected, feedback, isComplete, path.length])

  const handleSkip = () => {
    if (!isComplete) {
      setResults(prev => [...prev, false])
      setStep(prev => Math.min(prev + 1, path.length - 2))
      setFeedback(null)
    }
  }

  const handleRetry = () => {
    setFeedback(null)
  }

  const handleRestart = () => {
    setStep(0)
    setResults([])
    setFeedback(null)
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="w-full max-w-md flex items-center justify-between">
        <button onClick={onExit} className="btn-ghost text-sm">&larr; Torna all'albero</button>
        {!isComplete && (
          <span className="text-sm text-sage-700">
            {step + 1} / {totalSteps}
          </span>
        )}
      </div>

      {!isComplete && (
        <div className="w-full max-w-md bg-sage-100 rounded-full h-2">
          <div
            className="bg-sage-500 h-2 rounded-full transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      )}

      <div className="relative" style={{ width: 400, aspectRatio: '1/1' }}>
        <Chessboard
          options={{
            id: 'quiz-board',
            position: currentFen === 'start' ? undefined : currentFen,
            onPieceDrop: isComplete ? undefined : handleDrop,
            boardStyle: {
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(45, 53, 39, 0.08)',
            },
            darkSquareStyle: { backgroundColor: '#7a9a6a' },
            lightSquareStyle: { backgroundColor: '#edeed7' },
          }}
        />
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <div className="bg-white rounded-box shadow-xl p-6 mx-4 text-center max-w-xs">
              <div className="text-red-600 font-semibold mb-2">✗ Mossa errata</div>
              <p className="text-sm text-sage-700 mb-1">
                La mossa corretta era:
              </p>
              <p className="text-lg font-mono font-bold text-sage-900 mb-4">
                {feedback.expected}
              </p>
              <div className="flex gap-2">
                <button onClick={handleSkip} className="btn-ghost flex-1 text-sm">
                  Salta
                </button>
                <button onClick={handleRetry} className="btn-primary flex-1 text-sm">
                  Riprova
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isComplete && !feedback && (
        <p className="text-sm text-sage-700">
          Gioca <strong className="font-mono">{expected}</strong>
        </p>
      )}

      {!isComplete && !feedback && (
        <button onClick={handleSkip} className="btn-ghost text-sm">
          Non lo so &rarr;
        </button>
      )}

      {isComplete && (
        <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-6 w-full max-w-md text-center">
          <div className="text-2xl font-bold mb-2">
            {score === totalSteps ? '🎉 Perfetto!' :
             score >= totalSteps * 0.7 ? '👏 Ottimo lavoro!' :
             score >= totalSteps * 0.4 ? '💪 Continua così!' : '📚 Da ripassare'}
          </div>
          <div className="text-sage-700 mb-4">
            {score} / {totalSteps} mosse corrette ({Math.round((score / totalSteps) * 100)}%)
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={handleRestart} className="btn-primary text-sm">
              Ripeti
            </button>
            <button onClick={onExit} className="btn-ghost text-sm">
              Torna all'albero
            </button>
          </div>
        </div>
      )}
    </div>
  )
}