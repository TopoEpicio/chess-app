import { describe, it, expect } from 'vitest'
import { sendCommandsToWorker, getRecommendedWorkersNb } from '../worker'
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
