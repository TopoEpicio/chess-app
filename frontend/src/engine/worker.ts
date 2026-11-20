import type { EngineWorker } from '../types/engine'

interface StockfishEngine {
  postMessage: (msg: string) => void
  addMessageListener: (listener: (event: string) => void) => void
  removeMessageListener?: (listener: (event: string) => void) => void
  ready?: Promise<unknown>
  terminate?: () => void
}

declare global {
  interface Window {
    Stockfish?: (opts?: {
      locateFile?: (path: string) => string
    }) => StockfishEngine | Promise<StockfishEngine>
  }
}

/**
 * Create an engine worker for the given engine path.
 *
 * - `wasm` / `*.wasm`: the Emscripten **factory** build served from
 *   `/stockfish.js` (it exposes `window.Stockfish`). The factory is asynchronous:
 *   it resolves once the WASM module and its pthread workers are ready.
 * - `*.js`: a classic Web Worker that speaks UCI over `postMessage`.
 *
 * The factory build cannot be loaded with `new Worker('/stockfish.js')`: that
 * script is a module factory, so it never installs a UCI message handler and
 * silently answers nothing.
 */
export const getEngineWorker = async (enginePath: string): Promise<EngineWorker> => {
  if (enginePath === 'wasm' || enginePath.includes('.wasm')) {
    const StockfishFactory = window.Stockfish
    if (typeof StockfishFactory !== 'function') {
      throw new Error(
        'window.Stockfish is not available. Load /stockfish.js before the app bundle.',
      )
    }

    const engine = await StockfishFactory({
      locateFile: (path: string) => `/${path}`,
    })

    const engineWorker: EngineWorker = {
      isReady: false,
      uci: (command: string) => engine.postMessage(command),
      listen: () => {},
      terminate: () => engine.terminate?.(),
    }

    engine.addMessageListener((event: string) => {
      engineWorker.listen(event)
    })

    return engineWorker
  }

  // Native Web Worker (Stockfish.js as Worker)
  if (enginePath.endsWith('.js')) {
    const worker = new window.Worker(enginePath)
    const engineWorker: EngineWorker = {
      isReady: false,
      uci: (command: string) => worker.postMessage(command),
      listen: () => {},
      terminate: () => worker.terminate(),
    }
    worker.onmessage = (event) => {
      engineWorker.listen(event.data)
    }
    return engineWorker
  }

  throw new Error(`Unknown engine path: ${enginePath}. Use 'wasm' for the factory build or .js for a Web Worker.`)
}

/** Allows the caller to abandon an in-flight command early. */
export interface CommandHandle {
  abort?: () => void
}

export const sendCommandsToWorker = (
  worker: EngineWorker,
  commands: string[],
  finalMessage: string,
  onNewMessage?: (messages: string[]) => void,
  handle?: CommandHandle,
): Promise<string[]> => {
  return new Promise((resolve) => {
    const messages: string[] = []
    let settled = false

    const settle = (result: string[]) => {
      if (settled) return
      settled = true
      worker.listen = () => {}
      resolve(result)
    }

    // An infinite (`go infinite`) search only ends through `stop`, which the
    // engine sends when a new position is analysed. Aborting lets that pending
    // promise settle with whatever was parsed so far instead of leaking it.
    if (handle) handle.abort = () => settle(messages.slice())

    worker.listen = (data) => {
      messages.push(data)
      onNewMessage?.(messages)

      if (data.startsWith(finalMessage)) settle(messages)
    }

    for (const command of commands) {
      worker.uci(command)
    }
  })
}

export const getRecommendedWorkersNb = (): number => {
  const maxWorkersNbFromThreads = Math.max(
    1,
    Math.round(navigator.hardwareConcurrency - 4),
    Math.floor((navigator.hardwareConcurrency * 2) / 3),
  )

  const maxWorkersNbFromMemory =
    'deviceMemory' in navigator && typeof navigator.deviceMemory === 'number'
      ? Math.max(1, Math.round(navigator.deviceMemory))
      : 4

  const maxWorkersNbFromDevice = 8

  return Math.min(
    maxWorkersNbFromThreads,
    maxWorkersNbFromMemory,
    maxWorkersNbFromDevice,
  )
}
