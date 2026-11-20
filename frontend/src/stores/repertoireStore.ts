import { create } from 'zustand'
import type { RepertoireNode } from '../types'
import { api } from '../api/client'

interface RepertoireState {
  nodes: RepertoireNode[]
  selectedNodeId: string | null
  loading: boolean
  setNodes: (nodes: RepertoireNode[]) => void
  selectNode: (id: string | null) => void
  addNode: (node: RepertoireNode) => void
  removeNode: (id: string) => void
  updateNode: (id: string, data: Partial<RepertoireNode>) => void
  loadTree: (repertoireId: number) => Promise<void>
  createNode: (data: Partial<RepertoireNode> & { repertoireId: number }) => Promise<RepertoireNode | null>
  patchNode: (id: string, data: Partial<RepertoireNode>) => Promise<void>
  deleteNode: (id: string) => Promise<void>
}

export const useRepertoireStore = create<RepertoireState>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  loading: false,
  setNodes: (nodes) => set({ nodes }),
  selectNode: (id) => set({ selectedNodeId: id }),
  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
  removeNode: (id) =>
    set((s) => ({ nodes: s.nodes.filter((n) => n.id !== id) })),
  updateNode: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  loadTree: async (repertoireId: number) => {
    set({ loading: true })
    try {
      const data = await api.repertoire.getTree(repertoireId)
      set({ nodes: data ?? [] })
    } catch (e) {
      console.error('Failed to load repertoire:', e)
    } finally {
      set({ loading: false })
    }
  },
  createNode: async (data) => {
    try {
      const node: RepertoireNode = await api.repertoire.createNode(data)
      get().addNode(node)
      return node
    } catch (e) {
      console.error('Failed to create node:', e)
      return null
    }
  },
  patchNode: async (id, data) => {
    try {
      await api.repertoire.updateNode(id, data)
      get().updateNode(id, data)
    } catch (e) {
      console.error('Failed to update node:', e)
    }
  },
  deleteNode: async (id) => {
    try {
      await api.repertoire.deleteNode(id)
      get().removeNode(id)
    } catch (e) {
      console.error('Failed to delete node:', e)
    }
  },
}))
