import { Chess } from 'chess.js'
import { fenToKey } from './fenUtils'
import type { TreeState, TreeNode, AddMoveInput, AddMoveResult } from './types'

let nextId = 1
export function resetIdCounter(val = 1) { nextId = val }
export function generateId(): string { return `n${nextId++}` }

export function createTree(rootFen?: string): TreeState {
  const fen = rootFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const rootId = generateId()
  const root: TreeNode = {
    id: rootId,
    move: null,
    fen,
    parentId: null,
    childrenIds: [],
    isMainline: true,
    weight: 5,
  }
  return { rootId, nodes: { [rootId]: root } }
}

export function addMove(tree: TreeState, input: AddMoveInput): AddMoveResult {
  const parent = tree.nodes[input.parentId]
  if (!parent) throw new Error(`Node not found: ${input.parentId}`)

  const game = new Chess(parent.fen)
  const moveResult = game.move(input.san)
  if (!moveResult) throw new Error(`Illegal move: ${input.san} from ${parent.fen}`)

  const childFen = game.fen()
  const existing = parent.childrenIds.find((cid) => {
    const child = tree.nodes[cid]
    return child && fenToKey(child.fen) === fenToKey(childFen)
  })
  if (existing) {
    return { tree, nodeId: existing, created: false }
  }

  const nodeId = generateId()
  const child: TreeNode = {
    id: nodeId,
    move: input.san,
    fen: childFen,
    parentId: input.parentId,
    childrenIds: [],
    isMainline: parent.childrenIds.length === 0,
    weight: parent.childrenIds.length === 0 ? 5 : 3,
  }
  return {
    tree: {
      ...tree,
      nodes: {
        ...tree.nodes,
        [parent.id]: { ...parent, childrenIds: [...parent.childrenIds, nodeId] },
        [nodeId]: child,
      },
    },
    nodeId,
    created: true,
  }
}

export function addMoves(tree: TreeState, parentId: string, moves: string[]): { tree: TreeState; nodeId: string } {
  let current = tree
  let lastId = parentId
  for (const san of moves) {
    const result = addMove(current, { parentId: lastId, san })
    current = result.tree
    lastId = result.nodeId
  }
  return { tree: current, nodeId: lastId }
}

export function deleteSubtree(tree: TreeState, nodeId: string): TreeState {
  if (nodeId === tree.rootId) throw new Error('Cannot delete root node')

  const node = tree.nodes[nodeId]
  if (!node) throw new Error(`Node not found: ${nodeId}`)

  const parent = tree.nodes[node.parentId!]
  if (!parent) throw new Error(`Parent not found: ${node.parentId}`)

  const toRemove = collectDescendants(tree, nodeId)
  const newNodes = { ...tree.nodes }
  for (const id of toRemove) delete newNodes[id]

  newNodes[parent.id] = {
    ...parent,
    childrenIds: parent.childrenIds.filter((cid) => cid !== nodeId),
  }

  if (node.isMainline && newNodes[parent.id].childrenIds.length > 0) {
    newNodes[parent.id].childrenIds[0] = parent.childrenIds[0]
  }

  return { ...tree, nodes: newNodes }
}

export function promoteToMainline(tree: TreeState, nodeId: string): TreeState {
  const node = tree.nodes[nodeId]
  if (!node) throw new Error(`Node not found: ${nodeId}`)
  if (!node.parentId) return tree

  const parent = tree.nodes[node.parentId]
  if (!parent) return tree

  const newNodes = { ...tree.nodes }
  const newChildren = parent.childrenIds.filter((cid) => cid !== nodeId)
  newChildren.unshift(nodeId)

  newNodes[parent.id] = { ...parent, childrenIds: newChildren }
  for (const cid of newChildren) {
    newNodes[cid] = { ...newNodes[cid], isMainline: cid === nodeId }
  }

  return { ...tree, nodes: newNodes }
}

export function pathFromRoot(tree: TreeState, nodeId: string): TreeNode[] {
  const path: TreeNode[] = []
  let current = tree.nodes[nodeId]
  while (current) {
    path.unshift(current)
    if (!current.parentId) break
    current = tree.nodes[current.parentId]
    if (!current) break
  }
  return path
}

export function moveSequence(tree: TreeState, nodeId: string): string[] {
  const path = pathFromRoot(tree, nodeId)
  return path.slice(1).map((n) => n.move || '').filter(Boolean)
}

export function findNodeByFen(tree: TreeState, fen: string): TreeNode | undefined {
  const key = fenToKey(fen)
  return Object.values(tree.nodes).find((n) => fenToKey(n.fen) === key)
}

export function getLegalMoves(tree: TreeState, nodeId: string): string[] {
  const node = tree.nodes[nodeId]
  if (!node) throw new Error(`Node not found: ${nodeId}`)
  const game = new Chess(node.fen)
  return game.moves({ verbose: false })
}

export function getChildren(tree: TreeState, nodeId: string): TreeNode[] {
  const node = tree.nodes[nodeId]
  if (!node) return []
  return node.childrenIds.map((cid) => tree.nodes[cid]).filter(Boolean)
}

export function updateNode(t: TreeState, nodeId: string, patch: Partial<Omit<TreeNode, 'id'>>): TreeState {
  const node = t.nodes[nodeId]
  if (!node) throw new Error(`Node not found: ${nodeId}`)
  return { ...t, nodes: { ...t.nodes, [nodeId]: { ...node, ...patch } } }
}

function collectDescendants(tree: TreeState, nodeId: string): string[] {
  const result: string[] = [nodeId]
  const node = tree.nodes[nodeId]
  if (!node) return result
  for (const cid of node.childrenIds) {
    result.push(...collectDescendants(tree, cid))
  }
  return result
}

export function cloneTree(tree: TreeState, courseId: string): TreeState {
  const idMap: Record<string, string> = {}
  const newNodes: Record<string, TreeNode> = {}

  for (const [oldId, node] of Object.entries(tree.nodes)) {
    const newId = generateId()
    idMap[oldId] = newId
    newNodes[newId] = { ...node, id: newId, parentId: null, childrenIds: [], provenance: { courseId, nodeId: oldId } }
  }

  for (const node of Object.values(tree.nodes)) {
    const newNode = newNodes[idMap[node.id]]
    newNode.parentId = node.parentId ? idMap[node.parentId] : null
    newNode.childrenIds = node.childrenIds.map((cid) => idMap[cid])
  }

  return { rootId: idMap[tree.rootId], nodes: newNodes }
}

export function serialize(tree: TreeState): string {
  return JSON.stringify({ ...tree, _version: 1 })
}

export function deserialize(json: string): TreeState {
  const parsed = JSON.parse(json)
  const { rootId, nodes } = parsed
  return { rootId, nodes }
}

export function getAllMainlineNodes(tree: TreeState): TreeNode[] {
  const result: TreeNode[] = []
  let current = tree.nodes[tree.rootId]
  while (current) {
    result.push(current)
    const mainChildId = current.childrenIds.find((cid) => {
      const child = tree.nodes[cid]
      return child && child.isMainline
    })
    if (!mainChildId) break
    current = tree.nodes[mainChildId]
  }
  return result
}
