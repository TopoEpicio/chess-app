import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Chess } from 'chess.js'
import { findOpeningByFen, findOpeningByMoves } from '../data/openings'
import { api } from '../api/client'
import { useUciEngine } from '../engine/useUciEngine'
import { useEngineConfig } from '../stores/engineStore'
import { generateExplanation } from '../engine/analysisEngine'
import { analyzeGameMoves, calculateAccuracy } from '../engine/gameAnalysisService'
import type { AnalysisExplanation, GameAnalysisResult, MoveAnalysisData, EvalInfo, MultiPvLine } from '../types/analysis'
import type { LineEval } from '../types/eval'
import type { MoveItem } from '../engine/useMoveNavigation'
import { DifficultyCalculator } from '@chess-app/chess-domain'

import { ChessBoard } from '../components/board/ChessBoard'
import { PgnImporter } from '../components/analysis/PgnImporter'
import { ProgressBar } from '../components/analysis/ProgressBar'
import { EvaluationChart } from '../components/analysis/EvaluationChart'
import { UserOpeningButton } from '../components/analysis/UserOpeningButton'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Tabs, TabsList, TabTrigger, TabPanel } from '../components/ui/Tabs'
import {
  KPICard,
  MoveTable,
  ClassificationSummary,
  type MoveRow,
  type ClassificationRow,
} from '../components/data-display'
import { StatusBar as StatusBarComponent } from '../components/layout/StatusBar'

import { AnalysisLayout } from '../sections/analysis/AnalysisLayout'
import { PanelHeader } from '../sections/analysis/panelHeader'

import {
  selectedTabAtom,
  currentIndexAtom,
  canPrevAtom,
  canNextAtom,
  goToMoveAtom,
  goNextAtom,
  goPrevAtom,
  setMovesAtom,
  setEngineStatusAtom,
  setGameAnalysisProgressAtom,
  setGameAnalysisResultsAtom,
} from '../sections/analysis/states'

/** Convert the engine's MultiPV view into the board/panel line shape. */
function toLineEvals(lines: MultiPvLine[]): LineEval[] {
  return lines.map((line) => ({
    pv: line.pv,
    cp: Math.round((line.evaluation ?? 0) * 100),
    mate: line.mate ?? undefined,
    depth: line.depth,
    multiPv: line.rank,
  }))
}

