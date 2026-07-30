import type { ApiClient } from './interface.ts'
import type { Puzzle, CategoryStats, RepertoireNode, Opening, StudyFolder, StudyResource, FolderContents, BreadcrumbItem, SettingsResponse, DailyStats } from '../types'

export class MockApiClient implements ApiClient {
  private _settings: SettingsResponse = {
    i18n: { default_locale: 'en', supported_locales: ['en', 'it'] },
    theme: { default_theme: 'auto', default_board_theme: 'default' },
    board: { square_opacity: 1.0, piece_shadow: true },
  }
  private _puzzles: Puzzle[] = []
  private _repertoire: RepertoireNode[] = []
  private _openings: Opening[] = []
  private _stats: DailyStats | null = null

  async health(): Promise<{ status: string }> {
    return { status: 'ok' }
  }

  async settings(): Promise<SettingsResponse> {
    return this._settings
  }

  setSettings(s: SettingsResponse) {
    this._settings = s
  }

  setPuzzles(p: Puzzle[]) {
    this._puzzles = p
  }

  setRepertoire(r: RepertoireNode[]) {
    this._repertoire = r
  }

  setOpenings(o: Opening[]) {
    this._openings = o
  }

  setStats(s: DailyStats | null) {
    this._stats = s
  }

  repertoire = {
    getTree: async (id: number): Promise<RepertoireNode[]> => {
      return this._repertoire
    },
    createNode: async (data: unknown): Promise<RepertoireNode> => {
      return data as RepertoireNode
    },
    updateNode: async (id: string | number, data: unknown): Promise<void> => {},
    deleteNode: async (id: string | number): Promise<void> => {},
  }

  puzzles = {
    list: async (): Promise<Puzzle[]> => {
      return this._puzzles
    },
    categoryStats: async (): Promise<Record<string, CategoryStats>> => {
      const byTheme: Record<string, number> = {}
      for (const p of this._puzzles) {
        const themes = Array.isArray(p.theme) ? p.theme : [p.theme]
        for (const t of themes) {
          byTheme[t] = (byTheme[t] || 0) + 1
        }
      }
      return {
        mix: { total: this._puzzles.length, subs: byTheme },
        phases: { total: this._puzzles.length, subs: {} },
        motifs: { total: this._puzzles.length, subs: {} },
        mates: { total: this._puzzles.length, subs: {} },
        'mate-themes': { total: this._puzzles.length, subs: {} },
      }
    },
    get: async (id: number): Promise<Puzzle> => {
      const p = this._puzzles.find(p => p.id === String(id))
      if (!p) throw new Error('404')
      return p
    },
    create: async (data: unknown): Promise<Puzzle> => data as Puzzle,
    delete: async (id: number): Promise<void> => {},
    generateFromGame: async (gameId: number): Promise<Puzzle[]> => [],
    submitAttempt: async () => ({}),
  }

  analysis = {
    list: async () => [],
    get: async () => ({}),
    getMoves: async () => [],
    getMoments: async () => [],
    delete: async () => {},
    importPgn: async () => ({}),
    saveAnalysis: async () => ({ ok: true }),
    getAnalysisResult: async () => ({} as any),
    deleteAnalysisResult: async () => {},
  }

  openings = {
    list: async (): Promise<Opening[]> => {
      return this._openings
    },
    create: async (data: unknown): Promise<Opening> => data as Opening,
    update: async (id: string | number, data: unknown): Promise<Opening> => data as Opening,
    delete: async (id: string | number): Promise<void> => {},
  }

  stats = {
    get: async (userId?: number): Promise<DailyStats | null> => {
      return this._stats
    },
  }

  importBulk = {
    preview: async () => ({ blocks: [] }),
    bulk: async () => ({ puzzles: { imported: 0, errors: [] }, games: { imported: 0, errors: [], skipped: 0 }, total: 0 }),
  }

