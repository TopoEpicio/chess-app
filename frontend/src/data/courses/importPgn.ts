import { createTree, addMove, updateNode } from '../../domain/tree/TreeEngine'
import type { TreeState } from '../../domain/tree/types'

export interface PgnGame {
  headers: Record<string, string>
  moves: string[]
}

function isSan(token: string): boolean {
  return /^[a-hKQNBR]/.test(token) || token === 'O-O' || token === 'O-O-O'
}

export function parsePgn(pgn: string): PgnGame[] {
  const cleaned = pgn.replace(/\r\n/g, '\n')
  const games: PgnGame[] = []
  const blocks = cleaned.split(/(?=\n\[Event )/).filter(b => b.trim())

  for (const block of blocks) {
    const headers: Record<string, string> = {}
    const headerRegex = /^\[(\w+)\s+"([^"]*)"\]$/gm
    let match
    while ((match = headerRegex.exec(block)) !== null) {
      headers[match[1]] = match[2]
    }

    const moveText = block.replace(/^\[.*\]$/gm, '').replace(/\{.*?\}/g, '').replace(/\n/g, ' ').trim()
    const tokens = moveText.split(/\s+/)
    const moves: string[] = []

    for (const token of tokens) {
      const clean = token.replace(/[+!#?=]/g, '')
      if (/^\d+\./.test(clean)) {
        const parts = clean.split(/\.+/).filter(Boolean)
        const m = parts[parts.length - 1]
        if (m && isSan(m)) moves.push(m)
      } else if (isSan(clean)) {
        if (!/^\d+-\d+$/.test(clean)) moves.push(clean)
      }
    }

    if (moves.length > 0) games.push({ headers, moves })
  }

  return games
}

export function pgnToTree(pgn: string): { tree: TreeState; mainlineEndId: string } {
  const games = parsePgn(pgn)
  if (games.length === 0) throw new Error('No games found in PGN')

  let masterTree = createTree()
  const rootId = masterTree.rootId

  for (const game of games) {
    let currentTree = masterTree
    let parentId = rootId
    for (const san of game.moves) {
      try {
        const result = addMove(currentTree, { parentId, san })
        currentTree = result.tree
        parentId = result.nodeId
      } catch { break }
    }
    masterTree = currentTree
  }

  let lastId = rootId
  const rootMoves = Object.values(masterTree.nodes).filter(n => n.parentId === rootId && n.isMainline)
  if (rootMoves.length > 0) {
    let cur = rootMoves[0]
    lastId = cur.id
    while (cur.childrenIds.length > 0) {
      const mc = cur.childrenIds.find(cid => masterTree.nodes[cid]?.isMainline)
      if (!mc) break
      cur = masterTree.nodes[mc]
      lastId = cur.id
    }
  }

  return { tree: masterTree, mainlineEndId: lastId }
}

export function pgnToCourseTree(pgn: string, weightFn?: (depth: number, isMainline: boolean) => number): TreeState {
  const games = parsePgn(pgn)
  if (games.length === 0) throw new Error('No games found')

  let tree = createTree()
  const allMoves: { nodeId: string; depth: number; isMainline: boolean }[] = []

  for (const game of games) {
    let parentId = tree.rootId
    let depth = 0
    const localIds: string[] = []

    for (const san of game.moves) {
      try {
        const result = addMove(tree, { parentId, san })
        tree = result.tree
        parentId = result.nodeId
        localIds.push(result.nodeId)
        depth++
      } catch { break }
    }

    localIds.forEach((nid, i) => {
      allMoves.push({ nodeId: nid, depth: i, isMainline: i === localIds.indexOf(nid) })
    })
  }

  for (const { nodeId, depth, isMainline } of allMoves) {
    const w = weightFn ? weightFn(depth, isMainline) : isMainline ? 5 : 3
    try { tree = updateNode(tree, nodeId, { weight: w }) } catch { }
  }

  return tree
}
