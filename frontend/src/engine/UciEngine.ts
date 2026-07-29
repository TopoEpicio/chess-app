import type { EvalInfo } from '../types/analysis'
import type { EngineWorker, WorkerJob } from '../types/engine'
import type {
  EvaluateGameParams,
  EvaluatePositionWithUpdateParams,
  GameEval,
  PositionEval,
  LineEval,
} from '../types/eval'
import { getResultProperty, parseEvaluationResults, sortLines } from './helpers/parseResults'
import { computeAccuracy } from './helpers/accuracy'
import { getIsStalemate, getWhoIsCheckmated } from './helpers/chess'
import { getMovesClassification } from './helpers/moveClassification'
import { computeEstimatedElo } from './helpers/estimateElo'
import { getEngineWorker, sendCommandsToWorker } from './worker'

export interface UciEngineOptions {
  hashSize?: number
  threads?: number
  multiPv?: number
}

export class UciEngine {
  public readonly name: string
  private workers: EngineWorker[] = []
  private workerQueue: WorkerJob[] = []
  private isReady = false
  private enginePath: string
  private customEngineInit?: (worker: EngineWorker) => Promise<void>
  private multiPv = 3
  private hashSize = 64
  private threads = 1

  private constructor(
    engineName: string,
    enginePath: string,
    options?: UciEngineOptions,
    customEngineInit?: (worker: EngineWorker) => Promise<void>,
  ) {
    this.name = engineName
    this.enginePath = enginePath
    this.customEngineInit = customEngineInit
    if (options?.hashSize !== undefined) this.hashSize = options.hashSize
    if (options?.threads !== undefined) this.threads = options.threads
    if (options?.multiPv !== undefined) this.multiPv = options.multiPv
  }

  static async create(
    engineName: string,
    enginePath: string,
    options?: UciEngineOptions,
    customEngineInit?: (worker: EngineWorker) => Promise<void>,
  ): Promise<UciEngine> {
    const engine = new UciEngine(engineName, enginePath, options, customEngineInit)
    await engine.addNewWorker()
    engine.isReady = true
    return engine
  }

  private acquireWorker(): EngineWorker | undefined {
    for (const worker of this.workers) {
      if (!worker.isReady) continue
      worker.isReady = false
      return worker
    }
    return undefined
  }

  private async releaseWorker(worker: EngineWorker) {
    const nextJob = this.workerQueue.shift()
    if (!nextJob) {
      worker.isReady = true
      return
    }

    const res = await sendCommandsToWorker(
      worker,
      nextJob.commands,
      nextJob.finalMessage,
      nextJob.onNewMessage,
    )

    this.releaseWorker(worker)
    nextJob.resolve(res)
  }

  private async setMultiPv(multiPv: number) {
    if (multiPv === this.multiPv) return

    if (multiPv < 1 || multiPv > 6) {
      throw new Error(`Invalid MultiPV value: ${multiPv}`)
    }

    await this.sendCommandsToEachWorker(
      [`setoption name MultiPV value ${multiPv}`, 'isready'],
      'readyok',
    )

    this.multiPv = multiPv
  }

  getIsReady(): boolean {
    return this.isReady
  }

  private throwErrorIfNotReady() {
    if (!this.isReady) {
      throw new Error(`${this.name} is not ready`)
    }
  }

  shutdown(): void {
    this.isReady = false
    this.workerQueue = []

    for (const worker of this.workers) {
      this.terminateWorker(worker)
    }
    this.workers = []
  }

  private terminateWorker(worker: EngineWorker) {
    worker.isReady = false
    worker.uci('quit')
    worker.terminate()
  }

  async stopAllCurrentJobs(): Promise<void> {
    const abandonedJobs = [...this.workerQueue]
    this.workerQueue = []

    for (const worker of this.workers) {
      worker.listen = () => {}
    }

    for (const job of abandonedJobs) {
      job.resolve([])
    }

    await this.sendCommandsToEachWorker(['stop', 'isready'], 'readyok')

    for (const worker of this.workers) {
      this.releaseWorker(worker)
    }
  }

  private async sendCommands(
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void,
  ): Promise<string[]> {
    const worker = this.acquireWorker()

    if (!worker) {
      return new Promise((resolve) => {
        this.workerQueue.push({
          commands,
          finalMessage,
          onNewMessage,
          resolve,
        })
      })
    }

    const res = await sendCommandsToWorker(worker, commands, finalMessage, onNewMessage)

    this.releaseWorker(worker)
    return res
  }

  private async sendCommandsToEachWorker(
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void,
  ): Promise<void> {
    await Promise.all(
      this.workers.map(async (worker) => {
        await sendCommandsToWorker(worker, commands, finalMessage, onNewMessage)
        this.releaseWorker(worker)
      }),
    )
  }

  private async addNewWorker() {
    const worker = getEngineWorker(this.enginePath)

    await sendCommandsToWorker(worker, ['uci'], 'uciok')
    await sendCommandsToWorker(
      worker,
      [
        `setoption name Hash value ${this.hashSize}`,
        `setoption name Threads value ${this.threads}`,
        `setoption name MultiPV value ${this.multiPv}`,
        'isready',
      ],
      'readyok',
    )
    await this.customEngineInit?.(worker)
    await sendCommandsToWorker(worker, ['ucinewgame', 'isready'], 'readyok')

    this.workers.push(worker)
    this.releaseWorker(worker)
  }

