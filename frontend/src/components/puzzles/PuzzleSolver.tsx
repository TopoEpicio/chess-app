import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Chessboard } from '../board/ThemedBoard'
import { Chess } from 'chess.js'
import { useUciEngine } from '../../engine/useUciEngine'
import { generateExplanation } from '../../engine/analysisEngine'
import type { AnalysisExplanation } from '../../types/analysis'
import { Zap, Pin, Crosshair, Target, Skull, Flag, ArrowUp, ChevronDown, Check, X } from 'lucide-react'

interface PuzzleData {
  id: number
  fen: string
  solution: string[]
  theme: string
  difficulty: number
}

interface Props {
  puzzle: PuzzleData
  onSolve: (correct: boolean, timeMs: number) => void
  onNext: () => void
  onBack: () => void
}

const USER_STEPS = [0, 2, 4, 6, 8]

const THEME_LOCALE_KEY: Record<string, string> = {
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  double_attack: 'doubleCheck',
  discovered_attack: 'discoveredAttack',
  checkmate: 'checkmate',
  endgame: 'endgame',
  hanging_piece: 'hangingPiece',
  promotion_threat: 'promotionThreat',
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  fork: <Zap size={14} className="inline-block" />,
  pin: <Pin size={14} className="inline-block" />,
  skewer: <Crosshair size={14} className="inline-block" />,
  double_attack: <Target size={14} className="inline-block" />,
  checkmate: <Skull size={14} className="inline-block" />,
  endgame: <Flag size={14} className="inline-block" />,
  hanging_piece: <Target size={14} className="inline-block" />,
  promotion_threat: <ArrowUp size={14} className="inline-block" />,
}

