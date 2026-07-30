import { describe, it, expect } from 'vitest'
import { parsePgn, pgnToTree, pgnToCourseTree } from '../importPgn'
import { getAllMainlineNodes } from '../../../domain/tree/TreeEngine'

const samplePgn = `[Event "Test Game"]
[Site "Online"]
[Date "2024.01.01"]
[Round "1"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {Spanish} 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 1-0`

const samplePgn2 = `[Event "Game 2"]
[White "A"]
[Black "B"]
[Result "0-1"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 0-1`

describe('parsePgn', () => {
  it('parses a single PGN game', () => {
    const games = parsePgn(samplePgn)
    expect(games.length).toBe(1)
    expect(games[0].headers.Event).toBe('Test Game')
    expect(games[0].headers.White).toBe('Player1')
    expect(games[0].moves[0]).toBe('e4')
    expect(games[0].moves[1]).toBe('e5')
    expect(games[0].moves[2]).toBe('Nf3')
    expect(games[0].moves[3]).toBe('Nc6')
  })

  it('parses multiple PGN games', () => {
    const combined = samplePgn + '\n\n' + samplePgn2
    const games = parsePgn(combined)
    expect(games.length).toBe(2)
    expect(games[1].moves[0]).toBe('e4')
    expect(games[1].moves[1]).toBe('c5')
  })

  it('strips result annotation from last move', () => {
    const games = parsePgn(samplePgn)
    const last = games[0].moves[games[0].moves.length - 1]
    expect(last).toBe('O-O')
  })
})

describe('pgnToTree', () => {
  it('builds a tree from PGN', () => {
    const { tree, mainlineEndId } = pgnToTree(samplePgn)
    expect(tree.rootId).toBeTruthy()
    expect(mainlineEndId).toBeTruthy()
    const mainline = getAllMainlineNodes(tree)
    expect(mainline.length).toBeGreaterThan(1)
    const moves = mainline.slice(1).map(n => n.move)
    expect(moves[0]).toBe('e4')
    expect(moves[2]).toBe('Nf3')
  })
})

describe('pgnToCourseTree', () => {
  it('builds a weighted tree from multiple PGNs', () => {
    const combined = samplePgn + '\n\n' + samplePgn2
    const tree = pgnToCourseTree(combined, (depth, isMainline) => isMainline ? 5 : 3)
    const nodes = Object.values(tree.nodes)
    const e4 = nodes.find(n => n.move === 'e4')
    expect(e4).toBeDefined()
    const c5 = nodes.find(n => n.move === 'c5')
    expect(c5).toBeDefined()
  })
})
