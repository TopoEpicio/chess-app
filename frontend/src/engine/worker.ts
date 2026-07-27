import type { EngineWorker } from '../types/engine'

declare global {
  interface Window {
    Stockfish?: (opts?: { locateFile?: (path: string) => string }) => {
      postMessage: (msg: string) => void
      addMessageListener: (listener: (event: string) => void) => void
      removeMessageListener: (listener: (event: string) => void) => void
      ready?: Promise<void>
      terminate?: () => void
    }
  }
}

export const getEngineWorker = (enginePath: string): EngineWorker => {
  // Native Web Worker path (for non-Stockfish engines)
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
    worker.onerror = (event) => {
      console.error('Worker error:', event.message)
    }
    return engineWorker
  }

  // WASM-based Stockfish via window.Stockfish factory (main thread)
  if (enginePath.includes('.wasm') || enginePath === 'wasm') {
    const StockfishFactory = window.Stockfish
    if (typeof StockfishFactory !== 'function') {
      throw new Error('window.Stockfish is not available. Ensure stockfish.js is loaded via <script> tag.')
    }

    const opts: Record<string, unknown> = {
      locateFile: (path: string) => `/${path}`,
    }

    StockfishFactory(opts)
    const cmdQueue: string[] = []
    let firstOutputReceived = false

    const engineWorker: EngineWorker = {
      isReady: false,
      uci: (command: string) => {
        if (firstOutputReceived) {
          ;(opts.postMessage as (cmd: string) => void)?.(command)
        } else {
          cmdQueue.push(command)
        }
      },
      listen: () => {},
      terminate: () => (opts.terminate as () => void)?.(),
    }

    ;(opts.addMessageListener as (fn: (event: string) => void) => void)?.((
      event: string,
    ) => {
      const cleaned = event.replace(/^Thread \d+: /, '')
      
      if (!firstOutputReceived) {
        firstOutputReceived = true
        for (const cmd of cmdQueue) {
          ;(opts.postMessage as (cmd: string) => void)?.(cmd)
        }
        cmdQueue.length = 0
      }
      
      engineWorker.listen(cleaned)
    })

    return engineWorker
  }

  throw new Error(`Unknown engine path: ${enginePath}. Use .js for Web Worker or 'wasm' for Stockfish.`)
}

export const sendCommandsToWorker = (
  worker: EngineWorker,
  commands: string[],
  finalMessage: string,
  onNewMessage?: (messages: string[]) => void,
): Promise<string[]> => {
  return new Promise((resolve) => {
    const messages: string[] = []

    worker.listen = (data) => {
      messages.push(data)
      onNewMessage?.(messages)

      if (data.startsWith(finalMessage)) {
        worker.listen = () => {}
        resolve(messages)
      }
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