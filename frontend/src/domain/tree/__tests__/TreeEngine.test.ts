import { describe, it, expect, beforeEach } from 'vitest'
import { createTree, addMove, addMoves, deleteSubtree, promoteToMainline, pathFromRoot, moveSequence, findNodeByFen, getChildren, updateNode, cloneTree, getAllMainlineNodes, generateId, resetIdCounter } from '../TreeEngine'
import type { TreeState } from '../types'

describe('TreeEngine', () => {
  let tree: TreeState

  beforeEach(() => {
    resetIdCounter()
    tree = createTree()
  })

  it('creates a tree with a root node', () => {
    expect(tree.rootId).toBeTruthy()
    expect(tree.nodes[tree.rootId]).toBeDefined()
    expect(tree.nodes[tree.rootId].move).toBeNull()
    expect(tree.nodes[tree.rootId].fen).toContain('rnbqkbnr')
    expect(tree.nodes[tree.rootId].childrenIds).toEqual([])
  })

  it('adds a move and creates a child node', () => {
    const result = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    expect(result.created).toBe(true)
    expect(result.nodeId).toBeTruthy()

    const child = result.tree.nodes[result.nodeId]
    expect(child).toBeDefined()
    expect(child!.move).toBe('e4')
    expect(child!.parentId).toBe(tree.rootId)
    expect(child!.isMainline).toBe(true)
    expect(child!.weight).toBe(5)
  })

  it('does not duplicate the same move (transposition)', () => {
    const r1 = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const r2 = addMove(r1.tree, { parentId: tree.rootId, san: 'e4' })
    expect(r2.created).toBe(false)
    expect(r2.nodeId).toBe(r1.nodeId)
  })

  it('throws on illegal move', () => {
    expect(() => addMove(tree, { parentId: tree.rootId, san: 'Qh5' })).toThrow()
  })

  it('creates branches from a node', () => {
    const e4 = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const d5 = addMove(e4.tree, { parentId: e4.nodeId, san: 'd5' })
    const e5 = addMove(d5.tree, { parentId: e4.nodeId, san: 'e5' })
    const children = getChildren(e5.tree, e4.nodeId)
    expect(children.length).toBe(2)
    expect(children[0].move).toBe('d5')
    expect(children[0].isMainline).toBe(true)
    expect(children[1].move).toBe('e5')
    expect(children[1].isMainline).toBe(false)
  })

  it('adds a sequence of moves', () => {
    const result = addMoves(tree, tree.rootId, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'])
    const path = pathFromRoot(result.tree, result.nodeId)
    expect(path.length).toBe(6)
    expect(path[5].move).toBe('Bc4')
  })

  it('deletes a subtree', () => {
    const e4 = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const d5 = addMove(e4.tree, { parentId: e4.nodeId, san: 'd5' })
    const deleted = deleteSubtree(d5.tree, e4.nodeId)
    expect(deleted.nodes[e4.nodeId]).toBeUndefined()
    expect(deleted.nodes[tree.rootId].childrenIds.length).toBe(0)
  })

  it('throws when deleting root', () => {
    expect(() => deleteSubtree(tree, tree.rootId)).toThrow()
  })

  it('promotes a branch to main line', () => {
    const e4 = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const d4 = addMove(e4.tree, { parentId: tree.rootId, san: 'd4' })
    const promoted = promoteToMainline(d4.tree, d4.nodeId)
    const children = getChildren(promoted, tree.rootId)
    expect(children[0].move).toBe('d4')
    expect(children[0].isMainline).toBe(true)
  })

  it('finds a node by FEN', () => {
    const before: TreeState = { rootId: tree.rootId, nodes: { ...tree.nodes } }
    const r1 = addMove(before, { parentId: tree.rootId, san: 'e4' })
    const r2 = addMove(r1.tree, { parentId: r1.nodeId, san: 'e5' })
    const r3 = addMove(r2.tree, { parentId: r2.nodeId, san: 'Nf3' })
    const fen = r3.tree.nodes[r3.nodeId].fen
    const found = findNodeByFen(r3.tree, fen)
    expect(found).toBeDefined()
    expect(found!.move).toBe('Nf3')
  })

  it('returns move sequence from root', () => {
    const result = addMoves(tree, tree.rootId, ['e4', 'e5', 'Nf3'])
    const moves = moveSequence(result.tree, result.nodeId)
    expect(moves).toEqual(['e4', 'e5', 'Nf3'])
  })

  it('updates node metadata', () => {
    const result = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const updated = updateNode(result.tree, result.nodeId, { comment: 'Good opening move', weight: 4 })
    expect(updated.nodes[result.nodeId].comment).toBe('Good opening move')
    expect(updated.nodes[result.nodeId].weight).toBe(4)
  })

  it('clones a tree with provenance', () => {
    const result = addMoves(tree, tree.rootId, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'])
    const cloned = cloneTree(result.tree, 'italian-game')
    expect(cloned.rootId).not.toBe(result.tree.rootId)
    expect(Object.keys(cloned.nodes).length).toBe(Object.keys(result.tree.nodes).length)
    for (const node of Object.values(cloned.nodes)) {
      if (node.parentId || node.move) {
        expect(node.provenance?.courseId).toBe('italian-game')
      }
    }
  })

  it('finds main line from root', () => {
    const r1 = addMove(tree, { parentId: tree.rootId, san: 'e4' })
    const r2 = addMove(r1.tree, { parentId: tree.rootId, san: 'd4' })
    const mainline = getAllMainlineNodes(r2.tree)
    expect(mainline.length).toBe(2)
    expect(mainline[0].id).toBe(tree.rootId)
    expect(mainline[1].move).toBe('e4')
  })
})