  async setHashAndThreads(hash: number, threads: number): Promise<void> {
    if (hash === this.hashSize && threads === this.threads) return
    await this.sendCommandsToEachWorker(
      [`setoption name Hash value ${hash}`, `setoption name Threads value ${threads}`, 'isready'],
      'readyok',
    )
    this.hashSize = hash
    this.threads = threads
  }

  private async setWorkersNb(workersNb: number) {
    if (workersNb === this.workers.length) return

    if (workersNb < 1) {
      throw new Error(`Number of workers must be greater than 0, got ${workersNb}`)
    }

    if (workersNb < this.workers.length) {
      const workersToRemove = this.workers.slice(workersNb)
      this.workers = this.workers.slice(0, workersNb)

      for (const worker of workersToRemove) {
        this.terminateWorker(worker)
      }
      return
    }

    const workersNbToCreate = workersNb - this.workers.length

    await Promise.all(
      new Array(workersNbToCreate).fill(0).map(() => this.addNewWorker()),
    )
  }

  async evaluateGame(params: EvaluateGameParams): Promise<GameEval> {
    const { fens, uciMoves, depth = 16, multiPv = this.multiPv, setEvaluationProgress, playersRatings, workersNb = 1 } = params

    this.throwErrorIfNotReady()
    this.isReady = false
    setEvaluationProgress?.(1)

    await this.setMultiPv(multiPv)
    await this.sendCommandsToEachWorker(['ucinewgame', 'isready'], 'readyok')
    await this.setWorkersNb(workersNb)

    const positions: PositionEval[] = new Array(fens.length)
    let completed = 0

    const updateEval = (index: number, positionEval: PositionEval) => {
      completed++
      positions[index] = positionEval
      const progress = completed / fens.length
      setEvaluationProgress?.(99 - Math.exp(-4 * progress) * 99)
    }

    await Promise.all(
      fens.map(async (fen, i) => {
        const whoIsCheckmated = getWhoIsCheckmated(fen)
        if (whoIsCheckmated) {
          updateEval(i, {
            lines: [
              {
                pv: [],
                depth: 0,
                multiPv: 1,
                mate: whoIsCheckmated === 'w' ? -1 : 1,
              },
            ],
          })
          return
        }

        const isStalemate = getIsStalemate(fen)
        if (isStalemate) {
          updateEval(i, {
            lines: [
              {
                pv: [],
                depth: 0,
                multiPv: 1,
                cp: 0,
              },
            ],
          })
          return
        }

        const result = await this.evaluatePosition(fen, depth)
        updateEval(i, result)
      }),
    )

    await this.setWorkersNb(1)
    this.isReady = true

    const positionsWithClassification = getMovesClassification(positions, uciMoves, fens)
    const accuracy = computeAccuracy(positions)
    const estimatedElo = computeEstimatedElo(positions, playersRatings?.white, playersRatings?.black)

    return {
      positions: positionsWithClassification,
      estimatedElo,
      accuracy,
      settings: {
        engine: this.name,
        date: new Date().toISOString(),
        depth,
        multiPv,
      },
    }
  }

  private async evaluatePosition(fen: string, depth = 16): Promise<PositionEval> {
    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      'bestmove',
    )

    return parseEvaluationResults(results, fen)
  }

  async evaluatePositionWithUpdate(params: EvaluatePositionWithUpdateParams): Promise<PositionEval> {
    const { fen, depth = 16, multiPv = this.multiPv, setPartialEval } = params

    this.throwErrorIfNotReady()

    await this.stopAllCurrentJobs()
    await this.setMultiPv(multiPv)

    let lastUpdate = 0
    const THROTTLE_MS = 60

    const onNewMessage = (messages: string[]) => {
      if (!setPartialEval) return

      const now = performance.now()
      if (now < lastUpdate + THROTTLE_MS) return
      lastUpdate = now

      const parsedResults = parseEvaluationResults(messages, fen)
      setPartialEval(parsedResults)
    }

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      'bestmove',
      onNewMessage,
    )

    return parseEvaluationResults(results, fen)
  }

  async getEngineNextMoveWithEval(
    fen: string,
    movetimeMs = 1500,
  ): Promise<EvalInfo> {
    this.throwErrorIfNotReady()

    await this.stopAllCurrentJobs()

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go movetime ${movetimeMs}`],
      'bestmove',
    )

    const positionEval = parseEvaluationResults(results, fen)
    const bestLine = positionEval.lines[0]
    const moveResult = results.find((r) => r.startsWith('bestmove'))
    const bestMove = getResultProperty(moveResult ?? '', 'bestmove') ?? ''

    return {
      bestMove: bestMove === '(none)' ? '' : bestMove,
      evaluation: bestLine?.mate !== undefined ? (bestLine.mate > 0 ? 10 : -10) : (bestLine?.cp ?? 0) / 100,
      mate: bestLine?.mate ?? null,
      depth: bestLine?.depth ?? 0,
    }
  }
}