/** Convert game result classifications to ClassificationSummary format. */
function toClassificationRows(gameResult: GameAnalysisResult | null): ClassificationRow[] {
  if (!gameResult?.total_classification_counts) return []
  const counts = gameResult.total_classification_counts
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const order: ClassificationRow['label'][] = ['brilliant', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder']
  const colors: Record<ClassificationRow['label'], string> = {
    brilliant: 'var(--color-success)',
    best: 'var(--color-success)',
    excellent: 'var(--color-success)',
    good: 'var(--color-success)',
    inaccuracy: 'var(--color-warning)',
    mistake: 'var(--color-warning)',
    blunder: 'var(--color-danger)',
  }
  return order
    .map((label) => ({
      name: label,
      count: counts[label] ?? 0,
      percentage: total > 0 ? ((counts[label] ?? 0) / total) * 100 : 0,
      color: colors[label],
      label,
    }))
    .filter((r) => r.count > 0)
}

/** Convert analysis moves to MoveTable format. */
function toMoveRows(moves: MoveAnalysisData[], currentIndex: number): MoveRow[] {
  // Group moves by move_number (white + black together)
  const movesByNumber = new Map<number, { white?: MoveAnalysisData; black?: MoveAnalysisData }>()
  for (const move of moves) {
    const entry = movesByNumber.get(move.move_number) ?? { white: undefined, black: undefined }
    if (move.is_white) {
      entry.white = move
    } else {
      entry.black = move
    }
    movesByNumber.set(move.move_number, entry)
  }

  // Convert to MoveRow array, sorted by move number
  const sortedNumbers = Array.from(movesByNumber.keys()).sort((a, b) => a - b)
  return sortedNumbers.map((moveNumber, index) => {
    const entry = movesByNumber.get(moveNumber)!
    const whiteMove = entry.white
    const blackMove = entry.black
    // Determine if this row is current (either white or black move matches currentIndex)
    const whiteIndex = whiteMove ? moves.indexOf(whiteMove) : -1
    const blackIndex = blackMove ? moves.indexOf(blackMove) : -1
    const isCurrent = whiteIndex === currentIndex || blackIndex === currentIndex
    // Use classification from the move that was played at currentIndex, or from white move
    const classification = (currentIndex === whiteIndex ? whiteMove : currentIndex === blackIndex ? blackMove : whiteMove)?.classification?.toLowerCase() as MoveRow['classification'] | undefined
    // Evaluation from the move that was played, or from white move
    const playedEval = (currentIndex === whiteIndex ? whiteMove : currentIndex === blackIndex ? blackMove : whiteMove)?.played_eval
    const depth = (currentIndex === whiteIndex ? whiteMove : currentIndex === blackIndex ? blackMove : whiteMove)?.depth

    return {
      moveNumber,
      whiteMove: whiteMove?.san ?? '',
      blackMove: blackMove?.san ?? '',
      evaluation: playedEval !== undefined ? (playedEval >= 0 ? '+' : '') + playedEval.toFixed(2) : undefined,
      depth,
      classification,
      time: undefined,
      isCurrent,
    }
  })
}
export function Analysis({ gameId, onBack }: { gameId?: number; onBack?: () => void }) {
  const [showPgnImport, setShowPgnImport] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const [fen, setFen] = useState<string | undefined>()
  const [playingBot, setPlayingBot] = useState(false)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [moves, setMoves] = useState<MoveItem[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisExplanation | null>(null)
  const [gameResult, setGameResult] = useState<GameAnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [generating, setGenerating] = useState(false)
const [puzzleMsg, setPuzzleMsg] = useState('')
  const [saveMsg, setSaveMsg] = useState('')
  const [localGameId, setLocalGameId] = useState<number | undefined>(gameId)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [openingName, setOpeningName] = useState<string | undefined>()
  const [openingEco, setOpeningEco] = useState<string | undefined>()
  const [gameInfo, setGameInfo] = useState<{ white: string | null; black: string | null; player_rating: number | null; opponent: string | null; result: string | null } | null>(null)

  const { bestMove, deepAnalyze, analyzeLive, ready, error: engineError } = useUciEngine()
  const { t } = useTranslation('common')
  const engineCfg = useEngineConfig()

  const gameRef = useRef(new Chess())
  const loadingMoves = useRef(false)
  const movesTableRef = useRef<HTMLDivElement>(null)
  const analyzing = useRef(false)
  const hasGameResultRef = useRef(false)
  const analysisRequestRef = useRef(0)
  const [engineLines, setEngineLines] = useState<LineEval[]>([])
  const [, setEngineLinesLoading] = useState(false)
  const [boardEval, setBoardEval] = useState<EvalInfo | null>(null)
  const [liveEpoch, setLiveEpoch] = useState(0)

  const currentGameId = gameId ?? localGameId

// Jotai atoms
  const [, setGameAnalysisProgress] = useAtom(setGameAnalysisProgressAtom)
  const [, setGameAnalysisResults] = useAtom(setGameAnalysisResultsAtom)
  const [, setEngineStatus] = useAtom(setEngineStatusAtom)
  const [, setSelectedTab] = useAtom(selectedTabAtom)
  const selectedTab = useAtomValue(selectedTabAtom)
  const setJotaiMoves = useSetAtom(setMovesAtom)
  const currentIndex = useAtomValue(currentIndexAtom)
  const canPrev = useAtomValue(canPrevAtom)
  const canNext = useAtomValue(canNextAtom)
  const goToMove = useSetAtom(goToMoveAtom)
  const goNext = useSetAtom(goNextAtom)
  const goPrev = useSetAtom(goPrevAtom)

  useEffect(() => {
    hasGameResultRef.current = !!gameResult
  }, [gameResult])

  useEffect(() => {
    setLocalGameId(gameId)
  }, [gameId])

  useEffect(() => {
    const id = currentGameId
    if (!id || loadingMoves.current) return
    setAnalysisError(null)
    loadingMoves.current = true
    api.analysis.getMoves(id).then((data) => {
      const loaded = data as MoveItem[]
      setMoves(loaded)
      setJotaiMoves(loaded)
      if (loaded.length > 0) {
        gameRef.current.reset()
        setFen(gameRef.current.fen())
      }
    }).catch((err) => {
      setAnalysisError('Impossible to load the game moves: ' + (err?.message ?? String(err)))
    }).finally(() => { loadingMoves.current = false })
    api.analysis.getAnalysisResult?.(id).then((data) => {
      setGameResult(data as GameAnalysisResult)
    }).catch((err) => {
      setAnalysisError((prev) => prev ?? 'Impossible to load the analysis result: ' + (err?.message ?? String(err)))
    })
    api.analysis.get(id).then((raw: any) => {
      setGameInfo({
        white: raw?.white ?? null,
        black: raw?.black ?? null,
        player_rating: raw?.player_rating ?? null,
        opponent: raw?.opponent ?? null,
        result: raw?.result ?? null,
    })
    }).catch(() => { /* non-fatal */ })
  }, [currentGameId, setJotaiMoves])

  const resolveOpening = useCallback((fen: string, sanPrefix: string[]) => {
    const match = findOpeningByMoves(sanPrefix)
    if (match) {
      setOpeningName(match.variation.name)
      setOpeningEco(match.opening.eco ?? match.variation.name)
      return
    }
    if (sanPrefix.length === 0) {
      const opening = findOpeningByFen(fen)
      setOpeningName(opening?.name)
      setOpeningEco(opening?.eco)
    }
  }, [])

  useEffect(() => {
const sanPrefix = moves.slice(0, currentIndex + 1).map((m) => m.san)
  if (currentIndex === -1) {
    gameRef.current.reset()
    const startFen = gameRef.current.fen()
    setFen(startFen)
    // Only resolve the opening when there is something to resolve. Re-running
    // this effect with an empty prefix (e.g. right after moves loaded but
    // before navigation) would clobber a real opening name with "Unknown".
    if (sanPrefix.length > 0) resolveOpening(startFen, sanPrefix)
    else setOpeningName(undefined)
    return
  }
    const storedFen = moves[currentIndex]?.fen
    if (storedFen) {
      try {
        gameRef.current.load(storedFen)
        setFen(storedFen)
        resolveOpening(storedFen, sanPrefix)
        return
      } catch {}
    }
gameRef.current.reset()
    const resetFen = gameRef.current.fen()
    setFen(resetFen)
    resolveOpening(resetFen, sanPrefix)
  }, [currentIndex, moves, resolveOpening])

  useEffect(() => {
    if (selectedTab !== 'summary' && selectedTab !== 'moves') setSelectedTab('summary')
  }, [selectedTab, setSelectedTab])

  // Single engine call for the whole page.
  useEffect(() => {
    if (fen === undefined || !ready) {
      setEngineLines((prev) => (prev.length === 0 ? prev : []))
      setEngineLinesLoading((prev) => (prev === false ? prev : false))
      setBoardEval((prev) => (prev === null ? prev : null))
      setAnalysisResult((prev) => (prev === null ? prev : null))
      return
    }
    setEngineLines((prev) => (prev.length === 0 ? prev : []))
    setEngineLinesLoading((prev) => (prev === true ? prev : true))
    setBoardEval((prev) => (prev === null ? prev : null))
    const requestId = ++analysisRequestRef.current
    let lastExplanationAt = 0

    const publish = (multiPv: MultiPvLine[], depthOverride?: number) => {
      if (analysisRequestRef.current !== requestId || multiPv.length === 0) return

      setEngineLines(toLineEvals(multiPv))

      const best = multiPv[0]
      if (best) {
        setBoardEval({
          bestMove: best.uci,
          evaluation: best.evaluation,
          mate: best.mate,
          depth: depthOverride ?? best.depth,
        })
      }

      if (!hasGameResultRef.current) {
        const now = Date.now()
        if (now - lastExplanationAt > 1500) {
          lastExplanationAt = now
          setAnalysisResult(generateExplanation({ multiPv, fen }))
        }
      }
    }

    const timer = setTimeout(async () => {
      try {
        await analyzeLive(fen, (partial, depth) => {
          setEngineLinesLoading(false)
          publish(partial, depth)
        })
      } catch {
        if (analysisRequestRef.current === requestId) setEngineLines([])
      } finally {
        if (analysisRequestRef.current === requestId) setEngineLinesLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [fen, ready, analyzeLive, liveEpoch])

const startAnalysis = async () => {
    if (!fen || !ready || analyzing.current) return
    analyzing.current = true
    setAnalysisProgress(0)
    setGameAnalysisProgress(0)
    setEngineStatus('analyzing')

    try {
      if (moves.length > 0) {
        const analyzedMoves = await analyzeGameMoves(moves, (fen, pv) => deepAnalyze(fen, pv, engineCfg.depth), (p) => {
          const progress = Math.round((p.currentMove / p.totalMoves) * 100)
          setAnalysisProgress(progress)
          setGameAnalysisProgress(progress)
        })
        const acc = calculateAccuracy(analyzedMoves)

        // Convert analyzed moves to MoveItem format for navigation
        const analyzedMoveItems = analyzedMoves.map(m => ({
          move_number: m.move_number,
          san: m.san,
          fen: m.fen_after,
          is_white: m.is_white,
        }))

        if (currentGameId) {
          try {
            await api.analysis.saveAnalysis(currentGameId, {
              moves: analyzedMoves,
              white_accuracy: acc.whiteAccuracy,
              black_accuracy: acc.blackAccuracy,
              white_cpl: acc.whiteCpl,
              black_cpl: acc.blackCpl,
            })
            const data = await api.analysis.getAnalysisResult(currentGameId)
            setGameResult(data as GameAnalysisResult)
          } catch (err) {
            setAnalysisError('Impossible to save the analysis: ' + (err?.message ?? String(err)))
          }
        } else {
          // Self-analysis mode: update local state with analyzed moves for navigation
          setMoves(analyzedMoveItems)
          setJotaiMoves(analyzedMoveItems)
          setGameResult({
            game_id: 0,
            white_accuracy: acc.whiteAccuracy,
            black_accuracy: acc.blackAccuracy,
            white_cpl: acc.whiteCpl,
            black_cpl: acc.blackCpl,
            white_classification_counts: {},
            black_classification_counts: {},
            total_classification_counts: {},
            moves: analyzedMoves,
            analyzed_at: new Date().toISOString(),
            status: 'completed',
            current_move: analyzedMoves.length - 1,
            total_moves: analyzedMoves.length,
          } as GameAnalysisResult)
        }
      } else {
        const multiPv = await deepAnalyze(fen, engineCfg.multiPv, engineCfg.depth)
        const result = generateExplanation({ multiPv, fen })
        setAnalysisResult(result)
      }
      setGameAnalysisResults(null)
      setEngineStatus('completed')
    } finally {
      setAnalysisProgress(100)
      setGameAnalysisProgress(100)
      analyzing.current = false
      setLiveEpoch((epoch) => epoch + 1)
    }
  }

  const handleMove = ({ from, to, promotion }: { from: string; to: string; promotion?: string }) => {
    try {
      gameRef.current.move({ from, to, promotion })
      const newFen = gameRef.current.fen()
      setFen(newFen)
      resolveOpening(newFen, gameRef.current.history())
    } catch {}
  }

  const handleGoToMove = (index: number) => {
    goToMove(index)
  }

  const handleGoPrev = () => {
    goPrev()
  }

  const handleGoNext = () => {
    goNext()
  }

  const handleShowMoves = () => {
    movesTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: t('analysis.title'), url }).catch(() => undefined)
    } else {
      navigator.clipboard?.writeText(url).catch(() => undefined)
    }
  }

  const playBotMove = async () => {
    if (playingBot || !ready || fen === undefined) return
    setPlayingBot(true)
    const currentFen = gameRef.current.fen()
    await bestMove(currentFen)
    setPlayingBot(false)
  }

  const handleImport = async (pgn: string) => {
    try {
      const res = (await api.analysis.importPgn(pgn)) as { id?: number; duplicate?: boolean }
      if (res && typeof res === 'object' && res.id) {
        setLocalGameId(res.id)
        setImportMsg(res.duplicate ? t('analysis.gameAlreadyPresent') : t('analysis.pgnImported'))
      } else {
        setImportMsg(res.duplicate ? t('analysis.gameAlreadyPresent') : t('analysis.pgnImportError'))
      }
      setTimeout(() => setImportMsg(''), 3000)
    } catch {
      setImportMsg(t('analysis.pgnImportError'))
      setTimeout(() => setImportMsg(''), 3000)
    }
    setShowPgnImport(false)
  }

  const createPuzzleFromPosition = async () => {
    if (!fen || !analysisResult) return
    const bestMove = analysisResult.topMove.san
    if (!bestMove) {
      setPuzzleMsg(t('analysis.noMoveForSolution'))
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
        source_game_id: currentGameId ?? null,
      })
      setPuzzleMsg(t('analysis.puzzleCreated'))
      setTimeout(() => setPuzzleMsg(''), 3000)
    } catch {
      setPuzzleMsg(t('analysis.puzzleError'))
      setTimeout(() => setPuzzleMsg(''), 3000)
    }
  }

  const generateAllPuzzles = async () => {
    if (!currentGameId) return
    setGenerating(true)
    try {
      const result = await api.puzzles.generateFromGame(currentGameId)
      setPuzzleMsg(t('analysis.puzzlesGenerated', { count: result.length }))
      setTimeout(() => setPuzzleMsg(''), 4000)
    } catch {
      setPuzzleMsg(t('analysis.generationError'))
      setTimeout(() => setPuzzleMsg(''), 3000)
    }
    setGenerating(false)
  }

  const resetBoard = () => {
    gameRef.current.reset()
    setFen(undefined)
    goToMove(-1)
  }

  const analysisMoves: MoveAnalysisData[] = gameResult?.moves ?? []

  const lastMoveUci = moves[currentIndex]?.san
    ? (() => {
        try {
          const fenBefore = currentIndex === 0
            ? new Chess().fen()
            : moves[currentIndex - 1]?.fen
          if (!fenBefore) return undefined
          const move = new Chess(fenBefore).move(moves[currentIndex]!.san)
          return move ? move.from + move.to + (move.promotion ?? '') : undefined
        } catch {
          return undefined
        }
      })()
    : undefined

  // Derived data for new components
  const classificationRows = toClassificationRows(gameResult)
  const moveRows = toMoveRows(analysisMoves, currentIndex)
  const totalMoves = analysisMoves.length
  const whiteAccuracy = gameResult?.white_accuracy ?? 0
  const blackAccuracy = gameResult?.black_accuracy ?? 0

  const currentMoveData = analysisMoves[currentIndex]
  const moveClassification = currentMoveData?.classification
  const coachAdjective = moveClassification
    ? {
        brilliant: t('analysis.coachMoveAdjective.brilliant'),
        best: t('analysis.coachMoveAdjective.best'),
        excellent: t('analysis.coachMoveAdjective.excellent'),
        good: t('analysis.coachMoveAdjective.good'),
        inaccuracy: t('analysis.coachMoveAdjective.inaccuracy'),
        mistake: t('analysis.coachMoveAdjective.mistake'),
blunder: t('analysis.coachMoveAdjective.blunder'),
      }[moveClassification] ?? t('analysis.coachMoveAdjective.good')
    : t('analysis.coachMoveAdjective.good')
  const allMoveRows = moveRows

  return (
    <>
<PanelHeader
        onBack={onBack}
        gameId={currentGameId}
        onImportPgn={() => setShowPgnImport(true)}
        importMsg={importMsg}
      />

      {/* Match Header */}
      <Card padding='lg'>
        <div className='grid grid-cols-12 gap-4 items-center'>
          <div className='col-span-12 md:col-span-4 flex items-center gap-4 text-center md:text-left'>
            <div className='w-12 h-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-semibold text-lg mx-auto md:mx-0'>
              {gameInfo?.white?.slice(0, 2).toUpperCase() ?? 'WR'}
            </div>
            <div>
              <p className='font-semibold text-[var(--color-text)]'>{gameInfo?.white ?? t('analysis.white')}</p>
              <p className='font-mono text-sm text-[var(--color-text-muted)]'>{gameInfo?.player_rating ? String(gameInfo.player_rating) : '\u2014'}</p>
            </div>
          </div>
          <div className='col-span-12 md:col-span-4 flex flex-col items-center gap-2'>
            <p className='text-3xl font-bold text-[var(--color-text)]'>{gameInfo?.result ?? '1-0'}</p>
            <p className='text-sm text-[var(--color-text-muted)]'>{openingName ?? t('analysis.openingUnknown')}</p>
              <p className='font-mono text-xs text-[var(--color-text-muted)]'>{moves.length} · {openingEco ?? ''}</p>
          </div>
          <div className='col-span-12 md:col-span-4 flex items-center gap-4 justify-center md:justify-end text-center md:text-right'>
            <div>
              <p className='font-semibold text-[var(--color-text)]'>{gameInfo?.black ?? t('analysis.black')}</p>
              <p className='font-mono text-sm text-[var(--color-text-muted)]'>{gameInfo?.opponent ? String(gameInfo.opponent) : '\u2014'}</p>
            </div>
            <div className='w-12 h-12 rounded-full bg-[var(--color-warning-light)] text-[var(--color-warning)] flex items-center justify-center font-semibold text-lg mx-auto md:mx-0'>
              {gameInfo?.black?.slice(0, 2).toUpperCase() ?? 'BK'}
            </div>
          </div>
        </div>
      </Card>

      {analysisError && (
        <div className='bg-[var(--color-danger-light)] border border-[var(--color-danger)] text-[var(--color-danger)] rounded-[var(--radius-lg)] p-4 text-sm'>
          {analysisError}
        </div>
      )}

      <AnalysisLayout
        board={
          <>
            {analyzing.current && (
              <div className='space-y-2'>
                <div className='text-sm text-[var(--color-text-muted)]'>{t('analysis.analyzing')}</div>
                <ProgressBar progress={analysisProgress} />
              </div>
            )}
            <Card padding='none' className='overflow-hidden'>
              <div className='p-4 border-b border-[var(--color-border)] flex items-center justify-between'>
                <h3 className='font-semibold text-[var(--color-text)]'>{t('analysis.currentPosition')}</h3>
                <Button variant='ghost' size='sm' aria-label={t('analysis.engine')}>
                  <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
                    <circle cx='12' cy='12' r='3' />
                    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
                  </svg>
                </Button>
              </div>
              <div className='mx-auto w-full max-w-[680px]'>
                <ChessBoard
                  boardWidth={520}
                  showEval
                  position={fen}
                  boardOrientation={boardFlipped ? 'black' : 'white'}
                  onMove={handleMove}
                  moveData={gameResult?.moves?.[currentIndex] ?? null}
                  engineLines={engineLines}
                  lastMoveUci={lastMoveUci}
                  evalInfo={boardEval}
                  engineReady={ready}
                  engineError={engineError}
                  engineTargetDepth={engineCfg.depth}
                  responsive
                />
              </div>
<div className='p-4 border-t border-[var(--color-border)] space-y-4 bg-[var(--color-bg)]'>
                {(openingName || fen) && (
                  <div className='mb-2 flex items-center justify-between text-sm text-[var(--color-success)] bg-[var(--color-success-light)] rounded-lg p-2'>
                    <span><span className="font-medium">{t('analysis.opening')}: </span> {openingName ?? t('analysis.openingUnknown')}</span>
                    <div className="flex items-center gap-3">
                      {fen && <UserOpeningButton openingName={openingName} fen={fen} eco={openingEco} />}
                    </div>
                  </div>
                )}
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div className='flex items-center gap-2'>
                    <Button variant='secondary' size='sm' onClick={handleGoToMove.bind(null, 0)} disabled={!canPrev} aria-label={t('analysis.startOfGame')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><polyline points='11 17 6 12 11 7'/><polyline points='18 17 13 12 18 7'/></svg>
                    </Button>
                    <Button variant='secondary' size='sm' onClick={handleGoPrev} disabled={!canPrev} aria-label={t('analysis.previousMove')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><polyline points='15 17 10 12 15 7'/></svg>
                    </Button>
                    <span className='font-mono text-base font-semibold text-[var(--color-text)] min-w-[80px] text-center'>
                      {currentIndex + 1} / {moves.length}
                    </span>
                    <Button variant='secondary' size='sm' onClick={handleGoNext} disabled={!canNext} aria-label={t('analysis.nextMove')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><polyline points='9 17 14 12 9 7'/></svg>
                    </Button>
                    <Button variant='secondary' size='sm' onClick={handleGoToMove.bind(null, moves.length - 1)} disabled={!canNext} aria-label={t('analysis.endOfGame')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><polyline points='13 17 18 12 13 7'/><polyline points='6 17 11 12 6 7'/></svg>
                    </Button>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => setBoardFlipped(f => !f)} aria-label={t('analysis.flipBoard')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><polyline points='23 4 23 10 17 10'/><path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10'/></svg>
                      {t('analysis.flipBoard')}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={resetBoard} aria-label={t('analysis.resetBoard')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'/><path d='M21 12a9 9 0 1 1-9 9 9.75 9.75 0 0 1 6.74-2.74L21 16'/></svg>
                      {t('analysis.resetBoard')}
                    </Button>
                    <Button variant='primary' size='sm' onClick={startAnalysis} disabled={analyzing.current || !ready || fen === undefined} aria-label={t('analysis.analyzeGame')}>
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'><path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/></svg>
                      {analyzing.current ? t('analysis.analyzing') : t('analysis.analyzeGame')}
                    </Button>
                  </div>
                </div>
                <div className='font-mono text-sm text-[var(--color-text-muted)] text-center'>
                  {t('analysis.depth')} {boardEval?.depth ?? engineCfg.depth} / {engineCfg.depth} · {t('analysis.evaluation')} {boardEval ? (boardEval.evaluation >= 0 ? '+' : '') + boardEval.evaluation.toFixed(2) : '\u2014'}
                </div>
              </div>
            </Card>

            <Card padding='md'>
              <p className='text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3'>{t('analysis.actions')}</p>
              <div className='space-y-2'>
                <Button variant='ghost' className='w-full justify-start text-sm' onClick={resetBoard}>{t('analysis.newPosition')}</Button>
                <Button variant='ghost' className='w-full justify-start text-sm' onClick={playBotMove} disabled={playingBot || !ready || fen === undefined}>
                  {playingBot ? t('analysis.botThinking') : t('analysis.playVsBot')}
                </Button>
                {fen && analysisResult && (
                  <Button variant='ghost' className='w-full justify-start text-sm text-[var(--color-warning)] border border-[var(--color-warning)] hover:bg-[var(--color-warning-light)]' onClick={createPuzzleFromPosition}>
                    {t('analysis.createPuzzle')}
                  </Button>
                )}
                {currentGameId && moves.length > 0 && (
                  <Button variant='ghost' className='w-full justify-start text-sm text-[var(--color-warning)] border border-[var(--color-warning)] hover:bg-[var(--color-warning-light)]' onClick={generateAllPuzzles} disabled={generating}>
                    {generating ? t('analysis.generatingPuzzles') : t('analysis.analyzeAll')}
                  </Button>
                )}
              </div>
              {saveMsg && <div className='mt-3 text-sm text-[var(--color-success)] bg-[var(--color-success-light)] rounded-[var(--radius)] p-2 text-center'>{saveMsg}</div>}
              {puzzleMsg && <div className='mt-3 text-sm text-[var(--color-success)] bg-[var(--color-success-light)] rounded-[var(--radius)] p-2 text-center'>{puzzleMsg}</div>}
              {importMsg && <div className='mt-3 text-sm text-[var(--color-primary)] bg-[var(--color-primary-light)] rounded-[var(--radius)] p-2 text-center'>{importMsg}</div>}
            </Card>
          </>
        }
        side={
          <>
            <Card padding='none' className='overflow-hidden'>
              <div className='p-4 border-b border-[var(--color-border)] flex items-center justify-between'>
                <h3 className='font-semibold text-[var(--color-text)]'>{t('analysis.engineInsight')}</h3>
              </div>
              <Tabs defaultTab='summary' onChange={(tab) => setSelectedTab(tab as 'summary' | 'moves')} className='p-4'>
                <TabsList role='tablist' aria-label={t('analysis.sections')}>
                  <TabTrigger value='summary'>{t('analysis.summary')}</TabTrigger>
                  <TabTrigger value='moves'>{t('analysis.moves')}</TabTrigger>
                </TabsList>

                <TabPanel value='summary'>
                  <EvaluationChart
                    moves={analysisMoves}
                    currentMoveIndex={currentIndex}
                    onMoveClick={handleGoToMove}
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <KPICard label={t('analysis.whiteAccuracy')} value={whiteAccuracy.toFixed(1) + '%'} variant='success' />
                    <KPICard label={t('analysis.blackAccuracy')} value={blackAccuracy.toFixed(1) + '%'} variant='danger' />
                  </div>
                  {classificationRows.length > 0 && (
                    <ClassificationSummary
                      rows={classificationRows}
                      totalMoves={totalMoves}
                    />
                  )}
                </TabPanel>

                <TabPanel value='moves'>
                  <div className='space-y-4'>
                    {analysisResult && (
                      <>
                        <Card padding='md' className='bg-[var(--color-surface)] border border-[var(--color-border)]'>
                          <h3 className='font-semibold text-[var(--color-text)] mb-1'>{t('analysis.coachTake')}</h3>
                          <p className='text-sm text-[var(--color-text)]'>
                            {analysisResult.topMove.san} is {coachAdjective} move
                          </p>
                          <span className='inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold border border-[var(--color-border)] text-[var(--color-text-muted)]'>
                            {(analysisResult.topMove.evaluation >= 0 ? '+' : '') + analysisResult.topMove.evaluation.toFixed(2)}
                          </span>
                          <p className='mt-3 text-sm text-[var(--color-text-secondary)]'>{analysisResult.topMove.explanation}</p>
                        </Card>
                        <div className='flex flex-wrap gap-2'>
                          <Button variant='ghost' onClick={handleShowMoves}>
                            {t('analysis.showMoves')}
                          </Button>
                          <Button variant='primary' onClick={startAnalysis} disabled={analyzing.current || !ready || fen === undefined}>
                            {t('common.retry')}
                          </Button>
                          <Button onClick={handleShare}>{t('analysis.share')}</Button>
                          <Button onClick={handleGoNext} disabled={!canNext}>
                            {t('common.next')}
                          </Button>
                        </div>
                      </>
                    )}
                    {analysisMoves.length > 0 ? (
                      <div ref={movesTableRef} className='mt-4'>
                        <MoveTable rows={allMoveRows} />
                      </div>
                    ) : (
                      <div className='bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center text-sm text-[var(--color-text-muted)]'>
                        {t('analysis.coachNoAnalysis')}
                      </div>
                    )}
                  </div>
                </TabPanel>
              </Tabs>
            </Card>
          </>
        }
      />

      {/* Status Bar */}
      <StatusBarComponent saved={true} />

      {/* PGN Importer Modal */}
      {showPgnImport && (
        <PgnImporter onImport={handleImport} onClose={() => setShowPgnImport(false)} />
      )}
    </>
  )
}
