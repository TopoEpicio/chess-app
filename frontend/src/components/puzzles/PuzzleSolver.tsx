import { useState, useEffect, useCallback, useRef } from 'react'
import { Chessboard } from '../board/ThemedBoard'
import { Chess } from 'chess.js'
import { useEngineAdapter } from '../../engine/EngineProvider'
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

const THEME_LABELS: Record<string, string> = {
  fork: 'Fork',
  pin: 'Inchiodatura',
  skewer: 'Infilata',
  double_attack: 'Doppio attacco',
  discovered_attack: 'Attacco di scoperta',
  checkmate: 'Scacco matto',
  endgame: 'Finale',
  hanging_piece: 'Pezzo sospeso',
  promotion_threat: 'Promozione',
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
  const { deepAnalyze } = useEngineAdapter()
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
    return () => clearTimeout(animTimer.current)
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost text-sm">
          &larr; Torna alla lista
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-sage-500">{formatTime(elapsed)}</span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              puzzle.difficulty <= 3
                ? 'bg-green-100 text-green-700'
                : puzzle.difficulty <= 6
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {THEME_ICONS[puzzle.theme] ?? ''} {THEME_LABELS[puzzle.theme] ?? puzzle.theme} · {puzzle.difficulty}/10
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-sage-100 text-sage-700">
            {turnColor === 'white' ? <><ChevronDown size={16} className="inline-block" /> Muove il Bianco</> : <><ChevronDown size={16} className="inline-block" /> Muove il Nero</>}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] overflow-hidden">
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
            <span className="text-sm text-sage-500">
              {animating ? 'Riproduzione soluzione...' : autoPlaying ? 'Risposta avversario...' : `Il tuo turno · Mossa ${userStepIndex >= 0 ? userStepIndex + 1 : '—'} di ${totalUserMoves}`}
            </span>
          </div>

          <div className="mt-3 flex gap-3 justify-center">
            {status === 'solving' && !autoPlaying && (
              <>
                <button onClick={resetPuzzle} className="btn-ghost text-sm">
                  Riprova
                </button>
                <button
                  onClick={handleShowSolution}
                  className="btn-ghost text-sm text-sage-600"
                >
                  Mostra soluzione
                </button>
                <button onClick={onNext} className="btn-ghost text-sm">
                  Salta &rarr;
                </button>
              </>
            )}
            {status === 'solving' && autoPlaying && (
              <span className="text-sm text-sage-500 italic">Giocata automatica in corso...</span>
            )}
            {(status === 'correct' || status === 'wrong') && (
              <>
                <button onClick={resetPuzzle} className="btn-ghost text-sm">
                  Riprova
                </button>
                <button onClick={onNext} className="btn-primary text-sm">
                  Prossimo puzzle &rarr;
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {status === 'correct' && !showSolution && (
            <div className="bg-green-50 border border-green-200 rounded-box p-4 text-center">
              <div className="text-2xl mb-1"><Check size={16} className="text-green-500 inline-block" /></div>
              <div className="text-green-700 font-semibold">Risolto!</div>
              <div className="text-sm text-green-600 mt-1">
                Tempo: {formatTime(elapsed)}
              </div>
            </div>
          )}

          {status === 'wrong' && (
            <div className="bg-red-50 border border-red-200 rounded-box p-4">
              <div className="text-center">
                <div className="text-2xl mb-1"><X size={16} className="text-red-500 inline-block" /></div>
                <div className="text-red-700 font-semibold">Mossa errata</div>
                <div className="text-sm text-red-600 mt-1">
                  Hai giocato {wrongMove}
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Mossa corretta:{' '}
                  <span className="font-mono font-semibold">
                    {puzzle.solution[currentStep]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {showSolution && (
            <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
                Soluzione
              </div>
              <div className="text-sm font-mono space-y-1">
                {puzzle.solution.map((san, i) => {
                  const isUser = i % 2 === 0
                  return (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded flex justify-between ${
                        i === currentStep ? 'bg-sage-100 font-semibold' : ''
                      }`}
                    >
                      <span>{isUser ? `Tu` : `Avversario`}</span>
                      <span>{san}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(status === 'correct' || (status === 'wrong' && showSolution)) && explaining && (
            <div className="text-center text-sage-500 text-sm py-2">
              Analisi in corso...
            </div>
          )}

          {(status === 'correct' || (status === 'wrong' && showSolution)) && explanation && (
            <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 space-y-3">
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
                      {THEME_ICONS[p.type] ?? ''} {p.type.replace('_', ' ').toUpperCase()}
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
        </div>
      </div>
    </div>
  )
}
