import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { EngineAdapter, EvalInfo } from './interface'
import { StockfishWasmAdapter } from './stockfish-adapter'

const EngineContext = createContext<EngineAdapter | null>(null)

function usePollAdapter(adapter: EngineAdapter) {
  const [ready, setReady] = useState(adapter.ready)
  const [error, setError] = useState<string | null>(adapter.error)
  const [evalInfo, setEvalInfo] = useState<EvalInfo | null>(adapter.evalInfo)
  const adapterRef = useRef(adapter)

  useEffect(() => {
    adapterRef.current = adapter
  }, [adapter])

  useEffect(() => {
    const check = setInterval(() => {
      setReady(adapterRef.current.ready)
      setError(adapterRef.current.error)
      setEvalInfo(adapterRef.current.evalInfo)
    }, 200)
    return () => clearInterval(check)
  }, [])

  const analyze = useRef((fen: string, depth?: number) => {
    adapterRef.current.analyze(fen, depth)
  }).current

  const bestMove = useRef((fen: string, callback: (info: EvalInfo) => void) => {
    adapterRef.current.bestMove(fen, callback)
  }).current

  const deepAnalyze = useRef((fen: string, pvCount?: number) => {
    return adapterRef.current.deepAnalyze(fen, pvCount)
  }).current

  return { evalInfo, analyze, bestMove, deepAnalyze, ready, error }
}

interface EngineProviderProps {
  children: ReactNode
  adapter?: EngineAdapter
}

export function EngineProvider({ children, adapter }: EngineProviderProps) {
  const engineRef = useRef<EngineAdapter | null>(null)

  if (!engineRef.current) {
    engineRef.current = adapter ?? new StockfishWasmAdapter()
  }

  const engine = engineRef.current

  useEffect(() => {
    if ('init' in engine && typeof (engine as any).init === 'function') {
      ;(engine as any).init()
    }
    return () => {
      engine.destroy()
    }
  }, [engine])

  return (
    <EngineContext.Provider value={engine}>
      {children}
    </EngineContext.Provider>
  )
}

export function useEngineAdapter() {
  const adapter = useContext(EngineContext)
  if (!adapter) {
    throw new Error('useEngineAdapter must be used within an EngineProvider')
  }
  return usePollAdapter(adapter)
}
