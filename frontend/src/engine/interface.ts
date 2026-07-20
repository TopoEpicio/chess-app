import type { MultiPvLine } from '../types/analysis'

export interface EvalInfo {
  bestMove: string
  evaluation: number
  mate: number | null
  depth: number
}

export interface EngineAdapter {
  readonly ready: boolean
  readonly error: string | null
  readonly evalInfo: EvalInfo | null

  analyze(fen: string, depth?: number): void
  bestMove(fen: string, callback: (info: EvalInfo) => void): void
  deepAnalyze(fen: string, pvCount?: number): Promise<MultiPvLine[]>
  stop(): void
  destroy(): void
}
