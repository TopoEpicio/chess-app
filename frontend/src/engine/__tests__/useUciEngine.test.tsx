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
