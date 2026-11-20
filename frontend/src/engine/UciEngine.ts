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
import type { CommandHandle } from './worker'

/** Difficulty slider bounds (Play page). */
const ELO_MIN_UI = 200
const ELO_MAX_UI = 3200
/** Window the UCI_Elo option accepts; outside it we fall back to Skill Level. */
const ELO_MIN_ENGINE = 1320
const ELO_MAX_ENGINE = 3190
/** Upper bound exposed by the Settings MultiPV slider. */
const MAX_MULTI_PV = 10

export class UciEngine {
  public readonly name: string
  private workers: EngineWorker[] = []
  private workerQueue: WorkerJob[] = []
  private isReady = false
  private enginePath: string
  private customEngineInit?: (worker: EngineWorker) => Promise<void>
  private multiPv = 3
  private hash?: number
  private threads?: number
  private elo: number | undefined
  /** Handles for in-flight searches so they can be aborted cleanly. */
  private activeSearches = new Set<CommandHandle>()

  private constructor(
    engineName: string,
    enginePath: string,
    customEngineInit?: (worker: EngineWorker) => Promise<void>,
  ) {
    this.name = engineName
    this.enginePath = enginePath
    this.customEngineInit = customEngineInit
  }

  static async create(
    engineName: string,
    enginePath: string,
    customEngineInit?: (worker: EngineWorker) => Promise<void>,
  ): Promise<UciEngine> {
    const engine = new UciEngine(engineName, enginePath, customEngineInit)
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

    if (multiPv < 1 || multiPv > MAX_MULTI_PV) {
      throw new Error(`Invalid MultiPV value: ${multiPv}`)
    }

    await this.sendCommandsToEachWorker(
      [`setoption name MultiPV value ${multiPv}`, 'isready'],
      'readyok',
    )

    this.multiPv = multiPv
  }

  /** Hash size in MB. Applied only when the value actually changes. */
  private async setHash(hash: number) {
    if (hash === this.hash) return

    await this.sendCommandsToEachWorker(
      [`setoption name Hash value ${hash}`, 'isready'],
      'readyok',
    )

    this.hash = hash
  }

  /**
   * Search threads. The single-threaded WASM build answers "No such option"
   * with an `info string`, which is harmless: we wait for `readyok` anyway.
   */
  private async setThreads(threads: number) {
    if (threads === this.threads) return

    await this.sendCommandsToEachWorker(
      [`setoption name Threads value ${threads}`, 'isready'],
      'readyok',
    )

    this.threads = threads
  }

  private async setElo(elo: number) {
    const target = Math.round(Math.min(ELO_MAX_UI, Math.max(ELO_MIN_UI, elo)))
    if (target === this.elo) return

    if (target >= ELO_MAX_ENGINE) {
      // Full strength: lift the limit and keep the highest skill level.
      await this.sendCommandsToEachWorker(
        [
          'setoption name UCI_LimitStrength value false',
          'setoption name Skill Level value 20',
          'isready',
        ],
        'readyok',
      )
    } else {
      // UCI_Elo cannot go below the engine's window, so weaker settings are
      // approximated with Skill Level as well instead of throwing.
      const engineElo = Math.max(ELO_MIN_ENGINE, target)
      const skill =
        target >= ELO_MIN_ENGINE
          ? 20
          : Math.round(((target - ELO_MIN_UI) / (ELO_MIN_ENGINE - ELO_MIN_UI)) * 20)

      await this.sendCommandsToEachWorker(
        [
          'setoption name UCI_LimitStrength value true',
          `setoption name UCI_Elo value ${engineElo}`,
          `setoption name Skill Level value ${skill}`,
          'isready',
        ],
        'readyok',
      )
    }

    this.elo = target
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

    for (const handle of this.activeSearches) handle.abort?.()
    this.activeSearches.clear()

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

    // Detach the listeners first so no stale partial evaluation reaches the UI,
    // then abort the running searches so their promises settle instead of
    // hanging forever (important for `go infinite` searches).
    for (const worker of this.workers) {
      worker.listen = () => {}
    }

    for (const handle of this.activeSearches) handle.abort?.()
    this.activeSearches.clear()

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

    const handle: CommandHandle = {}
    this.activeSearches.add(handle)

    try {
      return await sendCommandsToWorker(
        worker,
        commands,
        finalMessage,
        onNewMessage,
        handle,
      )
    } finally {
      this.activeSearches.delete(handle)
      this.releaseWorker(worker)
    }
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
    const worker = await getEngineWorker(this.enginePath)

    await sendCommandsToWorker(worker, ['uci'], 'uciok')
    await sendCommandsToWorker(
      worker,
      [`setoption name MultiPV value ${this.multiPv}`, 'isready'],
      'readyok',
    )
    await this.customEngineInit?.(worker)
    await sendCommandsToWorker(worker, ['ucinewgame', 'isready'], 'readyok')

    this.workers.push(worker)
    this.releaseWorker(worker)
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
    const { fen, depth = 16, multiPv = this.multiPv, hash, threads, infinite = false, setPartialEval } = params

    this.throwErrorIfNotReady()

    await this.stopAllCurrentJobs()
    await this.setMultiPv(multiPv)
    if (hash !== undefined) await this.setHash(hash)
    if (threads !== undefined) await this.setThreads(threads)

    let lastUpdate = 0
    // Infinite searches run for minutes and re-report the same lines over and
    // over; throttle harder so parsing the accumulated output stays cheap.
    const THROTTLE_MS = infinite ? 250 : 60

    const onNewMessage = (messages: string[]) => {
      if (!setPartialEval) return

      const now = performance.now()
      if (now < lastUpdate + THROTTLE_MS) return
      lastUpdate = now

      const parsedResults = parseEvaluationResults(messages, fen)
      setPartialEval(parsedResults)
    }

    const results = await this.sendCommands(
      [`position fen ${fen}`, infinite ? 'go infinite' : `go depth ${depth}`],
      'bestmove',
      onNewMessage,
    )

    return parseEvaluationResults(results, fen)
  }

  async getEngineNextMove(fen: string, elo: number, depth = 16, movetimeMs = 2500): Promise<string | undefined> {
    this.throwErrorIfNotReady()

    await this.stopAllCurrentJobs()
    await this.setElo(elo)

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth} movetime ${movetimeMs}`],
      'bestmove',
    )

    const moveResult = results.find((result) => result.startsWith('bestmove'))
    const move = getResultProperty(moveResult ?? '', 'bestmove')
    if (!move) {
      throw new Error('No move found')
    }

    return move === '(none)' ? undefined : move
  }
}
