import { describe, it, expect, beforeAll } from 'vitest'
import { findOpeningByMoves } from './data/openings'
import { writeFileSync } from 'node:fs'

describe('debug: trie SAN matching', () => {
  const cases = [
    ['d4', 'd5', 'c4'],
    ['d4', 'd5', 'c4', 'Nf6'],
    ['d4', 'Nf6', 'g3'],
    ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nbc6'],
    ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nbc6', 'c5'],
  ]

  it('writes results', () => {
    const lines = cases.map((c) => {
      const r = findOpeningByMoves(c)
      return `${c.join(' ')} -> ${r ? `${r.opening.name} / ${r.variation.name} ply ${r.ply}` : 'undefined'}`
    })
    writeFileSync('C:\\Users\\lorenzo.filippi\\Desktop\\chess-app-main-redesign\\frontend\\scripts\\openings-debug.txt', lines.join('\n') + '\n')
    expect(lines.length).toBe(cases.length)
  })
})