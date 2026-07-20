import type { ApiClient, BulkPreviewResponse, BulkImportResponse } from './interface.ts'
import { normalizeStats, normalizeOpening, normalizeStudyResource } from './transformers.ts'
import type { Puzzle, PuzzleCategory, CategoryStats, RepertoireNode, Opening, StudyFolder, StudyResource, FolderContents, BreadcrumbItem } from '../types'

export class FetchApiClient implements ApiClient {
  constructor(private baseUrl: string = 'http://localhost:8003/api') {}

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  health(): Promise<{ status: string }> {
    return this.request('/health')
  }

  repertoire = {
    getTree: (id: number) =>
      this.request<RepertoireNode[]>(`/repertoire/${id}`),
    createNode: (data: unknown) =>
      this.request<RepertoireNode>('/repertoire/', { method: 'POST', body: JSON.stringify(data) }),
    updateNode: (id: string | number, data: unknown) =>
      this.request<void>(`/repertoire/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteNode: (id: string | number) =>
      this.request<void>(`/repertoire/${id}`, { method: 'DELETE' }),
  }

  puzzles = {
    list: (params?: {
      theme?: string; difficulty?: number; phase?: string
      category?: string; subcategory?: string
    }) => {
      const q = new URLSearchParams()
      if (params?.theme) q.set('theme', params.theme)
      if (params?.difficulty) q.set('difficulty', String(params.difficulty))
      if (params?.phase) q.set('phase', params.phase)
      if (params?.category) q.set('category', params.category)
      if (params?.subcategory) q.set('subcategory', params.subcategory)
      const qs = q.toString()
      return this.request<Puzzle[]>(`/puzzles/${qs ? `?${qs}` : ''}`)
    },
    categoryStats: () =>
      this.request<Record<string, CategoryStats>>('/puzzles/stats/categories'),
    get: (id: number) =>
      this.request<Puzzle>(`/puzzles/${id}`),
    create: (data: unknown) =>
      this.request<Puzzle>('/puzzles/', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) =>
      this.request<void>(`/puzzles/${id}`, { method: 'DELETE' }),
    generateFromGame: (gameId: number) =>
      this.request<Puzzle[]>(`/puzzles/generate-from-game/${gameId}`, { method: 'POST' }),
    submitAttempt: (data: { puzzle_id: number; user_id: number; correct: boolean; time_ms?: number }) =>
      this.request('/puzzles/attempt', { method: 'POST', body: JSON.stringify(data) }),
  }

  analysis = {
    list: (userId = 1, filters?: import('../api/interface.ts').AnalysisFilters) => {
      const q = new URLSearchParams({ user_id: String(userId) })
      if (filters) {
        if (filters.year) q.set('year', filters.year)
        if (filters.white) q.set('white', filters.white)
        if (filters.black) q.set('black', filters.black)
        if (filters.result) q.set('result', filters.result)
        if (filters.eco) q.set('eco', filters.eco)
        if (filters.opening) q.set('opening', filters.opening)
      }
      return this.request<unknown[]>(`/analysis/?${q.toString()}`)
    },
    get: (id: number) =>
      this.request<unknown>(`/analysis/${id}`),
    getMoves: (id: number) =>
      this.request<unknown[]>(`/analysis/${id}/moves`),
    getMoments: (id: number) =>
      this.request<unknown[]>(`/analysis/${id}/moments`),
    delete: (id: number) =>
      this.request<void>(`/analysis/${id}`, { method: 'DELETE' }),
    importPgn: async (pgnText: string, userId = 1) => {
      const res = await fetch(`${this.baseUrl}/analysis/import-pgn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pgn_text: pgnText, user_id: userId }),
      })
      if (!res.ok) {
        const detail = await res.text()
        throw new Error(`Failed to import PGN (${res.status}): ${detail}`)
      }
      return res.json()
    },
  }

  openings = {
    list: async () => {
      const raw: unknown[] = await this.request('/openings/')
      return raw.map(normalizeOpening)
    },
    create: async (data: unknown) => {
      const raw = await this.request('/openings/', { method: 'POST', body: JSON.stringify(data) })
      return normalizeOpening(raw)
    },
    update: async (id: string | number, data: unknown) => {
      const raw = await this.request(`/openings/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
      return normalizeOpening(raw)
    },
    delete: (id: string | number) =>
      this.request<void>(`/openings/${id}`, { method: 'DELETE' }),
  }

  stats = {
    get: async (userId = 1) => {
      const raw: unknown[] = await this.request(`/stats/?user_id=${userId}`)
      return raw.length > 0 ? normalizeStats(raw[0]) : null
    },
  }

  importBulk = {
    preview: (content: string) =>
      this.request<BulkPreviewResponse>('/import/preview', {
        method: 'POST', body: JSON.stringify({ content }),
      }),
    bulk: (content: string, types: Record<string, string>) =>
      this.request<BulkImportResponse>('/import/bulk', {
        method: 'POST', body: JSON.stringify({ content, types }),
      }),
  }

  private normalizeFolder(raw: Record<string, unknown>): StudyFolder {
    return {
      id: raw.id as number,
      parentId: (raw.parent_id ?? raw.parentId ?? null) as number | null,
      name: raw.name as string,
      description: (raw.description ?? '') as string,
      folderCount: (raw.folder_count ?? raw.folderCount ?? 0) as number,
      resourceCount: (raw.resource_count ?? raw.resourceCount ?? 0) as number,
      sortOrder: (raw.sort_order ?? raw.sortOrder ?? 0) as number,
      createdAt: (raw.created_at ?? raw.createdAt ?? '') as string,
    }
  }

  private normalizeResources(raw: unknown[]): StudyResource[] {
    return raw.map(r => normalizeStudyResource(r))
  }

  private normalizeContents(raw: Record<string, unknown>): FolderContents {
    const folderRaw = raw.folder as Record<string, unknown> | null
    return {
      folder: folderRaw ? this.normalizeFolder(folderRaw) : folderRaw as unknown as StudyFolder,
      folders: ((raw.folders ?? []) as Record<string, unknown>[]).map(f => this.normalizeFolder(f)),
      resources: this.normalizeResources((raw.resources ?? []) as unknown[]),
    }
  }

  study = {
    getRootContents: async () => {
      const res = await fetch(`${this.baseUrl}/study/root`, { headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      return this.normalizeContents(data as Record<string, unknown>)
    },
    getFolderContents: async (folderId: number) => {
      const res = await fetch(`${this.baseUrl}/study/folders/${folderId}/contents`, { headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      return this.normalizeContents(data as Record<string, unknown>)
    },
    getFolderTree: async () => {
      const raw = await this.request<Record<string, unknown>[]>('/study/folders/tree')
      return raw.map(f => this.normalizeFolder(f))
    },
    createFolder: async (data: { name: string; parentId?: number | null; description?: string }) => {
      const raw = await this.request<Record<string, unknown>>('/study/folders', { method: 'POST', body: JSON.stringify({
        name: data.name,
        parent_id: data.parentId ?? null,
        description: data.description || '',
      }) })
      return this.normalizeFolder(raw)
    },
    updateFolder: async (id: number, data: { name?: string; parentId?: number | null; description?: string }) => {
      const raw = await this.request<Record<string, unknown>>(`/study/folders/${id}`, { method: 'PATCH', body: JSON.stringify({
        name: data.name,
        parent_id: data.parentId,
        description: data.description,
      }) })
      return this.normalizeFolder(raw)
    },
    deleteFolder: async (id: number) =>
      this.request<void>(`/study/folders/${id}`, { method: 'DELETE' }),
    getBreadcrumb: async (folderId: number) =>
      this.request<BreadcrumbItem[]>(`/study/folders/breadcrumb/${folderId}`),
    createResource: async (data: { type: string; name: string; description?: string; url?: string; openingId?: number }) => {
      const raw = await this.request<Record<string, unknown>>('/study/resources', { method: 'POST', body: JSON.stringify({
        type: data.type,
        name: data.name,
        description: data.description || '',
        url: data.url,
        opening_id: data.openingId,
      }) })
      return normalizeStudyResource(raw)
    },
    updateResource: async (id: number, data: { name?: string; description?: string; url?: string }) => {
      const raw = await this.request<Record<string, unknown>>(`/study/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
      return normalizeStudyResource(raw)
    },
    deleteResource: async (id: number) =>
      this.request<void>(`/study/resources/${id}`, { method: 'DELETE' }),
    uploadResource: async (file: File, name?: string) => {
      const formData = new FormData()
      formData.append('file', file)
      if (name) formData.append('name', name)
      const res = await fetch(`${this.baseUrl}/study/resources/upload`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const raw = await res.json() as Record<string, unknown>
      return normalizeStudyResource(raw)
    },
    getDownloadUrl: (resourceId: number) => `${this.baseUrl}/study/resources/${resourceId}/download`,
    addToFolder: async (folderId: number, resourceId: number) =>
      this.request<void>(`/study/folders/${folderId}/resources`, { method: 'POST', body: JSON.stringify({ resource_id: resourceId }) }),
    removeFromFolder: async (folderId: number, resourceId: number) =>
      this.request<void>(`/study/folders/${folderId}/resources/${resourceId}`, { method: 'DELETE' }),
    reorderResources: async (folderId: number, resourceIds: number[]) =>
      this.request<void>(`/study/folders/${folderId}/resources/reorder`, { method: 'PATCH', body: JSON.stringify({ resource_ids: resourceIds }) }),
  }
}