  study = {
    getRootContents: async (): Promise<FolderContents> => ({
      folder: { id: 0, parentId: null, name: "Root", description: "Root folder", folderCount: 2, resourceCount: 3, sortOrder: 0, createdAt: new Date().toISOString() },
      folders: [
        { id: 1, parentId: 0, name: "Openings", description: "My opening repertoire", folderCount: 1, resourceCount: 2, sortOrder: 1, createdAt: new Date().toISOString() },
        { id: 2, parentId: 0, name: "Endgames", description: "Endgame studies", folderCount: 0, resourceCount: 1, sortOrder: 2, createdAt: new Date().toISOString() },
      ],
      resources: [
        { id: 1, type: "opening" as const, name: "Italian Game", description: "Main line Italian Game", url: null, fileName: null, fileSize: null, openingId: 1, createdAt: new Date().toISOString() },
        { id: 2, type: "youtube" as const, name: "Italian Game Explained", description: "Video lesson on Italian Game", url: "https://youtube.com/watch?v=abc123", fileName: null, fileSize: null, openingId: null, createdAt: new Date().toISOString() },
        { id: 3, type: "pdf" as const, name: "Endgame Theory", description: "Basic endgame principles", url: null, fileName: "endgame_theory.pdf", fileSize: 1024000, openingId: null, createdAt: new Date().toISOString() },
      ],
    }),
    getFolderContents: async (folderId: number): Promise<FolderContents> => {
      if (folderId === 1) {
        return {
          folder: { id: 1, parentId: 0, name: "Openings", description: "My opening repertoire", folderCount: 1, resourceCount: 2, sortOrder: 1, createdAt: new Date().toISOString() },
          folders: [
            { id: 3, parentId: 1, name: "Sicilian", description: "Sicilian Defense variations", folderCount: 0, resourceCount: 1, sortOrder: 1, createdAt: new Date().toISOString() },
          ],
          resources: [
            { id: 4, type: "opening" as const, name: "Sicilian Najdorf", description: "Najdorf variation", url: null, fileName: null, fileSize: null, openingId: 2, createdAt: new Date().toISOString() },
            { id: 5, type: "link" as const, name: "Chess.com Sicilian Guide", description: "Article on Sicilian Defense", url: "https://chess.com/library/view/123", fileName: null, fileSize: null, openingId: null, createdAt: new Date().toISOString() },
          ],
        }
      }
      if (folderId === 2) {
        return {
          folder: { id: 2, parentId: 0, name: "Endgames", description: "Endgame studies", folderCount: 0, resourceCount: 1, sortOrder: 2, createdAt: new Date().toISOString() },
          folders: [],
          resources: [
            { id: 6, type: "pdf" as const, name: "King and Pawn Endings", description: "Basic K&P endings", url: null, fileName: null, fileSize: null, openingId: null, createdAt: new Date().toISOString() },
          ],
        }
      }
      return {
        folder: { id: folderId, parentId: null, name: "Folder " + folderId, description: "", folderCount: 0, resourceCount: 0, sortOrder: 0, createdAt: new Date().toISOString() },
        folders: [],
        resources: [],
      }
    },
    getFolderTree: async (): Promise<StudyFolder[]> => [
      { id: 0, parentId: null, name: "Root", description: "Root", folderCount: 2, resourceCount: 0, sortOrder: 0, createdAt: '' },
      { id: 1, parentId: 0, name: "Openings", description: "", folderCount: 1, resourceCount: 0, sortOrder: 0, createdAt: '' },
      { id: 2, parentId: 0, name: "Endgames", description: "", folderCount: 0, resourceCount: 0, sortOrder: 0, createdAt: '' },
      { id: 3, parentId: 1, name: "Sicilian", description: "", folderCount: 0, resourceCount: 0, sortOrder: 0, createdAt: '' },
    ],
    createFolder: async (data: any): Promise<StudyFolder> => ({ ...data, id: Date.now() % 10000, createdAt: '' } as any),
    updateFolder: async (id: number, data: any): Promise<StudyFolder> => ({ ...data, id } as any),
    deleteFolder: async (id: number): Promise<void> => {},
    getBreadcrumb: async (folderId: number): Promise<BreadcrumbItem[]> => {
      if (folderId === 0) return []
      if (folderId === 1) return [{ id: 0, name: "Root" }, { id: 1, name: "Openings" }]
      if (folderId === 3) return [{ id: 0, name: "Root" }, { id: 1, name: "Openings" }, { id: 3, name: "Sicilian" }]
      return [{ id: 0, name: "Root" }, { id: folderId, name: "Folder " + folderId }]
    },
    createResource: async (data: any): Promise<StudyResource> => ({ ...data, id: Date.now() % 10000, createdAt: '' } as any),
    updateResource: async (id: number, data: any): Promise<StudyResource> => ({ ...data, id } as any),
    deleteResource: async (id: number): Promise<void> => {},
    uploadResource: async (file: File, name?: string): Promise<StudyResource> => ({} as any),
    getDownloadUrl: (resourceId: number): string => `/download/resource/${resourceId}`,
    addToFolder: async (folderId: number, resourceId: number): Promise<void> => {},
    removeFromFolder: async (folderId: number, resourceId: number): Promise<void> => {},
    reorderResources: async (folderId: number, resourceIds: number[]): Promise<void> => {},
  }

  recal = {
    get: async () => [],
    getById: async () => ({}),
    delete: async () => {},
    exportJson: async () => ({}),
    exportPgn: async () => ({}),
  }

  nav = {
    getFolders: async () => [],
    getResources: async () => [],
  }
}
