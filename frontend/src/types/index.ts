export type ColorCode = 'green' | 'yellow' | 'red'

export type StudyMode = 'quiz' | 'line' | 'deviation'

export type PuzzleTheme =
  | 'fork' | 'pin' | 'skewer' | 'double_attack'
  | 'discovered_attack' | 'checkmate' | 'endgame'
  | 'double_check' | 'exposed_king' | 'hanging_piece'
  | 'kingside_attack' | 'sacrifice' | 'trapped_piece' | 'advanced_pawn'
  | 'rook_endgame' | 'bishop_endgame' | 'pawn_endgame'
  | 'knight_endgame' | 'queen_endgame' | 'queen_rook_endgame'
  | 'mate_in_1' | 'mate_in_2' | 'mate_in_3' | 'mate_in_4' | 'mate_in_5'
  | 'back_rank_mate' | 'smothered_mate' | 'anastasia_mate' | 'arabian_mate'
  | 'boden_mate' | 'opera_mate' | 'hook_mate' | 'vukovic_mate'
  | 'double_bishop_mate' | 'epaulette_mate' | 'corner_mate'

export type PuzzleCategory = 'mix' | 'phases' | 'motifs' | 'mates' | 'mate-themes'

export interface CategoryStats {
  total: number
  subs: Record<string, number>
}

export interface RepertoireNode {
  id: string
  repertoireId: string
  parentId: string | null
  fen: string
  moveSan: string
  annotation: string
  colorCode: ColorCode
  depth: number
  ecoCode: string | null
  createdAt: string
  children?: RepertoireNode[]
}

export type PuzzlePhase = 'opening' | 'middlegame' | 'endgame'

export interface Puzzle {
  id: string
  userId: string
  fen: string
  solution: string[]
  theme: string[]
  difficulty: number
  source: 'error' | 'auto' | 'manual'
  sourceGameId: string | null
  phase: PuzzlePhase
  createdAt: string
}

export interface Opening {
  id: string
  name: string
  side: 'white' | 'black'
  startingFen: string
  startingNodeId: string | null
  ecoCode: string | null
  colorCode: ColorCode
  nodeCount: number
  createdAt: string
}

export type ResourceType = 'opening' | 'pdf' | 'excel' | 'link' | 'youtube'

export interface StudyFolder {
  id: number
  parentId: number | null
  name: string
  description: string
  folderCount: number
  resourceCount: number
  sortOrder: number
  createdAt: string
}

export interface StudyResource {
  id: number
  type: ResourceType
  name: string
  description: string
  url: string | null
  fileName: string | null
  fileSize: number | null
  openingId: number | null
  createdAt: string
}

export interface FolderContents {
  folder: StudyFolder
  folders: StudyFolder[]
  resources: StudyResource[]
}

export interface BreadcrumbItem {
  id: number | null
  name: string
}

export interface DailyStats {
  date: string
  puzzlesSolved: number
  puzzlesCorrect: number
  repertoireReviewed: number
  repertoireAccuracy: number
  gamesAnalyzed: number
  streakDays: number
}
