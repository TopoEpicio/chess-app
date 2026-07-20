import type { Puzzle, PuzzleCategory, CategoryStats, RepertoireNode, Opening, DailyStats, StudyFolder, StudyResource, FolderContents, BreadcrumbItem, ResourceType } from '../types'

export interface RepertoireApi {
  getTree(id: number): Promise<RepertoireNode[]>
  createNode(data: unknown): Promise<RepertoireNode>
  updateNode(id: string | number, data: unknown): Promise<void>
  deleteNode(id: string | number): Promise<void>
}

export interface PuzzlesApi {
  list(params?: {
    theme?: string; difficulty?: number; phase?: string
    category?: string; subcategory?: string
  }): Promise<Puzzle[]>
  categoryStats(): Promise<Record<string, CategoryStats>>
  get(id: number): Promise<Puzzle>
  create(data: unknown): Promise<Puzzle>
  delete(id: number): Promise<void>
  generateFromGame(gameId: number): Promise<Puzzle[]>
  submitAttempt(data: {
    puzzle_id: number; user_id: number; correct: boolean; time_ms?: number
  }): Promise<unknown>
}

export interface AnalysisFilters {
  year?: string
  white?: string
  black?: string
  result?: string
  eco?: string
  opening?: string
}

export interface AnalysisApi {
  list(userId?: number, filters?: AnalysisFilters): Promise<unknown[]>
  get(id: number): Promise<unknown>
  getMoves(id: number): Promise<unknown[]>
  getMoments(id: number): Promise<unknown[]>
  delete(id: number): Promise<void>
  importPgn(pgnText: string, userId?: number): Promise<unknown>
}

export interface OpeningsApi {
  list(): Promise<Opening[]>
  create(data: unknown): Promise<Opening>
  update(id: string | number, data: unknown): Promise<Opening>
  delete(id: string | number): Promise<void>
}

export interface StatsApi {
  get(userId?: number): Promise<DailyStats | null>
}

export interface BulkBlock {
  index: number
  type: 'puzzle' | 'game' | 'unknown'
  name: string
  preview: string
}

export interface BulkPreviewResponse {
  blocks: BulkBlock[]
}

export interface BulkImportResponse {
  puzzles: { imported: number; errors: string[] }
  games: { imported: number; errors: string[]; skipped: number }
  total: number
}

export interface ImportBulkApi {
  preview(content: string): Promise<BulkPreviewResponse>
  bulk(content: string, types: Record<string, string>): Promise<BulkImportResponse>
}

export interface StudyApi {
  getRootContents(): Promise<FolderContents>
  getFolderContents(folderId: number): Promise<FolderContents>
  getFolderTree(): Promise<StudyFolder[]>
  createFolder(data: { name: string; parentId?: number | null; description?: string }): Promise<StudyFolder>
  updateFolder(id: number, data: { name?: string; parentId?: number | null; description?: string }): Promise<StudyFolder>
  deleteFolder(id: number): Promise<void>
  getBreadcrumb(folderId: number): Promise<BreadcrumbItem[]>
  createResource(data: { type: ResourceType; name: string; description?: string; url?: string; openingId?: number }): Promise<StudyResource>
  updateResource(id: number, data: { name?: string; description?: string; url?: string }): Promise<StudyResource>
  deleteResource(id: number): Promise<void>
  uploadResource(file: File, name?: string): Promise<StudyResource>
  getDownloadUrl(resourceId: number): string
  addToFolder(folderId: number, resourceId: number): Promise<void>
  removeFromFolder(folderId: number, resourceId: number): Promise<void>
  reorderResources(folderId: number, resourceIds: number[]): Promise<void>
}

export interface RecalApi {
  get(userId?: number, limit?: number): Promise<unknown[]>
  getById(id: number): Promise<unknown>
  delete(id: number): Promise<void>
  exportJson(): Promise<unknown>
  exportPgn(): Promise<unknown>
}

export interface NavApi {
  getFolders(): Promise<unknown[]>
  getResources(): Promise<unknown[]>
}

export interface ApiClient {
  health(): Promise<{ status: string }>
  settings(): Promise<unknown>
  repertoire: RepertoireApi
  puzzles: PuzzlesApi
  analysis: AnalysisApi
  openings: OpeningsApi
  stats: StatsApi
  importBulk: ImportBulkApi
  study: StudyApi
  recal: RecalApi
  nav: NavApi
}
