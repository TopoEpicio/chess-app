import { describe, it, expect } from 'vitest'
import { parseEvaluationResults, getResultProperty, sortLines } from '../parseResults'
import type { LineEval } from '../../../types/eval'

describe('getResultProperty', () => {
  it('extracts value after property name', () => {
    expect(getResultProperty('info depth 22 seldepth 30', 'depth')).toBe('22')
  })

  it('returns undefined when property not found', () => {
    expect(getResultProperty('info depth 22', 'multipv')).toBeUndefined()
  })

  it('returns undefined when no value after property', () => {
    expect(getResultProperty('bestmove', 'bestmove')).toBeUndefined()
  })
})

describe('sortLines', () => {
  it('sorts by cp descending', () => {
    const lines: LineEval[] = [
      { pv: [], depth: 18, multiPv: 1, cp: 50 },
      { pv: [], depth: 18, multiPv: 2, cp: 100 },
      { pv: [], depth: 18, multiPv: 3, cp: 0 },
    ]
    const sorted = [...lines].sort(sortLines)
    expect(sorted[0].cp).toBe(100)
    expect(sorted[1].cp).toBe(50)
    expect(sorted[2].cp).toBe(0)
  })

  it('positive mate comes before negative mate', () => {
    const lines: LineEval[] = [
      { pv: [], depth: 18, multiPv: 1, mate: -3 },
      { pv: [], depth: 18, multiPv: 2, mate: 2 },
    ]
    const sorted = [...lines].sort(sortLines)
    expect(sorted[0].mate).toBe(2)
    expect(sorted[1].mate).toBe(-3)
  })

  it('mate lines come before cp lines', () => {
    const lines: LineEval[] = [
      { pv: [], depth: 18, multiPv: 1, cp: 100 },
      { pv: [], depth: 18, multiPv: 2, mate: 3 },
    ]
    const sorted = [...lines].sort(sortLines)
    expect(sorted[0].mate).toBe(3)
    expect(sorted[1].cp).toBe(100)
  })
})

describe('parseEvaluationResults', () => {
  it('parses single MultiPV line with cp', () => {
    const results = [
      'info depth 18 seldepth 30 multipv 1 score cp 54 pv e2e4 e7e5',
      'bestmove e2e4',
    ]
    const parsed = parseEvaluationResults(results, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(parsed.lines).toHaveLength(1)
    expect(parsed.lines[0].cp).toBe(54)
    expect(parsed.lines[0].depth).toBe(18)
    expect(parsed.lines[0].multiPv).toBe(1)
    expect(parsed.lines[0].pv).toEqual(['e2e4', 'e7e5'])
    expect(parsed.bestMove).toBe('e2e4')
  })

  it('parses mate score', () => {
    const results = [
      'info depth 22 seldepth 40 multipv 1 score mate 3 pv Qh7+',
      'bestmove Qh7+',
    ]
    const parsed = parseEvaluationResults(results, '5k2/8/8/8/8/8/8/7K w - - 0 1')
    expect(parsed.lines[0].mate).toBe(3)
    expect(parsed.lines[0].cp).toBeUndefined()
  })

  it('parses multiple MultiPV lines', () => {
    const results = [
      'info depth 18 seldepth 30 multipv 1 score cp 54 pv e2e4 e7e5',
      'info depth 18 seldepth 28 multipv 2 score cp 30 pv d2d4 d7d5',
      'info depth 18 seldepth 26 multipv 3 score cp 20 pv Nf3 Nf6',
      'bestmove e2e4',
    ]
    const parsed = parseEvaluationResults(results, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(parsed.lines).toHaveLength(3)
    expect(parsed.lines[0].multiPv).toBe(1)
    expect(parsed.lines[0].cp).toBe(54)
    expect(parsed.lines[1].cp).toBe(30)
    expect(parsed.lines[2].cp).toBe(20)
  })

  it('keeps deeper depth when same multipv appears multiple times', () => {
    const results = [
      'info depth 10 multipv 1 score cp 40 pv e2e4',
      'info depth 18 multipv 1 score cp 54 pv e2e4',
      'bestmove e2e4',
    ]
    const parsed = parseEvaluationResults(results, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(parsed.lines[0].depth).toBe(18)
    expect(parsed.lines[0].cp).toBe(54)
  })

  it('flips cp for black positions', () => {
    const results = [
      'info depth 18 multipv 1 score cp 54 pv e7e5',
      'bestmove e7e5',
    ]
    const parsed = parseEvaluationResults(results, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
    expect(parsed.lines[0].cp).toBe(-54)
  })

  it('handles bestmove (none)', () => {
    const results = ['bestmove (none)']
    const parsed = parseEvaluationResults(results, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(parsed.bestMove).toBe('(none)')
  })
})
