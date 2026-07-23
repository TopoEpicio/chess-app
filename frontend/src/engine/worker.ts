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

  // WASM-based Stockfish via window.Stockfish factory
  if (enginePath.includes('.wasm') || enginePath === 'wasm') {
    const StockfishFactory = window.Stockfish
    if (typeof StockfishFactory !== 'function') {
      throw new Error('window.Stockfish is not available')
    }

    const engine = StockfishFactory({
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

  throw new Error(`Unknown engine path: ${enginePath}. Use .js for Web Worker or .wasm for WASM.`)
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
