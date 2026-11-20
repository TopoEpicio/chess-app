import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('common')
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
    ? ['checkmate', ...themeList.filter(t => !MATE_THEMES.has(t))]
    : themeList

  const themeLabel = (theme: string) => {
    if (theme === 'checkmate') return t('puzzles.checkmate')
    return t(`puzzles.${theme}`) ?? getThemeLabel(theme)
  }

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)] ${onClick ? 'cursor-pointer hover:shadow-[var(--shadow)] transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <span>
            {displayThemes.slice(0, 3).map(theme => (
              <span key={theme} className="text-xs font-semibold px-2 py-1 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                {themeLabel(theme)}
              </span>
            ))}
          </span>
          {puzzle.phase && puzzle.phase !== 'middlegame' && (
            <span className={`text-xs font-semibold px-2 py-1 rounded ${puzzle.phase === 'opening'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-text-muted)] text-white'
            }`}>
              {puzzle.phase === 'opening' ? t('puzzles.opening') : t('puzzles.endgames')}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {t('puzzles.difficulty')}: {puzzle.difficulty}/10
            </span>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors text-sm font-medium px-1"
                title={t('common.delete')}
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
          <div className="text-center text-[var(--color-success)] font-medium p-3 bg-[var(--color-success-light)] rounded-lg border border-[var(--color-success)]">
            <Check size={16} className="text-[var(--color-success)] inline-block" /> {t('puzzles.solved')}
          </div>
        )}

        {failed && !showSolution && (
          <div className="text-center text-[var(--color-danger)] font-medium p-3 bg-[var(--color-danger-light)] rounded-lg border border-[var(--color-danger)]">
            <X size={16} className="text-[var(--color-danger)] inline-block" /> {t('puzzles.solverWrongMove')}. {t('puzzles.solverCorrectMove')} <span className="font-mono">{puzzle.solution[currentMove]}</span>
          </div>
        )}

        {failed && showSolution && (
          <div className="space-y-2">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <strong>{t('puzzles.solution')}:</strong>{' '}
              {puzzle.solution.map((san, i) => (
                <span key={i} className="font-mono mx-1">
                  {san}
                </span>
              ))}
            </p>
          </div>
        )}

        {(solved || (failed && showSolution)) && explaining && (
          <div className="text-center text-[var(--color-text-secondary)] text-sm py-2">
            {t('analysis.analyzing')}
          </div>
        )}

        {(solved || (failed && showSolution)) && explanation && (
          <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
            {explanation.tacticalPatterns.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {explanation.tacticalPatterns.map((p, i) => {
                  const key = p.type === 'checkmate' ? 'checkmate' : p.type
                  return (
                    <span
                      key={i}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.severity === 'critical'
                          ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-danger)]'
                          : p.severity === 'warning'
                          ? 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]'
                          : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                      }`}
                    >
                      {p.type === 'fork' ? <><Zap size={14} className="inline-block" /> {t('puzzles.fork')}</> :
                       p.type === 'checkmate' ? <><Skull size={14} className="inline-block" /> {t('puzzles.checkmate')}</> :
                       p.type === 'double_check' ? <><Zap size={14} className="inline-block" /> {t('puzzles.doubleCheck')}</> :
                       p.type === 'hanging_piece' ? <><Target size={14} className="inline-block" /> {t('puzzles.hangingPiece')}</> :
                       p.type === 'king_exposure' ? <><Crown size={14} className="inline-block" /> {t('puzzles.endgames')}</> :
                       p.type === 'promotion_threat' ? <><ArrowUp size={14} className="inline-block" /> {t('puzzles.promotionThreat')}</> :
                       p.type === 'check' ? <><AlertTriangle size={14} className="inline-block" /> {t('puzzles.checkmate')}</> : p.type}
                    </span>
                  )
                })}
              </div>
            )}

            <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {explanation.topMove.explanation}
            </div>

            {explanation.topMove.followUp && (
              <div className="bg-[var(--color-bg)] rounded-lg p-2 text-sm font-mono text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {explanation.topMove.followUp}
              </div>
            )}

            {explanation.keyConcepts.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t('puzzles.solverKeyConcept')}
                </div>
                {explanation.keyConcepts.map((c, i) => (
                  <p key={i} className="text-xs text-[var(--color-text-secondary)] pl-2 border-l-2 border-[var(--color-border)]">
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
            {t('puzzles.tryAgain')}
          </button>
        )}

        {!solved && !failed && (
          <div className="flex gap-2">
            <button
              onClick={handleShowSolution}
              className="btn-ghost flex-1 text-sm"
            >
              {t('puzzles.solution')}
            </button>
            <button
              onClick={resetPuzzle}
              className="btn-ghost flex-1 text-sm"
            >
              {t('common.reset')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