export function PuzzleSolver({ puzzle, onSolve, onNext, onBack }: Props) {
  const { t } = useTranslation('common')
  const [game] = useState(() => new Chess())
  const [position, setPosition] = useState(puzzle.fen)
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState<'solving' | 'correct' | 'wrong'>('solving')
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [explanation, setExplanation] = useState<AnalysisExplanation | null>(null)
  const [explaining, setExplaining] = useState(false)
  const [wrongMove, setWrongMove] = useState<string | null>(null)
  const [autoPlaying, setAutoPlaying] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { deepAnalyze } = useUciEngine()
  const autoTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const animTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const turnColor = puzzle.fen.split(' ')[1] === 'w' ? 'white' : 'black'

  const userStepIndex = USER_STEPS.indexOf(currentStep)

  useEffect(() => {
    try {
      game.load(puzzle.fen)
      setPosition(puzzle.fen)
      setCurrentStep(0)
      setStatus('solving')
      setElapsed(0)
      setShowSolution(false)
      setExplanation(null)
      setExplaining(false)
      setWrongMove(null)
      setAutoPlaying(false)
      setStartTime(Date.now())
    } catch {
      console.error('Invalid FEN:', puzzle.fen)
    }
  }, [puzzle.id])

  useEffect(() => {
    if (status !== 'solving') return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [status, startTime])

  const loadExplanation = useCallback(async () => {
    setExplaining(true)
    try {
      const multiPv = await deepAnalyze(puzzle.fen, 3)
      if (multiPv.length > 0) {
        const result = generateExplanation({ multiPv, fen: puzzle.fen })
        setExplanation(result)
      }
    } catch {
      // silent
    }
    setExplaining(false)
  }, [deepAnalyze, puzzle.fen])

  useEffect(() => {
    if (status !== 'solving') return
    if (currentStep % 2 === 1 && currentStep < puzzle.solution.length) {
      setAutoPlaying(true)
      const san = puzzle.solution[currentStep]
      autoTimer.current = setTimeout(() => {
        try {
          game.move(san)
          setPosition(game.fen())
          const next = currentStep + 1
          if (next >= puzzle.solution.length) {
            setCurrentStep(next)
            setStatus('correct')
            onSolve(true, Date.now() - startTime)
          } else {
            setCurrentStep(next)
          }
        } catch {
          setStatus('wrong')
        }
        setAutoPlaying(false)
      }, 600)
      return () => clearTimeout(autoTimer.current)
    }
  }, [currentStep, status])

  useEffect(() => {
    if (status === 'correct' || status === 'wrong') {
      loadExplanation()
    }
  }, [status])

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (status !== 'solving' || autoPlaying || animating || !targetSquare) return false

    const promotion = game.turn() === 'w' && targetSquare[1] === '8'
      ? 'q'
      : game.turn() === 'b' && targetSquare[1] === '1'
      ? 'q'
      : undefined

    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion })
      if (!move) return false

      setPosition(game.fen())
      const expected = puzzle.solution[currentStep]

      if (move.san === expected) {
        const next = currentStep + 1
        if (next >= puzzle.solution.length) {
          setStatus('correct')
          setElapsed(Math.floor((Date.now() - startTime) / 1000))
          onSolve(true, Date.now() - startTime)
        } else {
          setCurrentStep(next)
        }
      } else {
        setStatus('wrong')
        setWrongMove(move.san)
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
        onSolve(false, Date.now() - startTime)
      }
      return true
    } catch {
      return false
    }
  }

  const handleShowSolution = () => {
    setShowSolution(true)
    setAnimating(true)
  }

  useEffect(() => {
    if (!showSolution || !animating) return

    const playNext = (step: number) => {
      if (step >= puzzle.solution.length) {
        setAnimating(false)
        setStatus('correct')
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
        onSolve(true, Date.now() - startTime)
        return
      }

      setCurrentStep(step)
      const tempGame = new Chess(puzzle.fen)
      for (let i = 0; i <= step; i++) {
        try { tempGame.move(puzzle.solution[i]) } catch { break }
      }
      setPosition(tempGame.fen())

      animTimer.current = setTimeout(() => playNext(step + 1), 600)
    }

    playNext(0)
    return () => clearTimeout(autoTimer.current)
  }, [showSolution, animating])

  const resetPuzzle = () => {
    clearTimeout(autoTimer.current)
    clearTimeout(animTimer.current)
    game.load(puzzle.fen)
    setPosition(puzzle.fen)
    setCurrentStep(0)
    setStatus('solving')
    setShowSolution(false)
    setAnimating(false)
    setExplanation(null)
    setWrongMove(null)
    setAutoPlaying(false)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  const totalUserMoves = Math.ceil(puzzle.solution.length / 2)
  const themeLabel = t(`puzzles.${THEME_LOCALE_KEY[puzzle.theme] ?? puzzle.theme}`)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost text-sm">
          &larr; {t('puzzles.solverBackToList')}
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-[var(--color-text-secondary)]">{formatTime(elapsed)}</span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              puzzle.difficulty <= 3
                ? 'bg-[var(--color-success)] text-white'
                : puzzle.difficulty <= 6
                ? 'bg-[var(--color-warning)] text-white'
                : 'bg-[var(--color-danger)] text-white'
            }`}
          >
            {THEME_ICONS[puzzle.theme] ?? ''} {themeLabel} · {puzzle.difficulty}/10
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
            {turnColor === 'white'
              ? <><ChevronDown size={16} className="inline-block" /> {t('analysis.whiteToMove')}</>
              : <><ChevronDown size={16} className="inline-block" /> {t('analysis.blackToMove')}</>}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)]">
            <div style={{ width: '100%', aspectRatio: '1/1' }}>
              <Chessboard
                options={{
                  id: `puzzle-${puzzle.id}`,
                  position: position === 'start' ? undefined : position,
                  onPieceDrop: onDrop,
                  boardOrientation: turnColor,
                  boardStyle: { borderRadius: '0', boxShadow: 'none' },
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {animating ? t('puzzles.solverPlayingSolution')
                : autoPlaying ? t('puzzles.solverOpponentMove')
                : `${t('puzzles.solverYourTurn')} · ${t('puzzles.solverMoveOf', { current: userStepIndex >= 0 ? userStepIndex + 1 : '—', total: totalUserMoves })}`}
            </span>
          </div>

          <div className="mt-3 flex gap-3 justify-center">
            {status === 'solving' && !autoPlaying && (
              <>
                <button onClick={resetPuzzle} className="btn-ghost text-sm">
                  {t('puzzles.tryAgain')}
                </button>
                <button
                  onClick={handleShowSolution}
                  className="btn-ghost text-sm text-[var(--color-text-secondary)]"
                >
                  {t('puzzles.solution')}
                </button>
                <button onClick={onNext} className="btn-ghost text-sm">
                  {t('puzzles.solverSkip')}
                </button>
              </>
            )}
            {status === 'solving' && autoPlaying && (
              <span className="text-sm text-[var(--color-text-secondary)] italic">{t('puzzles.solverAutoplay')}</span>
            )}
            {(status === 'correct' || status === 'wrong') && (
              <>
                <button onClick={resetPuzzle} className="btn-ghost text-sm">
                  {t('puzzles.tryAgain')}
                </button>
                <button onClick={onNext} className="btn-primary text-sm">
                  {t('puzzles.nextPuzzle')}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {status === 'correct' && !showSolution && (
            <div className="bg-[var(--color-success-light)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-4 text-center">
              <div className="text-2xl mb-1"><Check size={16} className="text-[var(--color-success)] inline-block" /></div>
              <div className="text-[var(--color-success)] font-semibold">{t('puzzles.solved')}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                {t('puzzles.solveTime', { time: formatTime(elapsed) })}
              </div>
            </div>
          )}

          {status === 'wrong' && (
            <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)] rounded-[var(--radius-lg)] p-4">
              <div className="text-center">
                <div className="text-2xl mb-1"><X size={16} className="text-[var(--color-danger)] inline-block" /></div>
                <div className="text-[var(--color-danger)] font-semibold">{t('puzzles.solverWrongMove')}</div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {t('puzzles.solverYouPlayed', { move: wrongMove })}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {t('puzzles.solverCorrectMove')} <span className="font-mono font-semibold">{puzzle.solution[currentStep]}</span>
                </div>
              </div>
            </div>
          )}

          {showSolution && (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-sm)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                {t('puzzles.solution')}
              </div>
              <div className="text-sm font-mono space-y-1">
                {puzzle.solution.map((san, i) => {
                  const isUser = i % 2 === 0
                  return (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded flex justify-between ${
                        i === currentStep ? 'bg-[var(--color-surface-hover)] font-semibold' : ''
                      }`}
                    >
                      <span className="text-[var(--color-text)]">{isUser ? t('play.you') : t('play.bot')}</span>
                      <span>{san}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(status === 'correct' || (status === 'wrong' && showSolution)) && explaining && (
            <div className="text-center text-[var(--color-text-secondary)] text-sm py-2">
              {t('analysis.analyzing')}
            </div>
          )}

          {(status === 'correct' || (status === 'wrong' && showSolution)) && explanation && (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-sm)] space-y-3">
              {explanation.tacticalPatterns.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {explanation.tacticalPatterns.map((p, i) => {
                    const key = THEME_LOCALE_KEY[p.type] ?? p.type
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
                        {THEME_ICONS[p.type] ?? ''} {t(`puzzles.${key}`) ?? p.type.replace('_', ' ').toUpperCase()}
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
        </div>
      </div>
    </div>
  )
}
