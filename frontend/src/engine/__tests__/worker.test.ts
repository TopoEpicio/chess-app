import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getEngineWorker, sendCommandsToWorker, getRecommendedWorkersNb } from '../worker'
import type { EngineWorker } from '../../types/engine'

const makeMockWorker = (): EngineWorker => {
  const worker: EngineWorker = {
    isReady: true,
    uci: (cmd: string) => {
      if (cmd === 'isready') {
        setTimeout(() => worker.listen('readyok'), 0)
      }
      if (cmd.startsWith('go depth')) {
        setTimeout(() => worker.listen('bestmove e2e4'), 10)
      }
      if (cmd === 'uci') {
        setTimeout(() => worker.listen('uciok'), 0)
      }
    },
    listen: () => {},
    terminate: () => {},
  }
  return worker
}

describe('sendCommandsToWorker', () => {
  it('sends commands and resolves on finalMessage', async () => {
    const worker = makeMockWorker()
    const result = await sendCommandsToWorker(worker, ['uci'], 'uciok')
    expect(result.some(r => r.startsWith('uciok'))).toBe(true)
  })

  it('collects all messages', async () => {
    const worker = makeMockWorker()
    const result = await sendCommandsToWorker(worker, ['isready'], 'readyok')
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onNewMessage for each message', async () => {
    const worker = makeMockWorker()
    const messages: string[] = []
    await sendCommandsToWorker(worker, ['isready'], 'readyok', (msgs) => {
      messages.push(...msgs)
    })
    expect(messages.length).toBeGreaterThanOrEqual(1)
  })
})

describe('getRecommendedWorkersNb', () => {
  it('returns a positive number', () => {
    expect(getRecommendedWorkersNb()).toBeGreaterThan(0)
  })
})

describe('getEngineWorker (WASM)', () => {
  let mockOpts: Record<string, unknown>

  beforeEach(() => {
    let readyResolve: () => void
    mockOpts = {}
    const readyPromise = new Promise<void>((resolve) => { readyResolve = resolve })
    mockOpts.postMessage = vi.fn()
    mockOpts.addMessageListener = vi.fn()
    mockOpts.removeMessageListener = vi.fn()
    mockOpts.ready = readyPromise
    mockOpts.terminate = vi.fn()

    ;(globalThis as Record<string, unknown>).window = {
      ...(globalThis as Record<string, unknown>).window as Record<string, unknown>,
      Stockfish: vi.fn((opts?: Record<string, unknown>) => {
        if (opts) {
          Object.assign(opts, mockOpts)
        }
        return readyPromise
      }),
    } as Window & typeof globalThis
  })

  it('factory return value is captured', () => {
    const worker = getEngineWorker('wasm')
    expect(worker).toBeDefined()
    expect(window.Stockfish).toHaveBeenCalledOnce()
  })

  it('uses opts.postMessage', () => {
    const worker = getEngineWorker('wasm')
    const listener = mockOpts.addMessageListener as ReturnType<typeof vi.fn>
    listener.mock.calls[0][0]('uciok')
    worker.uci('test')
    expect(mockOpts.postMessage).toHaveBeenCalledWith('test')
  })

  it('command queue flushed after ready', async () => {
    const worker = getEngineWorker('wasm')
    worker.uci('command1')
    worker.uci('command2')
    expect(mockOpts.postMessage).not.toHaveBeenCalled()
    const listener = mockOpts.addMessageListener as ReturnType<typeof vi.fn>
    listener.mock.calls[0][0]('uciok')
    expect(mockOpts.postMessage).toHaveBeenCalledTimes(2)
    expect(mockOpts.postMessage).toHaveBeenCalledWith('command1')
    expect(mockOpts.postMessage).toHaveBeenCalledWith('command2')
  })

  it('strips Thread prefix from messages', () => {
    const worker = getEngineWorker('wasm')
    const listenSpy = vi.fn()
    worker.listen = listenSpy
    const listener = mockOpts.addMessageListener as ReturnType<typeof vi.fn>
    listener.mock.calls[0][0]('Thread 1: info depth 10')
    expect(listenSpy).toHaveBeenCalledWith('info depth 10')
  })
})
