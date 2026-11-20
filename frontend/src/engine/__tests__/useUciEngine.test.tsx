import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { UciEngine } from '../UciEngine'
import type { MultiPvLine } from '../../types/analysis'

const mockCreate = vi.fn()

vi.mock('../UciEngine', () => ({
  UciEngine: { create: mockCreate },
}))

function createMockEngine(): Partial<UciEngine> {
  return {
    getIsReady: vi.fn().mockReturnValue(true),
    evaluatePositionWithUpdate: vi.fn().mockResolvedValue({
      lines: [{ pv: ['e2e4'], depth: 18, multiPv: 1, cp: 30 }],
      bestMove: 'e2e4',
    }),
    getEngineNextMove: vi.fn().mockResolvedValue('e2e4'),
    stopAllCurrentJobs: vi.fn().mockResolvedValue(undefined),
    shutdown: vi.fn(),
  }
}

describe('useUciEngine', () => {
  let mockEngine: ReturnType<typeof createMockEngine>

  beforeEach(async () => {
    vi.clearAllMocks()
    mockEngine = createMockEngine()
    mockCreate.mockResolvedValue(mockEngine)
    const { __resetSingletonForTest } = await import('../useUciEngine')
    __resetSingletonForTest()
  })

  it('starts with ready=false and transitions to ready=true after init', async () => {
    const { useUciEngine } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.evalInfo).toBeNull()

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })
  })

  it('deepAnalyze returns converted MultiPvLine[]', async () => {
    const { useUciEngine } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const lines = await result.current.deepAnalyze(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      3,
    )

    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({
      rank: 1,
      san: 'e4',
      uci: 'e2e4',
      evaluation: 0.3,
      depth: 18,
    })
  })

  it('defaults MultiPV, depth, Hash and Threads to the engine configuration', async () => {
    const { useUciEngine } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    await result.current.deepAnalyze(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    )

    expect(mockEngine.evaluatePositionWithUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ multiPv: 3, depth: 16, hash: 16, threads: 1 }),
    )
  })

  it('analyzeLive runs an infinite search and streams only from the base depth', async () => {
    const { useUciEngine, BASE_DEPTH } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    let captured: Parameters<UciEngine['evaluatePositionWithUpdate']>[0] | undefined
    vi.mocked(mockEngine.evaluatePositionWithUpdate!).mockImplementationOnce(
      async (params) => {
        captured = params
        params.setPartialEval?.({
          lines: [{ pv: ['e2e4'], depth: BASE_DEPTH - 4, multiPv: 1, cp: 10 }],
        })
        params.setPartialEval?.({
          lines: [{ pv: ['e2e4'], depth: BASE_DEPTH + 2, multiPv: 1, cp: 10 }],
        })
        return {
          lines: [{ pv: ['e2e4'], depth: BASE_DEPTH + 2, multiPv: 1, cp: 10 }],
          bestMove: 'e2e4',
        }
      },
    )

    const onProgress = vi.fn()
    await result.current.analyzeLive(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      onProgress,
    )

    expect(captured).toMatchObject({
      infinite: true,
      depth: 16,
      multiPv: 3,
      hash: 16,
      threads: 1,
    })
    // The depth-12 update is below the base depth and must not reach the UI.
    expect(onProgress).toHaveBeenCalledTimes(1)
    expect(onProgress.mock.calls[0][1]).toBe(BASE_DEPTH + 2)
  })

  it('bestMove returns EvalInfo from getEngineNextMove', async () => {
    const { useUciEngine } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    )

    expect(info.bestMove).toBe('e2e4')
    expect(mockEngine.getEngineNextMove).toHaveBeenCalledOnce()
  })

  it('sets error when engine creation fails', async () => {
    mockCreate.mockRejectedValue(new Error('Engine crashed'))
    const { useUciEngine } = await import('../useUciEngine')
    const { result } = renderHook(() => useUciEngine())

    await waitFor(() => {
      expect(result.current.error).toBe('Error: Engine crashed')
    })
    expect(result.current.ready).toBe(false)
  })
})
