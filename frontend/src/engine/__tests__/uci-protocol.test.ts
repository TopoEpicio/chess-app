import { describe, it, expect } from 'vitest'
import { parseScoreLine, parseBestMoveLine, evalInfoFromScore, buildPositionCommand } from '../uci-protocol.ts'

describe('parseScoreLine', () => {
  it('parses cp score from info line', () => {
    const result = parseScoreLine('info depth 22 seldepth 30 multipv 1 score cp 54 nodes 12345 pv e2e4 e7e5')
    expect(result).not.toBeNull()
    expect(result!.multipv).toBe(1)
    expect(result!.evaluation).toBe(0.54)
    expect(result!.mate).toBeNull()
    expect(result!.depth).toBe(22)
    expect(result!.pv).toEqual(['e2e4', 'e7e5'])
  })

  it('parses mate score', () => {
    const result = parseScoreLine('info depth 10 score mate 3 pv e1g1 h8g8')
    expect(result).not.toBeNull()
    expect(result!.mate).toBe(3)
    expect(result!.evaluation).toBe(0)
  })

  it('parses negative cp', () => {
    const result = parseScoreLine('info depth 18 score cp -120 pv d2d4')
    expect(result).not.toBeNull()
    expect(result!.evaluation).toBe(-1.20)
  })

  it('parses multipv lines', () => {
    const line2 = parseScoreLine('info depth 22 multipv 2 score cp 30 pv g1f3')
    expect(line2!.multipv).toBe(2)
    expect(line2!.evaluation).toBe(0.30)
  })

  it('returns null for non-score lines', () => {
    expect(parseScoreLine('bestmove e2e4')).toBeNull()
    expect(parseScoreLine('uciok')).toBeNull()
    expect(parseScoreLine('readyok')).toBeNull()
  })

  it('handles line without pv', () => {
    const result = parseScoreLine('info depth 15 score cp 42')
    expect(result).not.toBeNull()
    expect(result!.pv).toEqual([])
  })
})

describe('parseBestMoveLine', () => {
  it('extracts bestmove UCI', () => {
    expect(parseBestMoveLine('bestmove e2e4')).toBe('e2e4')
  })

  it('returns null for (none)', () => {
    expect(parseBestMoveLine('bestmove (none)')).toBeNull()
  })

  it('returns null for non-bestmove lines', () => {
    expect(parseBestMoveLine('info depth 10')).toBeNull()
  })
})

describe('evalInfoFromScore', () => {
  it('builds EvalInfo from cp score for white', () => {
    const score = { multipv: 1, mate: null, evaluation: 0.54, depth: 22, pv: ['e2e4'] }
    const info = evalInfoFromScore(score, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(info.evaluation).toBe(0.54)
    expect(info.mate).toBeNull()
    expect(info.depth).toBe(22)
  })

  it('flips eval for black side', () => {
    const score = { multipv: 1, mate: null, evaluation: 0.54, depth: 18, pv: [] }
    const info = evalInfoFromScore(score, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
    expect(info.evaluation).toBe(-0.54)
  })
})

describe('buildPositionCommand', () => {
  it('returns startpos for start fen', () => {
    expect(buildPositionCommand('start')).toBe('position startpos')
  })

  it('returns fen command for standard fen', () => {
    expect(buildPositionCommand('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
      .toBe('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  })
})
