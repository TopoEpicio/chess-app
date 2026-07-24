import { useEffect, useState, useRef, useCallback } from 'react'
import { UciEngine } from './UciEngine'
import type { EvalInfo, MultiPvLine } from '../types/analysis'
import { positionEvalToMultiPvLines } from './convertEval'

let singletonEngine: UciEngine | null = null
let refCount = 0

async function getOrCreate(): Promise<UciEngine> {
  if (!singletonEngine) {
    singletonEngine = await UciEngine.create('Stockfish', '/stockfish.js')
  }
  return singletonEngine
}

/** @internal - only for testing */
export function __resetSingletonForTest(): void {
  singletonEngine = null
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

  const bestMove = useCallback(async (fen: string): Promise<EvalInfo> => {
    const engine = engineRef.current
    if (!engine) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }
    const uci = await engine.getEngineNextMove(fen, 2800, 22)
    return {
      bestMove: uci ?? '',
      evaluation: 0,
      mate: null,
      depth: 22,
    }
  }, [])

  return { ready, error, evalInfo, analyze, deepAnalyze, bestMove }
}
