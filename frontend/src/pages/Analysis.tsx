import { useState, useEffect, useRef, useCallback } from 'react'
import { InteractiveBoard } from '../components/board/ChessBoard'
import { PgnImporter } from '../components/analysis/PgnImporter'

import { EducationalPanel } from '../components/analysis/EducationalPanel'
import { api } from '../api/client'
import { Chess } from 'chess.js'
import { DifficultyCalculator } from '@chess-app/chess-domain'
import { useEngineAdapter } from '../engine/EngineProvider'
import type { EvalInfo } from '../engine/interface'
import { generateExplanation } from '../engine/analysisEngine'
import type { AnalysisExplanation } from '../types/analysis'
import { useMoveNavigation, type MoveItem } from '../engine/useMoveNavigation'

export function Analysis({ gameId, onBack }: { gameId?: number; onBack?: () => void }) {
  const [showPgnImport, setShowPgnImport] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const [fen, setFen] = useState<string | undefined>()
  const [playingBot, setPlayingBot] = useState(false)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [moves, setMoves] = useState<MoveItem[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisExplanation | null>(null)
  const [puzzleMsg, setPuzzleMsg] = useState('')
  const [generating, setGenerating] = useState(false)
  const gameRef = useRef(new Chess())
  const analysisTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { bestMove: getBestMove, deepAnalyze, ready } = useEngineAdapter()
  const { currentIndex, goToMove, goNext, goPrev, canPrev, canNext } = useMoveNavigation(moves)

  useEffect(() => {
    if (!gameId) { setFen(undefined); setMoves([]); return }
    api.analysis.getMoves(gameId).then((data: any) => {
      setMoves(data)
      setFen(undefined)
    }).catch(console.error)
  }, [gameId])

  useEffect(() => {
    if (currentIndex === -1) {
      gameRef.current.reset()
      setFen(undefined)
      return
    }
    const storedFen = moves[currentIndex]?.fen
    if (storedFen) {
      try { gameRef.current.load(storedFen) } catch {}
      setFen(storedFen)
      return
    }
    gameRef.current.reset()
    for (let i = 0; i <= currentIndex; i++) {
      const san = moves[i]?.san
      if (!san) { setFen(gameRef.current.fen()); return }
      try { gameRef.current.move(san) } catch { break }
    }
    setFen(gameRef.current.fen())
  }, [currentIndex, moves])

  useEffect(() => {
    if (fen === undefined || !ready) {
      setAnalysisResult(null)
      return
    }
    clearTimeout(analysisTimer.current)
    analysisTimer.current = setTimeout(async () => {
      try {
        const multiPv = await deepAnalyze(fen, 3)
        const result = generateExplanation({ multiPv, fen })
        setAnalysisResult(result)
      } catch {
        setAnalysisResult(null)
      }
    }, 500)
    return () => clearTimeout(analysisTimer.current)
  }, [fen, ready, deepAnalyze])

  const handleImport = async (pgn: string) => {
    try {
      const res: any = await api.analysis.importPgn(pgn)
      setImportMsg(res.duplicate ? 'Partita già presente, importazione saltata' : 'PGN importata con successo!')
      setTimeout(() => setImportMsg(''), 3000)
    } catch (e) {
      setImportMsg('Errore durante l\'importazione')
    }
    setShowPgnImport(false)
  }

  const createPuzzleFromPosition = async () => {
    if (!fen || !analysisResult) return
    const bestMove = analysisResult.topMove.san
    if (!bestMove) {
      setPuzzleMsg('Nessuna mossa da usare come soluzione')
      setTimeout(() => setPuzzleMsg(''), 3000)
      return
    }
    const patterns = analysisResult.tacticalPatterns
    const theme = patterns.length > 0 ? patterns[0].type : 'fork'
    const solution = [bestMove, ...analysisResult.topMove.followUp.split(' ').filter(Boolean)]
    try {
      await api.puzzles.create({
        fen,
        solution: solution.length > 0 ? solution : [bestMove],
        theme,
        difficulty: DifficultyCalculator.calculate(theme, solution.length, solution.some(s => s.includes('x'))),
        source: 'manual',
        source_game_id: gameId ?? null,
      })
      setPuzzleMsg('Puzzle creato con successo!')
      setTimeout(() => setPuzzleMsg(''), 3000)
    } catch {
      setPuzzleMsg('Errore nella creazione del puzzle')
      setTimeout(() => setPuzzleMsg(''), 3000)
    }
  }

  const generateAllPuzzles = async () => {
    if (!gameId) return
    setGenerating(true)
    try {
      const result = await api.puzzles.generateFromGame(gameId)
      setPuzzleMsg(`Generati ${result.length} puzzle dalla partita!`)
      setTimeout(() => setPuzzleMsg(''), 4000)
    } catch {
      setPuzzleMsg('Errore nella generazione dei puzzle')
      setTimeout(() => setPuzzleMsg(''), 3000)
    }
    setGenerating(false)
  }

  const resetBoard = () => {
    gameRef.current.reset()
    setFen(undefined)
    goToMove(-1)
  }

  const handleBotMove = (info: EvalInfo) => {
    try {
      const move = gameRef.current.move(info.bestMove)
      if (move) {
        setFen(gameRef.current.fen())
        goToMove(-1)
      }
    } catch (e) {
      console.error('Bot move error:', e)
    } finally {
      setPlayingBot(false)
    }
  }

  const playBotMove = () => {
    if (playingBot || !ready || fen === undefined) return
    setPlayingBot(true)
    const currentFen = gameRef.current.fen()
    getBestMove(currentFen, handleBotMove)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {onBack && (
        <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
          ← Torna indietro
        </button>
      )}
      {gameId && (
        <p className="text-sm text-sage-700 mb-4">
          Analisi partita #{gameId}
        </p>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analisi</h1>
        <p className="text-sm text-sage-700">
          Analisi con Stockfish, spiegazioni e note del coach
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveBoard
            boardWidth={520}
            showEval
            fen={fen}
            boardOrientation={boardFlipped ? 'black' : 'white'}
            onMove={({ from, to, promotion }) => {
              try {
                gameRef.current.move({ from, to, promotion })
                setFen(gameRef.current.fen())
                goToMove(-1)
              } catch {}
            }}
          />
          {gameId && moves.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-4 mb-3">
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
                <button
                  onClick={() => setBoardFlipped(f => !f)}
                  className={`px-3 py-2 rounded-box text-sm font-medium transition-colors ${
                    boardFlipped ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                  title="Capovolgi scacchiera"
                >
                  {boardFlipped ? '🔄' : '↻'}
                </button>
              </div>
              <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-4 max-h-48 overflow-y-auto">
                <div className="space-y-0.5 text-sm">
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
          )}
        </div>

        <div className="space-y-4">
          <EducationalPanel analysis={analysisResult} engineReady={ready} />

          <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
              Azioni
            </div>
            <div className="space-y-2">
              <button className="btn-primary w-full" onClick={() => setShowPgnImport(true)}>
                Importa PGN
              </button>
              <button className="btn-ghost w-full text-sm" onClick={resetBoard}>
                Nuova posizione
              </button>
              <button className="btn-ghost w-full text-sm" onClick={playBotMove} disabled={playingBot || !ready || fen === undefined}>
                {playingBot ? 'Bot sta pensando...' : 'Gioca contro bot'}
              </button>
              {fen && analysisResult && (
                <button
                  className="btn-ghost w-full text-sm text-amber-700 border border-amber-300 hover:bg-amber-50"
                  onClick={createPuzzleFromPosition}
                >
                  Crea puzzle da questa posizione
                </button>
              )}
              {gameId && moves.length > 0 && (
                <button
                  className="btn-ghost w-full text-sm text-amber-700 border border-amber-300 hover:bg-amber-50"
                  onClick={generateAllPuzzles}
                  disabled={generating}
                >
                  {generating ? 'Generazione in corso...' : 'Genera tutti i puzzle'}
                </button>
              )}
            </div>
            {importMsg && (
              <div className="mt-3 text-sm text-sage-700 bg-sage-50 rounded-lg p-2 text-center">
                {importMsg}
              </div>
            )}
            {puzzleMsg && (
              <div className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg p-2 text-center">
                {puzzleMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPgnImport && (
        <PgnImporter onImport={handleImport} onClose={() => setShowPgnImport(false)} />
      )}
    </div>
  )
}
