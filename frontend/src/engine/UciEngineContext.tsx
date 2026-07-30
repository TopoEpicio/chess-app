import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { Chess } from 'chess.js'
import { UciEngine } from './UciEngine'
import { useEngineConfig } from '../stores/engineStore'
import type { EvalInfo, MultiPvLine } from '../types/analysis'
import { positionEvalToMultiPvLines } from './convertEval'

interface UciEngineContextValue {
  ready: boolean
  error: string | null
  evalInfo: EvalInfo | null
  analyze: (fen: string, depth?: number) => void
  deepAnalyze: (fen: string, pvCount?: number, depth?: number) => Promise<MultiPvLine[]>
  bestMove: (fen: string, elo?: number, random?: () => number) => Promise<EvalInfo>
}

const UciEngineCtx = createContext<UciEngineContextValue | null>(null)

export function UciEngineProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evalInfo, setEvalInfo] = useState<EvalInfo | null>(null)
  const engineRef = useRef<UciEngine | null>(null)
  const { hash, threads, multiPv } = useEngineConfig()

  useEffect(() => {
    let cancelled = false

    UciEngine.create('Stockfish', 'wasm', { hashSize: hash, threads, multiPv })
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
      engineRef.current?.shutdown()
      engineRef.current = null
      setReady(false)
      setError(null)
    }
  }, [hash, threads, multiPv])

  const analyze = useCallback((fen: string, depth?: number) => {
    const engine = engineRef.current
    if (!engine) return
    engine.evaluatePositionWithUpdate({ fen, depth, setPartialEval: (pe) => {
      const line = pe.lines[0]
      if (line) {
        setEvalInfo({
          bestMove: pe.bestMove ?? line.pv[0] ?? '',
          evaluation: line.mate !== undefined ? (line.mate > 0 ? 10 : -10) : (line.cp ?? 0) / 100,
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

  const bestMove = useCallback(async (fen: string, elo?: number, random?: () => number): Promise<EvalInfo> => {
    const engine = engineRef.current
    if (!engine) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }

    const targetElo = elo ?? 2800
    const movetimeMs = Math.min(1500, Math.max(300, Math.round(targetElo * 0.75)))

    const game = new Chess(fen)
    const legalMoves = game.moves({ verbose: true })
    if (legalMoves.length === 0) return { bestMove: '', evaluation: 0, mate: null, depth: 0 }

    const effectiveness = Math.min(1, Math.max(0, (targetElo - 200) / (2800 - 200)))
    const blunderProb = (1 - effectiveness) * 0.85

    const rng = random ?? Math.random
    if (rng() < blunderProb) {
      const randomMove = legalMoves[Math.floor(rng() * legalMoves.length)]
      return {
        bestMove: randomMove.from + randomMove.to + (randomMove.promotion ?? ''),
        evaluation: 0,
        mate: null,
        depth: 0,
      }
    }

    return engine.getEngineNextMoveWithEval(fen, movetimeMs)
  }, [])

  return (
    <UciEngineCtx.Provider value={{ ready, error, evalInfo, analyze, deepAnalyze, bestMove }}>
      {children}
    </UciEngineCtx.Provider>
  )
}

export function useUciEngine(): UciEngineContextValue {
  const ctx = useContext(UciEngineCtx)
  if (!ctx) throw new Error('useUciEngine must be used within UciEngineProvider')
  return ctx
}
