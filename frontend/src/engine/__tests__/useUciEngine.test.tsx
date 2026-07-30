import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { UciEngineProvider, useUciEngine } from '../useUciEngine'
import type { UciEngine } from '../UciEngine'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('../UciEngine', () => ({
  UciEngine: { create: mockCreate },
}))

vi.mock('../../stores/engineStore', () => ({
  useEngineConfig: () => ({ hash: 16, threads: 1, multiPv: 3 }),
}))

function createMockEngine(): Partial<UciEngine> {
  return {
    getIsReady: vi.fn().mockReturnValue(true),
    evaluatePositionWithUpdate: vi.fn().mockResolvedValue({
      lines: [{ pv: ['e2e4'], depth: 18, multiPv: 1, cp: 30 }],
      bestMove: 'e2e4',
    }),
    getEngineNextMoveWithEval: vi.fn().mockResolvedValue({
      bestMove: 'e2e4',
      evaluation: 0.3,
      mate: null,
      depth: 18,
    }),
    stopAllCurrentJobs: vi.fn().mockResolvedValue(undefined),
    shutdown: vi.fn(),
  }
}

describe('useUciEngine', () => {
  let mockEngine: ReturnType<typeof createMockEngine>

  beforeEach(() => {
    vi.resetAllMocks()
    mockEngine = createMockEngine()
    mockCreate.mockResolvedValue(mockEngine)
  })

  it('starts with ready=false and transitions to ready=true after init', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.evalInfo).toBeNull()

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })
  })

  it('deepAnalyze returns converted MultiPvLine[]', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

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

  it('bestMove returns EvalInfo from getEngineNextMove at default ELO', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    )

    expect(info.bestMove).toBe('e2e4')
    expect(mockEngine.getEngineNextMoveWithEval).toHaveBeenCalledOnce()
  })

  it('bestMove returns real depth', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(1)
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    )

    expect(info.depth).toBe(18)
    vi.mocked(Math.random).mockRestore()
  })

  it('bestMove returns real evaluation', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(1)
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    )

    expect(info.evaluation).toBe(0.3)
    vi.mocked(Math.random).mockRestore()
  })

  it('bestMove calls engine with correct movetime for given ELO', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(1)
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      1500,
    )

    expect(mockEngine.getEngineNextMoveWithEval).toHaveBeenCalledWith(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      1125,
    )
    vi.mocked(Math.random).mockRestore()
  })

  it('returns random move at low ELO when Math.random is low', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      200,
    )

    expect(mockEngine.getEngineNextMoveWithEval).not.toHaveBeenCalled()
    expect(info.bestMove).toBeTruthy()
    expect(info.bestMove.length).toBeGreaterThanOrEqual(4)
    vi.mocked(Math.random).mockRestore()
  })

  it('calls engine at low ELO when Math.random is high', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(1)
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      200,
    )

    expect(mockEngine.getEngineNextMoveWithEval).toHaveBeenCalled()
    vi.mocked(Math.random).mockRestore()
  })

  it('bestMove accepts random parameter for deterministic behavior', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    // random=1 means never blunder (always use engine)
    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      200,
      () => 1,
    )

    expect(mockEngine.getEngineNextMoveWithEval).toHaveBeenCalled()
    expect(info.bestMove).toBe('e2e4')
  })

  it('bestMove with random=0 always blunders (skips engine)', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    const info = await result.current.bestMove(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      200,
      () => 0,
    )

    expect(mockEngine.getEngineNextMoveWithEval).not.toHaveBeenCalled()
    expect(info.bestMove).toBeTruthy()
  })

  it('creates exactly one engine', async () => {
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  it('sets error when engine creation fails', async () => {
    mockCreate.mockRejectedValue(new Error('Engine crashed'))
    const { result } = renderHook(() => useUciEngine(), { wrapper: UciEngineProvider })

    await waitFor(() => {
      expect(result.current.error).toBe('Error: Engine crashed')
    })
    expect(result.current.ready).toBe(false)
  })
})
