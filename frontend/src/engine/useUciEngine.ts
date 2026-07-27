import { useEffect, useState, useRef, useCallback } from 'react'
import { Chess } from 'chess.js'
import { UciEngine } from './UciEngine'
import type { EvalInfo, MultiPvLine } from '../types/analysis'
import { positionEvalToMultiPvLines } from './convertEval'

let enginePromise: Promise<UciEngine> | null = null
let refCount = 0

async function getOrCreate(): Promise<UciEngine> {
  if (!enginePromise) {
    enginePromise = UciEngine.create('Stockfish', 'wasm')
  }
  return enginePromise
}

/** @internal - only for testing */
export function __resetSingletonForTest(): void {
  enginePromise = null
  refCount = 0
}

function destroySingleton(): void {
  // Stockfish's Emscripten module shares global state (B = PThread) across
  // all factory calls. Shutting down one engine's workers via B.bc() kills
  // ALL workers including any other engine's. The singleton lives forever.
}

export function useUciEngine() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evalInfo, setEvalInfo] = useState<EvalInfo | null>(null)
  const engineRef = useRef<UciEngine | null>(null)

  useEffect(() => {
    let cancelled = false
    refCount++

    getOrCreate()
      .then((engine) => {
        if (cancelled) return
        engineRef.current = engine
        setReady(engine.getIsReady())
      })
      .catch((err) => {
        if (cancelled) return
        setError(String(err))
      })

    return () => {
      cancelled = true
      refCount--
      if (refCount <= 0) {
        destroySingleton()
      }
    }
  }, [])

  const analyze = useCallback((fen: string, depth?: number) => {
    const engine = engineRef.current
    if (!engine) return
    engine.evaluatePositionWithUpdate({ fen, depth, setPartialEval: (pe) => {
      const line = pe.lines[0]
      if (line) {
        setEvalInfo({
          bestMove: pe.bestMove ?? line.pv[0] ?? '',
          evaluation: line.mate !== undefined ? 0 : (line.cp ?? 0) / 100,
          mate: line.mate ?? null,
          depth: line.depth,
        })
      }
    } })
  }, [])

  const deepAnalyze = useCallback(async (fen: string, pvCount?: number, depth?: number): Promise<MultiPvLine[]> => {
    const engine = engineRef.current
    if (!engine) return []
    const multiPv = pvCount ?? 3
    const result = await engine.evaluatePositionWithUpdate({ fen, multiPv, depth })
    return positionEvalToMultiPvLines(fen, result)
  }, [])

  const bestMove = useCallback(async (fen: string, elo?: number): Promise<EvalInfo> => {
    const engine = engineRef.current
    if (!engine) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }

    const targetElo = elo ?? 2800
    const movetimeMs = Math.min(1500, Math.max(300, Math.round(targetElo * 0.75)))

    const game = new Chess(fen)
    const legalMoves = game.moves({ verbose: true })
    if (legalMoves.length === 0) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }

    const effectiveness = Math.min(1, Math.max(0, (targetElo - 200) / (2800 - 200)))
    const blunderProb = (1 - effectiveness) * 0.85

    if (Math.random() < blunderProb) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
      return {
        bestMove: randomMove.from + randomMove.to + (randomMove.promotion ?? ''),
        evaluation: 0,
        mate: null,
        depth: 0,
      }
    }

    const uci = await engine.getEngineNextMove(fen, movetimeMs)
    return {
      bestMove: uci ?? '',
      evaluation: 0,
      mate: null,
      depth: 0,
    }
  }, [])

  return { ready, error, evalInfo, analyze, deepAnalyze, bestMove }
}
