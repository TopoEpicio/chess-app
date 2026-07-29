import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UciEngine } from '../UciEngine'
import type { EngineWorker } from '../../types/engine'
import type { EvaluateGameParams } from '../../types/eval'

const { mockSendCommands, mockWorkers } = vi.hoisted(() => {
  const mockWorkers: EngineWorker[] = []
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
  return { mockSendCommands, mockWorkers }
})

vi.mock('../worker', () => {
  const createMockWorker = (): EngineWorker => ({
    isReady: true,
    uci: vi.fn(),
    listen: vi.fn(),
    terminate: vi.fn(),
  })

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

  describe('stopAllCurrentJobs', () => {
    it('resolves without error', async () => {
      await expect(engine.stopAllCurrentJobs()).resolves.toBeUndefined()
    })
  })

  describe('getEngineNextMoveWithEval', () => {
    beforeEach(() => {
      mockSendCommands.mockClear()
    })

    it('returns depth and evaluation from info lines', async () => {
      mockSendCommands.mockResolvedValue([
        'info depth 18 multipv 1 score cp 30 pv e2e4',
        'bestmove e2e4',
      ])
      const info = await engine.getEngineNextMoveWithEval(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      )
      expect(info.bestMove).toBe('e2e4')
      expect(info.evaluation).toBe(0.3)
      expect(info.depth).toBe(18)
      expect(info.mate).toBeNull()
    })

    it('parses mate correctly', async () => {
      mockSendCommands.mockResolvedValue([
        'info depth 10 multipv 1 score mate 3 pv Qh7 Kf8',
        'bestmove Qh7',
      ])
      const info = await engine.getEngineNextMoveWithEval(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      )
      expect(info.mate).toBe(3)
      expect(info.evaluation).toBe(10)
    })

    it('handles (none) bestmove', async () => {
      mockSendCommands.mockResolvedValue([
        'bestmove (none)',
      ])
      const info = await engine.getEngineNextMoveWithEval(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      )
      expect(info.bestMove).toBe('')
    })

    it('sends go movetime with default value', async () => {
      await engine.getEngineNextMoveWithEval(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      )
      const allCalls = mockSendCommands.mock.calls
      const movetimeCall = allCalls.find(([, cmds]) =>
        cmds.includes('go movetime 1500'),
      )
      expect(movetimeCall).toBeDefined()
    })
  })

  describe('setHashAndThreads', () => {
    it('sends hash and threads options', async () => {
      mockSendCommands.mockClear()
      await engine.setHashAndThreads(128, 2)
      const allCalls = mockSendCommands.mock.calls
      const hashCall = allCalls.find(([, cmds]) =>
        cmds.includes('setoption name Hash value 128'),
      )
      const threadsCall = allCalls.find(([, cmds]) =>
        cmds.includes('setoption name Threads value 2'),
      )
      expect(hashCall).toBeDefined()
      expect(threadsCall).toBeDefined()
    })

    it('skips if hash and threads unchanged', async () => {
      mockSendCommands.mockClear()
      await engine.setHashAndThreads(64, 1)
      expect(mockSendCommands).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining(['setoption name Hash value 64']),
        expect.anything(),
      )
    })
  })

  describe('create with custom options', () => {
    it('passes custom hash and threads', async () => {
      mockSendCommands.mockClear()
      const customEngine = await UciEngine.create('test-custom', 'test.js', { hashSize: 128, threads: 2, multiPv: 5 })
      expect(customEngine.name).toBe('test-custom')
      customEngine.shutdown()
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

