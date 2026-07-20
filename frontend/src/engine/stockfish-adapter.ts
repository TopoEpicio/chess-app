import { Chess } from 'chess.js'
import type { MultiPvLine } from '../types/analysis'
import type { EngineAdapter, EvalInfo } from './interface.ts'
import { parseScoreLine, parseBestMoveLine, evalInfoFromScore, buildPositionCommand } from './uci-protocol.ts'

interface StockfishEngine {
  postMessage: (msg: string) => void
  addMessageListener: (listener: (event: string) => void) => void
  removeMessageListener: (listener: (event: string) => void) => void
  ready?: Promise<void>
  terminate?: () => void
}

declare global {
  interface Window {
    Stockfish?: (opts?: { locateFile?: (path: string) => string }) => StockfishEngine
  }
}

export class StockfishWasmAdapter implements EngineAdapter {
  private engine: StockfishEngine | null = null
  private _ready = false
  private _error: string | null = null
  private _evalInfo: EvalInfo | null = null
  private callbackRef: ((info: EvalInfo) => void) | null = null
  private queue: string[] = []
  private lastEval: Partial<EvalInfo> = {}
  private side: 'w' | 'b' = 'w'
  private deepAnalyzeRef: {
    fen: string
    lines: Map<number, { evaluation: number; mate: number | null; depth: number; pv: string[] }>
    resolve: (result: MultiPvLine[]) => void
  } | null = null

  get ready() { return this._ready }
  get error() { return this._error }
  get evalInfo() { return this._evalInfo }

  async init(): Promise<void> {
    try {
      if (!window.Stockfish) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = '/stockfish.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load stockfish.js'))
          document.head.appendChild(script)
        })
      }

      const StockfishFactory = window.Stockfish
      if (typeof StockfishFactory !== 'function') {
        throw new Error('Stockfish module does not export a function')
      }

      const engine = await StockfishFactory({
        locateFile: (path: string) => `/${path}`,
      })
      this.engine = engine

      engine.addMessageListener((event: string) => {
        this.handleMessage(event)
      })

      engine.postMessage('uci')
      engine.postMessage('setoption name Threads value 1')
      engine.postMessage('setoption name Hash value 16')
      engine.postMessage('isready')

      if (engine.ready) {
        await engine.ready
      }

      this._ready = true
      for (const fen of this.queue) {
        this.sendPosition(fen)
      }
      this.queue = []
    } catch (err) {
      this._error = String(err)
    }
  }

  private handleMessage(event: string) {
    const parts = event.trim().split(/\s+/)

    if (parts[0] === 'info' && parts.includes('score')) {
      const score = parseScoreLine(event)
      if (!score) return

      if (this.deepAnalyzeRef) {
        this.deepAnalyzeRef.lines.set(score.multipv, {
          evaluation: score.evaluation,
          mate: score.mate,
          depth: score.depth,
          pv: score.pv,
        })
      }

      if (score.multipv === 1) {
        const info = evalInfoFromScore(score, this.side === 'b' ? '8/8/8/8/8/8/8/8 b' : '8/8/8/8/8/8/8/8 w')
        this._evalInfo = info
        this.lastEval = info
      }
    }

    if (parts[0] === 'bestmove' && parts[1]) {
      const uci = parseBestMoveLine(event)
      if (this.deepAnalyzeRef) {
        this.finishDeepAnalyze(uci)
        return
      }

      if (uci) {
        this._evalInfo = this._evalInfo
          ? { ...this._evalInfo, bestMove: uci }
          : { bestMove: uci, evaluation: 0, mate: null, depth: 0 }
        if (this.callbackRef) {
          this.callbackRef({
            bestMove: uci,
            evaluation: this.lastEval.evaluation ?? 0,
            mate: this.lastEval.mate ?? null,
            depth: this.lastEval.depth ?? 0,
          })
          this.callbackRef = null
        }
      }
    }
  }

  private finishDeepAnalyze(uci: string | null) {
    const da = this.deepAnalyzeRef!
    if (da.lines.size === 0 && uci === null) {
      this.deepAnalyzeRef = null
      da.resolve([])
      return
    }

    const sorted = Array.from(da.lines.entries()).sort(([a], [b]) => a - b)
    let tempGame: Chess | null = null
    try { tempGame = new Chess(da.fen) } catch {}

    const result: MultiPvLine[] = sorted.map(([_rank, data]) => {
      let san = ''
      const uciMove = data.pv[0] || ''
      if (tempGame && uciMove) {
        try {
          san = tempGame.move(uciMove).san
          tempGame.undo()
        } catch {}
      }
      return {
        rank: _rank,
        san,
        uci: uciMove,
        evaluation: data.evaluation,
        mate: data.mate,
        depth: data.depth,
        pv: data.pv,
      }
    })

    this.engine?.postMessage('setoption name MultiPV value 1')
    this.deepAnalyzeRef = null
    da.resolve(result)
  }

  private sendPosition(fen: string) {
    this.side = (fen.split(' ')[1] || 'w') as 'w' | 'b'
    this.engine?.postMessage('stop')
    this.engine?.postMessage(buildPositionCommand(fen))
  }

  analyze(fen: string, depth: number = 22) {
    if (!this.engine) {
      this.queue.push(fen)
      return
    }
    this._evalInfo = null
    this.sendPosition(fen)
    this.engine.postMessage(`go depth ${depth}`)
  }

  bestMove(fen: string, callback: (info: EvalInfo) => void) {
    this.callbackRef = callback
    if (!this.engine) return
    this.sendPosition(fen)
    this.engine.postMessage('go depth 22')
  }

  async deepAnalyze(fen: string, pvCount = 3): Promise<MultiPvLine[]> {
    if (!this.engine) return []

    this.engine.postMessage('stop')
    await new Promise((r) => setTimeout(r, 300))

    return new Promise<MultiPvLine[]>((resolve) => {
      this.deepAnalyzeRef = { fen, lines: new Map(), resolve }
      this.side = (fen.split(' ')[1] || 'w') as 'w' | 'b'
      this.engine!.postMessage('setoption name MultiPV value ' + pvCount)
      this.engine!.postMessage(buildPositionCommand(fen))
      this.engine!.postMessage('go depth 18')
    })
  }

  stop() {
    this.engine?.postMessage('stop')
  }

  destroy() {
    this.engine?.terminate?.()
    this.engine = null
    this._ready = false
  }
}
