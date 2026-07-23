import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UciEngine } from '../UciEngine'
import type { EngineWorker } from '../../types/engine'
import type { EvaluateGameParams } from '../../types/eval'

vi.mock('../worker', () => {
  const mockWorkers: EngineWorker[] = []

  const createMockWorker = (): EngineWorker => ({
    isReady: true,
    uci: vi.fn(),
    listen: vi.fn(),
    terminate: vi.fn(),
  })

  const mockSendCommands = vi.fn()
  mockSendCommands.mockImplementation(
    (_worker: EngineWorker, _commands: string[], _finalMessage: string, onNewMessage?: (messages: string[]) => void) => {
      if (onNewMessage) {
        onNewMessage(['info depth 1 multipv 1 score cp 50 pv e2e4'])
      }
      return Promise.resolve([
        'info depth 1 multipv 1 score cp 50 pv e2e4',
        'bestmove e2e4',
      ])
    },
  )

  return {
    getEngineWorker: vi.fn(() => {
      const w = createMockWorker()
      mockWorkers.push(w)
      return w
    }),
    sendCommandsToWorker: mockSendCommands,
    getRecommendedWorkersNb: vi.fn(() => 1),
  }
})

describe('UciEngine', () => {
  let engine: UciEngine

  beforeEach(async () => {
    engine = await UciEngine.create('test-engine', 'test.js')
  })

  afterEach(() => {
    engine?.shutdown()
  })

  it('creates engine with given name', () => {
    expect(engine.name).toBe('test-engine')
  })

  it('is ready after creation', () => {
    expect(engine.getIsReady()).toBe(true)
  })

  it('shuts down and is no longer ready', () => {
    engine.shutdown()
    expect(engine.getIsReady()).toBe(false)
  })

  describe('evaluateGame', () => {
    it('evaluates a game with one position', async () => {
      const params: EvaluateGameParams = {
        fens: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
        uciMoves: [],
      }

      const result = await engine.evaluateGame(params)

      expect(result.positions).toHaveLength(1)
      expect(result.positions[0].lines).toBeDefined()
      expect(result.settings.engine).toBe('test-engine')
      expect(result.settings.depth).toBe(16)
      expect(result.settings.multiPv).toBe(3)
    })

    it('accepts custom depth and multiPv', async () => {
      const params: EvaluateGameParams = {
        fens: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
        uciMoves: [],
        depth: 12,
        multiPv: 4,
      }

      const result = await engine.evaluateGame(params)

      expect(result.settings.depth).toBe(12)
      expect(result.settings.multiPv).toBe(4)
    })

    it('handles checkmate position', async () => {
      const params: EvaluateGameParams = {
        fens: ['k7/1QK5/8/8/8/8/8/8 b - - 0 1'],
        uciMoves: [],
      }

      const result = await engine.evaluateGame(params)

      expect(result.positions[0].lines[0].mate).toBeDefined()
    })

    it('calls setEvaluationProgress', async () => {
      const progress = vi.fn()
      const params: EvaluateGameParams = {
        fens: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
        uciMoves: [],
        setEvaluationProgress: progress,
      }

      await engine.evaluateGame(params)

      expect(progress).toHaveBeenCalled()
    })
  })

  describe('evaluatePositionWithUpdate', () => {
    it('evaluates a single position', async () => {
      const result = await engine.evaluatePositionWithUpdate({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      })

      expect(result.lines).toBeDefined()
      expect(result.lines.length).toBeGreaterThanOrEqual(1)
    })

    it('calls setPartialEval with throttled updates', async () => {
      const partialEval = vi.fn()
      await engine.evaluatePositionWithUpdate({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        setPartialEval: partialEval,
      })

      expect(partialEval).toHaveBeenCalled()
    })
  })

  describe('getEngineNextMove', () => {
    it('returns a valid UCI move', async () => {
      const move = await engine.getEngineNextMove(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        1500,
      )

      expect(move).toBe('e2e4')
    })
  })

  describe('stopAllCurrentJobs', () => {
    it('resolves without error', async () => {
      await expect(engine.stopAllCurrentJobs()).resolves.toBeUndefined()
    })
  })

  describe('error states', () => {
    it('throws if engine is not ready', async () => {
      engine.shutdown()
      await expect(
        engine.evaluatePositionWithUpdate({
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        }),
      ).rejects.toThrow('is not ready')
    })
  })
})
