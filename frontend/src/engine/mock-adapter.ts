import type { MultiPvLine } from '../types/analysis'
import type { EngineAdapter, EvalInfo } from './interface.ts'

export class MockEngineAdapter implements EngineAdapter {
  ready = true
  error: string | null = null
  evalInfo: EvalInfo | null = null
  private analyzeCallback: ((fen: string) => void) | null = null

  onAnalyze(cb: (fen: string) => void) {
    this.analyzeCallback = cb
  }

  setEvalInfo(info: EvalInfo) {
    this.evalInfo = info
  }

  analyze(fen: string, _depth?: number) {
    this.evalInfo = { bestMove: 'e2e4', evaluation: 0.3, mate: null, depth: 18 }
    this.analyzeCallback?.(fen)
  }

  bestMove(fen: string, callback: (info: EvalInfo) => void) {
    callback({ bestMove: 'e2e4', evaluation: 0.3, mate: null, depth: 18 })
  }

  async deepAnalyze(_fen: string, _pvCount?: number, _depth?: number): Promise<MultiPvLine[]> {
    return [
      { rank: 1, san: 'e4', uci: 'e2e4', evaluation: 0.3, mate: null, depth: 18, pv: ['e2e4', 'e7e5'] },
      { rank: 2, san: 'd4', uci: 'd2d4', evaluation: 0.2, mate: null, depth: 16, pv: ['d2d4', 'd7d5'] },
    ]
  }

  stop() {}
  destroy() {}
}
