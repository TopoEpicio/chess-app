import { describe, it, expect, vi } from 'vitest'
import { analyzeGameMoves } from '../gameAnalysisService'
import type { MultiPvLine } from '../../types/analysis'

describe('analyzeGameMoves', () => {
  it('classifies a large eval swing as blunder', async () => {
    const moves = [
      { move_number: 1, san: 'g4', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', is_white: true },
    ]

    const beforeLines: MultiPvLine[] = [
      { rank: 1, san: 'e4', uci: 'e2e4', evaluation: 0.3, mate: null, depth: 20, pv: ['e2e4'] },
      { rank: 2, san: 'd4', uci: 'd2d4', evaluation: 0.2, mate: null, depth: 20, pv: ['d2d4'] },
      { rank: 3, san: 'Nf3', uci: 'g1f3', evaluation: 0.1, mate: null, depth: 20, pv: ['g1f3'] },
    ]

    const afterLines: MultiPvLine[] = [
      { rank: 1, san: 'e5', uci: 'e7e5', evaluation: -1.5, mate: null, depth: 20, pv: ['e7e5'] },
    ]

    const deepAnalyzeFn = vi.fn()
    deepAnalyzeFn.mockReturnValueOnce(Promise.resolve(beforeLines))
    deepAnalyzeFn.mockReturnValueOnce(Promise.resolve(afterLines))

    const onProgress = vi.fn()

    const results = await analyzeGameMoves(moves, deepAnalyzeFn, onProgress)

    expect(results).toHaveLength(1)
    expect(results[0].classification).toBe('blunder')
  })
})
