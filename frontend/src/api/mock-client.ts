import type { ApiClient } from './interface.ts'
import type { Puzzle, CategoryStats, RepertoireNode, Opening, DailyStats, StudyFolder, StudyResource, FolderContents, BreadcrumbItem } from '../types'

export class MockApiClient implements ApiClient {
  private mockPuzzles: Puzzle[] = []
  private mockRepertoire: RepertoireNode[] = []
  private mockOpenings: Opening[] = []
  private mockStats: DailyStats | null = null

  setPuzzles(puzzles: Puzzle[]) { this.mockPuzzles = puzzles }
  setRepertoire(nodes: RepertoireNode[]) { this.mockRepertoire = nodes }
  setOpenings(openings: Opening[]) { this.mockOpenings = openings }
  setStats(stats: DailyStats | null) { this.mockStats = stats }

  async health(): Promise<{ status: string }> {
    return { status: 'ok' }
  }

  repertoire = {
    getTree: async (id: number) => this.mockRepertoire,
    createNode: async (data: unknown) => data as RepertoireNode,
    updateNode: async (_id: string | number, _data: unknown) => {},
    deleteNode: async (_id: string | number) => {},
  }

  puzzles = {
    list: async (_params?: unknown) => this.mockPuzzles,
    categoryStats: async () => {
      const result: Record<string, CategoryStats> = { mix: { total: this.mockPuzzles.length, subs: {} } }
      return result
    },
    get: async (id: number) => {
      const p = this.mockPuzzles.find(p => Number(p.id) === id)
      if (!p) throw new Error('API error: 404 Not Found')
      return p
    },
    create: async (data: unknown) => data as Puzzle,
    delete: async (_id: number) => {},
    generateFromGame: async (_gameId: number) => [],
    submitAttempt: async (_data: unknown) => ({}),
  }

  analysis = {
    list: async (_userId?: number, _filters?: import('../api/interface.ts').AnalysisFilters) => [],
    get: async (_id: number) => ({}),
    getMoves: async (_id: number) => [],
    getMoments: async (_id: number) => [],
    delete: async (_id: number) => {},
    importPgn: async (_pgnText: string, _userId?: number) => ({}),
  }

  openings = {
    list: async () => this.mockOpenings,
    create: async (data: unknown) => data as Opening,
    update: async (_id: string | number, _data: unknown) => ({} as Opening),
    delete: async (_id: string | number) => {},
  }

  stats = {
    get: async (_userId?: number) => this.mockStats,
  }

  importBulk = {
    preview: async (_content: string) => ({ blocks: [] }),
    bulk: async (_content: string, _types: Record<string, string>) => ({
      puzzles: { imported: 0, errors: [] },
      games: { imported: 0, errors: [] },
      total: 0,
    }),
  }

  study = {
    getRootContents: async () => ({ folder: null as any, folders: [], resources: [] }),
    getFolderContents: async (_folderId: number) => ({ folder: null as any, folders: [], resources: [] }),
    getFolderTree: async () => [],
    createFolder: async (data: any) => data as StudyFolder,
    updateFolder: async (_id: number, _data: any) => ({} as StudyFolder),
    deleteFolder: async (_id: number) => {},
    getBreadcrumb: async (_folderId: number) => [] as BreadcrumbItem[],
    createResource: async (data: any) => data as StudyResource,
    updateResource: async (_id: number, _data: any) => ({} as StudyResource),
    deleteResource: async (_id: number) => {},
    uploadResource: async (_file: File, _name?: string) => ({} as StudyResource),
    getDownloadUrl: (_resourceId: number) => '',
    addToFolder: async (_folderId: number, _resourceId: number) => {},
    removeFromFolder: async (_folderId: number, _resourceId: number) => {},
    reorderResources: async (_folderId: number, _resourceIds: number[]) => {},
  }
}
