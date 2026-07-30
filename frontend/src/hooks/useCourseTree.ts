import { useState, useCallback, useMemo, useEffect } from 'react'
import type { TreeState, TreeNode } from '../domain/tree/types'
import {
  addMove,
  pathFromRoot,
  moveSequence,
  getChildren,
  getLegalMoves as getLegal,
} from '../domain/tree/TreeEngine'

export interface CourseTreeState {
  currentNodeId: string
  currentFen: string
  path: TreeNode[]
  moveHistory: string[]
  children: TreeNode[]
  legalMoves: string[]
  canGoBack: boolean
}

function safePath(tree: TreeState, nodeId: string): TreeNode[] {
  if (!tree.nodes[nodeId]) return []
  try { return pathFromRoot(tree, nodeId) } catch { return [] }
}

function safeMoveSeq(tree: TreeState, nodeId: string): string[] {
  if (!tree.nodes[nodeId]) return []
  try { return moveSequence(tree, nodeId) } catch { return [] }
}

function safeGetChildren(tree: TreeState, nodeId: string): TreeNode[] {
  if (!tree.nodes[nodeId]) return []
  try { return getChildren(tree, nodeId) } catch { return [] }
}

function safeGetLegal(tree: TreeState, nodeId: string): string[] {
  if (!tree.nodes[nodeId]) return []
  try { return getLegal(tree, nodeId) } catch { return [] }
}

export function useCourseTree(initialTree: TreeState, initialNodeId?: string) {
  const [tree, setTree] = useState<TreeState>(initialTree)
  const [currentNodeId, setCurrentNodeId] = useState(
    () => initialNodeId && tree.nodes[initialNodeId] ? initialNodeId : tree.rootId,
  )

  useEffect(() => {
    setTree(initialTree)
    setCurrentNodeId(
      (initialNodeId && initialTree.nodes[initialNodeId])
        ? initialNodeId
        : initialTree.rootId,
    )
  }, [initialTree, initialNodeId])

  const state: CourseTreeState = useMemo(() => {
    const root = tree.nodes[tree.rootId]
    const node = tree.nodes[currentNodeId]
    return {
      currentNodeId,
      currentFen: node?.fen || root?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      path: safePath(tree, currentNodeId),
      moveHistory: safeMoveSeq(tree, currentNodeId),
      children: safeGetChildren(tree, currentNodeId),
      legalMoves: safeGetLegal(tree, currentNodeId),
      canGoBack: !!(node?.parentId && tree.nodes[node.parentId]),
    }
  }, [tree, currentNodeId])

  const navigateForward = useCallback((san: string) => {
    const existingChild = tree.nodes[currentNodeId]?.childrenIds
      .map((cid) => tree.nodes[cid])
      .find((c) => c?.move === san)

    if (existingChild) {
      setCurrentNodeId(existingChild.id)
      return existingChild.id
    }

    try {
      const result = addMove(tree, { parentId: currentNodeId, san })
      setTree(result.tree)
      setCurrentNodeId(result.nodeId)
      return result.nodeId
    } catch {
      return null
    }
  }, [tree, currentNodeId])

  const navigateBack = useCallback(() => {
    const node = tree.nodes[currentNodeId]
    if (node?.parentId && tree.nodes[node.parentId]) {
      setCurrentNodeId(node.parentId)
    }
  }, [tree, currentNodeId])

  const navigateToNode = useCallback((nodeId: string) => {
    if (tree.nodes[nodeId]) {
      setCurrentNodeId(nodeId)
    }
  }, [tree])

  const resetToRoot = useCallback(() => {
    if (tree.nodes[tree.rootId]) {
      setCurrentNodeId(tree.rootId)
    }
  }, [tree])

  const applyMoveSequence = useCallback((moves: string[]) => {
    let currentId = tree.rootId
    if (!tree.nodes[currentId]) return
    for (const san of moves) {
      const child = tree.nodes[currentId]?.childrenIds
        .map((cid) => tree.nodes[cid])
        .find((c) => c?.move === san)
      if (child) {
        currentId = child.id
      } else {
        break
      }
    }
    setCurrentNodeId(currentId)
  }, [tree])

  const refreshTree = useCallback((newTree: TreeState) => {
    setTree(newTree)
    if (!newTree.nodes[currentNodeId]) {
      setCurrentNodeId(newTree.rootId)
    }
  }, [currentNodeId])

  return {
    tree,
    state,
    navigateForward,
    navigateBack,
    navigateToNode,
    resetToRoot,
    applyMoveSequence,
    refreshTree,
  }
}
