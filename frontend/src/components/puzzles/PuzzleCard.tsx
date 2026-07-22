import { useState, useEffect } from 'react'
import { Chessboard } from '../board/ThemedBoard'
import { Chess } from 'chess.js'
import { getThemeLabel, MATE_THEMES } from '../../data/puzzleCategories'
import type { AnalysisExplanation } from '../../types/analysis'
import { X, Check, Zap, Skull, Target, Crown, ArrowUp, AlertTriangle } from 'lucide-react'

interface Props {
  puzzle: {
    id: number
    fen: string
    solution: string[]
    theme: string[]
    difficulty: number
    phase?: string
  }
  onSolve: (correct: boolean, timeMs: number) => void
  getExplanation?: (fen: string) => Promise<AnalysisExplanation | null>
  onClick?: () => void
  onDelete?: (id: number) => void
}

export function PuzzleCard({ puzzle, onSolve, getExplanation, onClick, onDelete }: Props) {
  const [game] = useState(() => new Chess())
  const [position, setPosition] = useState(puzzle.fen)
  const [currentMove, setCurrentMove] = useState(0)
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [startTime] = useState(Date.now())
  const [showSolution, setShowSolution] = useState(false)
  const [explanation, setExplanation] = useState<AnalysisExplanation | null>(null)
  const [explaining, setExplaining] = useState(false)

  useEffect(() => {
    try {
      game.load(puzzle.fen)
      setPosition(puzzle.fen)
    } catch (e) {
      console.error('Invalid FEN:', puzzle.fen)
    }
  }, [puzzle.fen])

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (solved || failed || !targetSquare) return false

    const promotion = game.turn() === 'w' && targetSquare[1] === '8'
      ? 'q'
      : game.turn() === 'b' && targetSquare[1] === '1'
      ? 'q'
      : undefined

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion,
      })
      if (!move) return false

      setPosition(game.fen())
      setCurrentMove(currentMove + 1)

      const expectedMove = puzzle.solution[currentMove]
      if (move.san === expectedMove) {
        if (currentMove + 1 >= puzzle.solution.length) {
          setSolved(true)
          onSolve(true, Date.now() - startTime)
          loadExplanation()
        }
      } else {
        setFailed(true)
        onSolve(false, Date.now() - startTime)
        loadExplanation()
      }
      return true
    } catch {
      return false
    }
  }

  const handleShowSolution = () => {
    setShowSolution(true)
    let tempGame = new Chess(puzzle.fen)
    for (const san of puzzle.solution) {
      tempGame.move(san)
    }
    setPosition(tempGame.fen())
  }

  const loadExplanation = async () => {
    if (!getExplanation) return
    setExplaining(true)
    const result = await getExplanation(puzzle.fen)
    setExplanation(result)
    setExplaining(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(puzzle.id)
  }

  const resetPuzzle = () => {
    game.load(puzzle.fen)
    setPosition(puzzle.fen)
    setCurrentMove(0)
    setSolved(false)
    setFailed(false)
    setShowSolution(false)
    setExplanation(null)
  }

  const themeList = Array.isArray(puzzle.theme) ? puzzle.theme : [puzzle.theme].filter(Boolean)
  const hasMateTheme = themeList.some(t => MATE_THEMES.has(t))
  const displayThemes = hasMateTheme
    ? ['Scacchi matto', ...themeList.filter(t => !MATE_THEMES.has(t))]
    : themeList

  return (
    <div
      className={`bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="p-4 border-b border-sage-100">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              puzzle.difficulty <= 3
                ? 'bg-green-100 text-green-700'
                : puzzle.difficulty <= 6
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {displayThemes.slice(0, 3).map(t => (
              <span key={t} className="text-xs font-semibold px-2 py-1 rounded bg-sage-100 text-sage-700">
                {t === 'Scacchi matto' ? t : getThemeLabel(t)}
              </span>
            ))}
          </span>
          {puzzle.phase && puzzle.phase !== 'middlegame' && (
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              puzzle.phase === 'opening' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {puzzle.phase === 'opening' ? 'Apertura' : 'Finale'}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-sage-500">
              Difficoltà: {puzzle.difficulty}/10
            </span>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-sage-400 hover:text-red-500 transition-colors text-sm font-medium px-1"
                title="Elimina puzzle"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ width: 320, aspectRatio: '1/1' }}>
        <Chessboard
          options={{
            id: 'puzzle-board',
            position: position === 'start' ? undefined : position,
            onPieceDrop: onDrop,
            boardStyle: {
              borderRadius: '0',
              boxShadow: 'none',
            },
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        {solved && (
          <div className="text-center text-green-600 font-medium p-3 bg-green-50 rounded-lg">
            <Check size={16} className="text-green-500 inline-block" /> Risolto!
          </div>
        )}

        {failed && !showSolution && (
          <div className="text-center text-red-600 font-medium p-3 bg-red-50 rounded-lg">
            <X size={16} className="text-red-500 inline-block" /> Mossa errata. La mossa corretta era: <span className="font-mono">{puzzle.solution[currentMove]}</span>
          </div>
        )}

        {failed && showSolution && (
          <div className="space-y-2">
            <p className="text-sm text-sage-700">
              <strong>Soluzione:</strong>{' '}
              {puzzle.solution.map((san, i) => (
                <span key={i} className="font-mono mx-1">
                  {san}
                </span>
              ))}
            </p>
          </div>
        )}

        {(solved || (failed && showSolution)) && explaining && (
          <div className="text-center text-sage-500 text-sm py-2">
            Analisi in corso...
          </div>
        )}

        {(solved || (failed && showSolution)) && explanation && (
          <div className="space-y-2 border-t border-sage-100 pt-3">
            {explanation.tacticalPatterns.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {explanation.tacticalPatterns.map((p, i) => (
                  <span
                    key={i}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : p.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-sage-100 text-sage-700'
                    }`}
                  >
                    {p.type === 'fork' ? <><Zap size={14} className="inline-block" /> FORK</> :
                     p.type === 'checkmate' ? <><Skull size={14} className="inline-block" /> MATTO</> :
                     p.type === 'double_check' ? <><Zap size={14} className="inline-block" /> Doppio Scacco</> :
                     p.type === 'hanging_piece' ? <><Target size={14} className="inline-block" /> Pezzo sospeso</> :
                     p.type === 'king_exposure' ? <><Crown size={14} className="inline-block" /> Re esposto</> :
                     p.type === 'promotion_threat' ? <><ArrowUp size={14} className="inline-block" /> Promozione</> :
                     p.type === 'check' ? <><AlertTriangle size={14} className="inline-block" /> Scacco</> : p.type}
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm text-sage-800 leading-relaxed">
              {explanation.topMove.explanation}
            </div>

            {explanation.topMove.followUp && (
              <div className="bg-sage-50 rounded-lg p-2 text-sm font-mono text-sage-700">
                {explanation.topMove.followUp}
              </div>
            )}

            {explanation.keyConcepts.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-sage-500">
                  Concept chiave
                </div>
                {explanation.keyConcepts.map((c, i) => (
                  <p key={i} className="text-xs text-sage-700 pl-2 border-l-2 border-sage-300">
                    {c}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {(solved || failed) && (
          <button
            onClick={resetPuzzle}
            className="btn-ghost w-full text-sm"
          >
            Riprova
          </button>
        )}

        {!solved && !failed && (
          <div className="flex gap-2">
            <button
              onClick={handleShowSolution}
              className="btn-ghost flex-1 text-sm"
            >
              Mostra soluzione
            </button>
            <button
              onClick={resetPuzzle}
              className="btn-ghost flex-1 text-sm"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  )
}