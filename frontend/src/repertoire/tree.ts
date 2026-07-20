import type { RepertoireNode } from '../types'

export function normalizeNode(raw: any, parentOverride?: string | null): RepertoireNode {
  return {
    id: String(raw.id),
    repertoireId: String(raw.repertoire_id ?? raw.repertoireId ?? ''),
    parentId: raw.parent_id ? String(raw.parent_id) : parentOverride !== undefined ? parentOverride : null,
    fen: raw.fen ?? '',
    moveSan: raw.move_san ?? raw.moveSan ?? '',
    annotation: raw.annotation ?? '',
    colorCode: raw.color_code ?? raw.colorCode ?? 'green',
    depth: raw.depth ?? 0,
    ecoCode: raw.eco_code ?? raw.ecoCode ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? '',
  }
}

export function buildPathToNode(nodes: RepertoireNode[], nodeId: string | null): RepertoireNode[] {
  if (!nodeId) return []
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const path: RepertoireNode[] = []
  let current = nodeMap.get(nodeId)
  while (current) {
    path.unshift(current)
    current = current.parentId ? nodeMap.get(current.parentId) : undefined
  }
  return path
}

export function getDescendantIds(nodes: RepertoireNode[], rootId: string): string[] {
  const ids = new Set<string>()
  function collect(id: string) {
    if (ids.has(id)) return
    ids.add(id)
    nodes.filter(n => n.parentId === id).forEach(n => collect(n.id))
  }
  collect(rootId)
  return Array.from(ids)
}

export function filterTree(nodes: RepertoireNode[], search: string): RepertoireNode[] {
  if (!search.trim()) return nodes
  const q = search.toLowerCase().trim()
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const keep = new Set<string>()
  for (const n of nodes) {
    if (
      n.moveSan.toLowerCase().includes(q) ||
      n.annotation.toLowerCase().includes(q) ||
      (n.ecoCode && n.ecoCode.toLowerCase().includes(q))
    ) {
      let cur: RepertoireNode | undefined = n
      while (cur) {
        keep.add(cur.id)
        cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
      }
    }
  }
  return nodes.filter(n => keep.has(n.id))
}

export function buildTree(nodes: RepertoireNode[]): RepertoireNode[] {
  const nodeMap = new Map<string, RepertoireNode>()
  nodes.forEach(n => nodeMap.set(n.id, { ...n, children: [] }))
  const roots: RepertoireNode[] = []
  nodes.forEach(n => {
    const node = nodeMap.get(n.id)!
    if (n.parentId && nodeMap.has(n.parentId)) {
      const parent = nodeMap.get(n.parentId)!
      if (!parent.children) parent.children = []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

export function getChildren(nodes: RepertoireNode[], parentId: string | null): RepertoireNode[] {
  return nodes.filter(n => n.parentId === parentId)
}
