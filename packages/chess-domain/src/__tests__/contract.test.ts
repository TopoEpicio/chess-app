import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, it, expect } from 'vitest'
import { PatternDetector } from '../patterns.ts'
import { PhaseDetector } from '../phase.ts'
import { PositionEvaluator } from '../eval.ts'

interface TestCase {
  id: string
  fen: string
  expected: {
    themes: string[]
    phase: string
    eval: number
  }
}

const fixtures: TestCase[] = JSON.parse(
  readFileSync(join(__dirname, '..', '..', '..', '..', 'shared-fixtures', 'chess-domain-tests.json'), 'utf-8'),
)

describe('contract tests', () => {
  for (const c of fixtures) {
    it(`${c.id} patterns`, () => {
      expect(PatternDetector.detect(c.fen, '')).toEqual(c.expected.themes)
    })

    it(`${c.id} phase`, () => {
      const moveNumber = parseInt(c.fen.split(' ')[5] || '1', 10)
      expect(PhaseDetector.detect(c.fen, moveNumber)).toBe(c.expected.phase)
    })

    it(`${c.id} eval`, () => {
      expect(PositionEvaluator.evaluate(c.fen)).toBe(c.expected.eval)
    })
  }
})
