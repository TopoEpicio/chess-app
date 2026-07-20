import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { api } from '../api/client'
import { useMoveNavigation, type MoveItem } from '../engine/useMoveNavigation'

interface Props {
  gameId: number
  onBack: () => void
  onAnalyze: () => void
}

export function GameViewer({ gameId, onBack, onAnalyze }: Props) {
  const [moves, setMoves] = useState<MoveItem[]>([])
  const [game] = useState(() => new Chess())
  const [fen, setFen] = useState('start')
  const [loading, setLoading] = useState(true)
  const { currentIndex, goToMove, goNext, goPrev, canPrev, canNext } = useMoveNavigation(moves)

  useEffect(() => {
    api.analysis.getMoves(gameId).then((data: any) => {
      setMoves(data)
      setLoading(false)
    }).catch(console.error)
  }, [gameId])

  useEffect(() => {
    if (currentIndex === -1) {
      game.reset()
      setFen('start')
      return
    }
    const storedFen = moves[currentIndex]?.fen
    if (storedFen) {
      try { game.load(storedFen) } catch {}
      setFen(storedFen)
      return
    }
    game.reset()
    for (let i = 0; i <= currentIndex; i++) {
      const san = moves[i]?.san
      if (!san) { setFen(game.fen()); return }
      try { game.move(san) } catch { break }
    }
    setFen(game.fen())
  }, [currentIndex, moves])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sage-700">Caricamento partita...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost text-sm">
          &larr; Torna alle partite
        </button>
        <button onClick={onAnalyze} className="btn-primary text-sm">
          Analizza con Stockfish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div style={{ width: '100%', maxWidth: 480, aspectRatio: '1/1' }}>
            <Chessboard
              options={{
                id: 'game-board',
                position: fen === 'start' ? undefined : fen,
                onPieceDrop: ({ piece, sourceSquare, targetSquare }) => {
                  if (!targetSquare) return false
                  const promotion = piece.pieceType.toLowerCase() === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1') ? 'q' : undefined
                  try {
                    const result = game.move({ from: sourceSquare, to: targetSquare, promotion })
                    if (!result) return false
                    setFen(game.fen())
                    goToMove(-1)
                    return true
                  } catch {
                    return false
                  }
                },
                boardStyle: {
                  borderRadius: '8px',
                  boxShadow: '0 2px 12px rgba(45, 53, 39, 0.08)',
                },
                darkSquareStyle: { backgroundColor: '#7a9a6a' },
                lightSquareStyle: { backgroundColor: '#edeed7' },
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className={`px-4 py-2 rounded-box text-sm font-medium transition-colors ${
                canPrev ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
              }`}
            >
              &larr; Precedente
            </button>
            <span className="text-sm text-sage-700">
              {currentIndex + 1} / {moves.length}
            </span>
            <button
              onClick={goNext}
              disabled={!canNext}
              className={`px-4 py-2 rounded-box text-sm font-medium transition-colors ${
                canNext ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
              }`}
            >
              Successiva &rarr;
            </button>
          </div>
        </div>

        <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sage-500 mb-3">
            Mosse
          </h2>
          <div className="space-y-0.5 text-sm max-h-96 overflow-y-auto">
            {(() => {
              const pairs: Array<{ w: MoveItem; b?: MoveItem; wi: number; bi?: number }> = []
              for (let i = 0; i < moves.length; i++) {
                if (moves[i].is_white) {
                  const bi = i + 1 < moves.length && !moves[i + 1].is_white ? i + 1 : undefined
                  pairs.push({ w: moves[i], b: bi !== undefined ? moves[bi] : undefined, wi: i, bi })
                }
              }
              return pairs.map((pair) => {
                const isWhiteCurrent = pair.wi === currentIndex
                const isBlackCurrent = pair.bi === currentIndex
                return (
                  <div
                    key={pair.wi}
                    className="grid grid-cols-[36px_1fr_1fr] gap-1 px-2 py-1 rounded"
                  >
                    <span className="text-sage-500">{pair.w.move_number}.</span>
                    <span
                      className={`cursor-pointer rounded px-1 ${
                        isWhiteCurrent ? 'bg-sage-100 font-semibold' : 'hover:bg-sage-50'
                      }`}
                      onClick={() => goToMove(pair.wi)}
                    >
                      {pair.w.san}
                    </span>
                    {pair.b && (
                      <span
                        className={`cursor-pointer rounded px-1 ${
                          isBlackCurrent ? 'bg-sage-100 font-semibold' : 'hover:bg-sage-50'
                        }`}
                        onClick={() => goToMove(pair.bi!)}
                      >
                        {pair.b.san}
                      </span>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
