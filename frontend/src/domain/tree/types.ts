export interface TreeNode {
  id: string
  move: string | null
  fen: string
  parentId: string | null
  childrenIds: string[]
  isMainline: boolean
  comment?: string
  evaluation?: number
  weight: number
  acceptedMoves?: string[]
  provenance?: { courseId: string; nodeId: string }
}

export interface TreeState {
  rootId: string
  nodes: Record<string, TreeNode>
}

export interface AddMoveInput {
  parentId: string
  san: string
}

export interface AddMoveResult {
  tree: TreeState
  nodeId: string
  created: boolean
}
