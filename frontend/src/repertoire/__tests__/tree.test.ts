import { describe, it, expect } from 'vitest'
import {
  normalizeNode,
  buildPathToNode,
  getDescendantIds,
  filterTree,
  buildTree,
  getChildren,
} from '../tree.ts'
import type { RepertoireNode } from '../../types'

const sampleNodes: RepertoireNode[] = [
  { id: '1', repertoireId: '1', parentId: null, fen: 'start', moveSan: '', annotation: '', colorCode: 'green', depth: 0, ecoCode: null, createdAt: '' },
  { id: '2', repertoireId: '1', parentId: '1', fen: 'fen2', moveSan: 'e4', annotation: 'good', colorCode: 'green', depth: 1, ecoCode: 'B00', createdAt: '' },
  { id: '3', repertoireId: '1', parentId: '1', fen: 'fen3', moveSan: 'd4', annotation: '', colorCode: 'yellow', depth: 1, ecoCode: null, createdAt: '' },
  { id: '4', repertoireId: '1', parentId: '2', fen: 'fen4', moveSan: 'e5', annotation: '', colorCode: 'green', depth: 2, ecoCode: null, createdAt: '' },
]

describe('normalizeNode', () => {
  it('handles snake_case API response', () => {
    const raw = { id: 1, repertoire_id: 1, parent_id: null, fen: 'start', move_san: 'e4', annotation: '', color_code: 'green', depth: 0, eco_code: null, created_at: '' }
    const node = normalizeNode(raw)
    expect(node.id).toBe('1')
    expect(node.moveSan).toBe('e4')
    expect(node.colorCode).toBe('green')
    expect(node.ecoCode).toBeNull()
  })

  it('handles camelCase input', () => {
    const raw = { id: '2', repertoireId: '1', parentId: null, fen: 'test', moveSan: 'd4', annotation: '', colorCode: 'yellow', depth: 1, ecoCode: 'D00', createdAt: '' }
    const node = normalizeNode(raw)
    expect(node.moveSan).toBe('d4')
    expect(node.colorCode).toBe('yellow')
  })

  it('applies parentOverride when parent_id is missing', () => {
    const raw = { id: '3', fen: 'test', moveSan: 'Nf3' }
    const node = normalizeNode(raw, 'parent-1')
    expect(node.parentId).toBe('parent-1')
  })

  it('uses parent_id over parentOverride when present', () => {
    const raw = { id: '4', parent_id: 'real-parent', fen: 'test', moveSan: 'Nf3' }
    const node = normalizeNode(raw, 'override')
    expect(node.parentId).toBe('real-parent')
  })

  it('defaults missing fields', () => {
    const raw = { id: '5' }
    const node = normalizeNode(raw)
    expect(node.fen).toBe('')
    expect(node.colorCode).toBe('green')
    expect(node.annotation).toBe('')
    expect(node.ecoCode).toBeNull()
  })
})

describe('buildPathToNode', () => {
  it('builds path from root to given node', () => {
    const path = buildPathToNode(sampleNodes, '4')
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe('1')
    expect(path[1].id).toBe('2')
    expect(path[2].id).toBe('4')
  })

  it('returns empty array for null nodeId', () => {
    expect(buildPathToNode(sampleNodes, null)).toEqual([])
  })

  it('returns single node when it has no parent', () => {
    const path = buildPathToNode(sampleNodes, '1')
    expect(path).toHaveLength(1)
    expect(path[0].id).toBe('1')
  })

  it('returns empty array for unknown nodeId', () => {
    expect(buildPathToNode(sampleNodes, 'unknown')).toEqual([])
  })
})

describe('getDescendantIds', () => {
  it('collects all descendants of a root', () => {
    const ids = getDescendantIds(sampleNodes, '1')
    expect(ids).toEqual(expect.arrayContaining(['2', '3', '4']))
    expect(ids).toHaveLength(4)
  })

  it('returns only node itself for leaf', () => {
    const ids = getDescendantIds(sampleNodes, '4')
    expect(ids).toEqual(['4'])
  })

  it('does not include unrelated nodes', () => {
    const ids = getDescendantIds(sampleNodes, '3')
    expect(ids).toEqual(['3'])
  })
})

describe('filterTree', () => {
  it('returns all nodes for empty search', () => {
    expect(filterTree(sampleNodes, '')).toEqual(sampleNodes)
  })

  it('filters by moveSan including ancestors', () => {
    const result = filterTree(sampleNodes, 'e5')
    expect(result.map(n => n.id).sort()).toEqual(['1', '2', '4'])
  })

  it('filters by annotation', () => {
    const result = filterTree(sampleNodes, 'good')
    expect(result.map(n => n.id).sort()).toEqual(['1', '2'])
  })

  it('filters by ecoCode', () => {
    const result = filterTree(sampleNodes, 'B00')
    expect(result.map(n => n.id).sort()).toEqual(['1', '2'])
  })
})

describe('buildTree', () => {
  it('builds hierarchical tree structure', () => {
    const roots = buildTree(sampleNodes)
    expect(roots).toHaveLength(1)
    expect(roots[0].id).toBe('1')
    expect(roots[0].children).toHaveLength(2)
    const e4Child = roots[0].children!.find(c => c.id === '2')
    expect(e4Child!.children).toHaveLength(1)
    expect(e4Child!.children![0].id).toBe('4')
  })

  it('handles multiple roots', () => {
    const roots = buildTree([
      { id: 'r1', parentId: null } as RepertoireNode,
      { id: 'r2', parentId: null } as RepertoireNode,
    ])
    expect(roots).toHaveLength(2)
  })

  it('ignores broken parent references', () => {
    const roots = buildTree([
      { id: 'a', parentId: null } as RepertoireNode,
      { id: 'b', parentId: 'ghost' } as RepertoireNode,
    ])
    expect(roots).toHaveLength(2)
  })
})

describe('getChildren', () => {
  it('finds direct children', () => {
    expect(getChildren(sampleNodes, '1')).toHaveLength(2)
    expect(getChildren(sampleNodes, '1').map(n => n.id).sort()).toEqual(['2', '3'])
  })

  it('returns empty for leaf', () => {
    expect(getChildren(sampleNodes, '4')).toEqual([])
  })

  it('returns roots for null parentId', () => {
    const roots = getChildren(sampleNodes, null)
    expect(roots).toHaveLength(1)
    expect(roots[0].id).toBe('1')
  })
})
