import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { findOpeningByFen, findOpeningByMoves } from '../data/openings'
import {
  boardAtom,
  gameEvalAtom,
  gameAtom,
  savedEvalsAtom,
  engineDepthAtom,
  engineMultiPvAtom,
  currentPositionAtom,
} from '../sections/analysis/states'
import { UciEngine } from './UciEngine'

let engineInstance: UciEngine | null = null

function getEngine(): UciEngine | null {
  return engineInstance
}

function setEngine(engine: UciEngine | null) {
  engineInstance = engine
}

// Starting position FEN (normalized to piece placement + active color only)
const STARTING_FEN_NORMALIZED = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w'

export function useCurrentPosition() {
  const [board] = useAtom(boardAtom)
  const gameEval = useAtomValue(gameEvalAtom)
  const [_game] = useAtom(gameAtom)
  const [savedEvals, setSavedEvals] = useAtom(savedEvalsAtom)
  const engineDepth = useAtomValue(engineDepthAtom)
  const engineMultiPv = useAtomValue(engineMultiPvAtom)
  const [currentPosition, setCurrentPosition] = useAtom(currentPositionAtom)

  const analysisRequestRef = useRef<number>(0)

  // Compute current position data from board state
  const computeCurrentPosition = useCallback(() => {
    const fen = board.fen()
    const history = board.history({ verbose: true })
    const lastMove = history[history.length - 1]

    let opening: string | undefined

    // Match opening from the move history (fast trie, any prefix), then FEN fallback.
    const historySans = board.history()
    const openingMatch = findOpeningByMoves(historySans)
    if (openingMatch) opening = openingMatch.variation.name
    else { const byFen = findOpeningByFen(fen); if (byFen) opening = byFen.name }

    // Special-case: starting position
    const normalizedFen = fen.split(' ').slice(0, 2).join(' ')
    if (!opening && normalizedFen === STARTING_FEN_NORMALIZED) {
      opening = 'Starting Position'
    }

    // Find eval from gameEval if board matches game history
    let evalData: typeof currentPosition.eval = undefined
    let lastEvalData: typeof currentPosition.lastEval = undefined

    if (gameEval && gameEval.positions.length > 0) {
      // Check if current board position matches a position in the analyzed game
      const _boardFen = fen.split(' ').slice(0, 4).join(' ') // board + active color + castling + en passant
      const moveNumber = Math.floor(history.length / 2) + (board.turn() === 'w' ? 1 : 0)

      if (moveNumber > 0 && moveNumber <= gameEval.positions.length) {
        evalData = gameEval.positions[moveNumber - 1]
        if (moveNumber > 1) {
          lastEvalData = gameEval.positions[moveNumber - 2]
        }
      }
    }

    return {
      fen,
      lastMove: lastMove
        ? {
            from: lastMove.from,
            to: lastMove.to,
            san: lastMove.san,
            color: lastMove.color,
          }
        : undefined,
      currentMoveIdx: history.length,
      eval: evalData,
      lastEval: lastEvalData,
      opening,
    }
  }, [board, gameEval])

  // Update currentPosition atom when board or gameEval changes
  useEffect(() => {
    const computed = computeCurrentPosition()
    setCurrentPosition(computed)
  }, [computeCurrentPosition, setCurrentPosition])

  // Auto-evaluate position when no eval available
  useEffect(() => {
    const fen = currentPosition.fen
    const evalData = currentPosition.eval

    // If we already have eval for this position, no need to analyze
    if (evalData) return

    const engine = getEngine()
    if (!engine || !engine.getIsReady()) return

    const requestId = ++analysisRequestRef.current

    // Check session cache first
    const cached = savedEvals[fen]
    if (cached) {
      if (analysisRequestRef.current === requestId) {
        setCurrentPosition((prev) => ({ ...prev, eval: cached }))
      }
      return
    }

    // Analyze with engine
    engine
      .evaluatePositionWithUpdate({
        fen,
        depth: engineDepth,
        multiPv: engineMultiPv,
        setPartialEval: (partial) => {
          if (analysisRequestRef.current === requestId) {
            setCurrentPosition((prev) => ({ ...prev, eval: partial }))
          }
        },
      })
      .then((result) => {
        if (analysisRequestRef.current !== requestId) return

        // Save to session cache
        const cacheEntry = { ...result, engine: 'stockfish' }
        setSavedEvals((prev) => ({ ...prev, [fen]: cacheEntry }))

        setCurrentPosition((prev) => ({ ...prev, eval: result }))
      })
      .catch(() => {
        // Ignore errors from cancelled/aborted analyses
      })
  }, [currentPosition.fen, currentPosition.eval, engineDepth, engineMultiPv, savedEvals, setSavedEvals, setCurrentPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const engine = getEngine()
      if (engine) {
        engine.stopAllCurrentJobs()
      }
    }
  }, [])

  return currentPosition
}

export function setUciEngine(engine: UciEngine | null) {
  setEngine(engine)
}
