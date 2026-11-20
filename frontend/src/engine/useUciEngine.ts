import { useEffect, useState, useRef, useCallback } from 'react'
import { UciEngine } from './UciEngine'
import type { EvalInfo, MultiPvLine } from '../types/analysis'
import { positionEvalToMultiPvLines } from './convertEval'
import { useEngineConfig } from '../stores/engineStore'

let singletonEngine: UciEngine | null = null
let creatingEngine: Promise<UciEngine> | null = null
let refCount = 0

/**
 * Depth at which the live board analysis starts surfacing results. The engine
 * is already searching from depth 1 upwards; showing it earlier than this makes
 * the lines flicker, so we hold the previous/skeleton state until the search is
 * deep enough to be meaningful.
 */
export const BASE_DEPTH = 16

export type LiveAnalysisProgress = (lines: MultiPvLine[], depth: number) => void

async function getOrCreate(): Promise<UciEngine> {
  if (!singletonEngine) {
    // Share a single initialization between concurrent mounts (React StrictMode
    // runs effects twice): the WASM factory is expensive to spin up.
    if (!creatingEngine) {
      creatingEngine = UciEngine.create('Stockfish', 'wasm')
      creatingEngine.then(
        () => { creatingEngine = null },
        () => { creatingEngine = null },
      )
    }
    singletonEngine = await creatingEngine
  }
  return singletonEngine
}

/** @internal - only for testing */
export function __resetSingletonForTest(): void {
  singletonEngine = null
  creatingEngine = null
  refCount = 0
}

function destroySingleton(): void {
  if (singletonEngine) {
    singletonEngine.shutdown()
    singletonEngine = null
  }
}

export function useUciEngine() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evalInfo, setEvalInfo] = useState<EvalInfo | null>(null)
  const engineRef = useRef<UciEngine | null>(null)
  // Single source of truth: every engine call defaults to the values configured
  // in Settings (depth, MultiPV, Hash, Threads), so the UI and the engine can
  // never drift apart.
  const engineCfg = useEngineConfig()

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
    engine.evaluatePositionWithUpdate({ fen, depth: depth ?? engineCfg.depth, setPartialEval: (pe) => {
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
  }, [engineCfg.depth])

  const deepAnalyze = useCallback(async (fen: string, pvCount?: number, depth?: number): Promise<MultiPvLine[]> => {
    const engine = engineRef.current
    if (!engine) return []
    const result = await engine.evaluatePositionWithUpdate({
      fen,
      multiPv: pvCount ?? engineCfg.multiPv,
      depth: depth ?? engineCfg.depth,
      hash: engineCfg.hash,
      threads: engineCfg.threads,
    })
    return positionEvalToMultiPvLines(fen, result)
  }, [engineCfg.multiPv, engineCfg.depth, engineCfg.hash, engineCfg.threads])

  /**
   * Live board analysis: the engine searches forever (`go infinite`), starting
   * to report once it passes `BASE_DEPTH` and then deepening with time. The
   * configured depth is the first milestone (and drives when results appear
   * for shallow settings), after which the search keeps going.
   */
  const analyzeLive = useCallback(async (
    fen: string,
    onProgress: LiveAnalysisProgress,
  ): Promise<MultiPvLine[]> => {
    const engine = engineRef.current
    if (!engine) return []

    const startDepth = Math.min(BASE_DEPTH, Math.max(1, engineCfg.depth))

    const result = await engine.evaluatePositionWithUpdate({
      fen,
      multiPv: engineCfg.multiPv,
      depth: engineCfg.depth,
      hash: engineCfg.hash,
      threads: engineCfg.threads,
      infinite: true,
      setPartialEval: (positionEval) => {
        if (positionEval.lines.length === 0) return
        const depth = positionEval.lines.reduce((max, line) => Math.max(max, line.depth), 0)
        if (depth < startDepth) return
        onProgress(positionEvalToMultiPvLines(fen, positionEval), depth)
      },
    })
    return positionEvalToMultiPvLines(fen, result)
  }, [engineCfg.multiPv, engineCfg.depth, engineCfg.hash, engineCfg.threads])

const bestMove = useCallback(async (fen: string, _elo = 2800, depth = 14, movetimeMs = 2500): Promise<EvalInfo> => {
    const engine = engineRef.current
    if (!engine || !engine.getIsReady()) {
      return { bestMove: '', evaluation: 0, mate: null, depth: 0 }
    }
    const uci = await engine.getEngineNextMove(fen, _elo, depth, movetimeMs)
    return {
      bestMove: uci ?? '',
      evaluation: 0,
      mate: null,
      depth,
    }
  }, [])

  return { ready, error, evalInfo, analyze, deepAnalyze, analyzeLive, bestMove }
}
