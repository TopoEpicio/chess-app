import { describe, it, expect } from 'vitest'
import { getPositionWinPercentage, getLineWinPercentage } from '../winPercentage'
import type { PositionEval, LineEval } from '../../../types/eval'

describe('getLineWinPercentage', () => {
  it('returns 50% for equal position (cp=0)', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: 0 }
    expect(getLineWinPercentage(line)).toBeCloseTo(50, 1)
  })

  it('returns ~59.1% for +100cp advantage (lichess formula)', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: 100 }
    expect(getLineWinPercentage(line)).toBeCloseTo(59.1, 1)
  })

  it('returns ~40.9% for -100cp disadvantage', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: -100 }
    expect(getLineWinPercentage(line)).toBeCloseTo(40.9, 1)
  })

  it('returns 100% for winning mate', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, mate: 3 }
    expect(getLineWinPercentage(line)).toBe(100)
  })

  it('returns 0% for losing mate', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, mate: -3 }
    expect(getLineWinPercentage(line)).toBe(0)
  })

  it('clamps cp to ±1000', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: 5000 }
    expect(getLineWinPercentage(line)).toBeGreaterThan(0)
    expect(getLineWinPercentage(line)).toBeLessThanOrEqual(100)
  })

  it('returns ~97.5% for cp=1000', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: 1000 }
    expect(getLineWinPercentage(line)).toBeCloseTo(97.5, 0)
  })

  it('returns ~2.5% for cp=-1000', () => {
    const line: LineEval = { pv: [], depth: 18, multiPv: 1, cp: -1000 }
    expect(getLineWinPercentage(line)).toBeCloseTo(2.5, 0)
  })
})

describe('getPositionWinPercentage', () => {
  it('uses first line for position', () => {
    const pos: PositionEval = {
      lines: [
        { pv: [], depth: 18, multiPv: 1, cp: 50 },
      ],
    }
    expect(getPositionWinPercentage(pos)).toBeCloseTo(54.6, 0)
  })
})
