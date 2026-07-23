export interface MultiPvLine {
  rank: number
  san: string
  uci: string
  evaluation: number
  mate: number | null
  depth: number
  pv: string[]
}

export interface TacticalPattern {
  type: 'fork' | 'hanging_piece' | 'check' | 'checkmate' | 'double_check'
        | 'king_exposure' | 'promotion_threat'
  severity: 'info' | 'warning' | 'critical'
  description: string
  squares?: string[]
}

export interface Threat {
  moveSan: string
  description: string
}

export interface TopMoveInfo {
  san: string
  evaluation: number
  mate: number | null
  explanation: string
  followUp: string
}

export interface AlternativeInfo {
  san: string
  evaluation: number
  mate: number | null
  whyWorse: string
}

export interface AnalysisExplanation {
  fen: string
  topMove: TopMoveInfo
  alternatives: AlternativeInfo[]
  threats: Threat[]
  tacticalPatterns: TacticalPattern[]
  keyConcepts: string[]
}

// --- TYPES FOR FULL GAME ANALYSIS ---

export type MoveClassification =
  | 'brilliant'
  | 'best'
  | 'excellent'
  | 'good'
  | 'okay'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'miss'
  | 'great'
  | 'forced'
  | 'opening'
  | 'perfect'
  | 'splendid'
  | 'book'

export interface ClassificationMeta {
  symbol: string
  color: string
  label: string
}

export const CLASSIFICATION_META: Record<MoveClassification, ClassificationMeta> = {
  brilliant:  { symbol: '!!', color: '#00e5b0', label: 'Brillante' },
  splendid:   { symbol: '!!', color: '#00e5b0', label: 'Splendido' },
  perfect:    { symbol: '!!', color: '#00bcd4', label: 'Perfetto' },
  best:       { symbol: '',   color: '#4caf50', label: 'Miglior mossa' },
  excellent:  { symbol: '',   color: '#8bc34a', label: 'Eccellente' },
  good:       { symbol: '!',  color: '#cddc39', label: 'Buona' },
  okay:       { symbol: '?',  color: '#ffc107', label: 'Ok' },
  inaccuracy: { symbol: '?!', color: '#ff9800', label: 'Imprecisione' },
  mistake:    { symbol: '?',  color: '#ff5722', label: 'Errore' },
  blunder:    { symbol: '??', color: '#f44336', label: 'Blunder' },
  miss:       { symbol: '☐', color: '#9c27b0', label: 'Occasione persa' },
  great:      { symbol: '!',  color: '#00bcd4', label: 'Grande mossa' },
  forced:     { symbol: '',   color: '#9e9e9e', label: 'Forzata' },
  opening:    { symbol: '',   color: '#607d8b', label: 'Apertura' },
  book:       { symbol: '',   color: '#607d8b', label: 'Teoria' },
}

export interface MoveAnalysisData {
  move_number: number
  is_white: boolean
  san: string
  fen_before: string
  fen_after: string
  played_eval: number
  best_eval: number
  best_move_san: string
  best_move_uci: string
  second_move_uci: string | null
  second_move_eval: number | null
  third_move_uci: string | null
  third_move_eval: number | null
  depth: number
  eval_swing: number
  classification: MoveClassification
  pvs: string[][] | null
  wp_before: number | null
  wp_after: number | null
  wp_best: number | null
  wp_loss: number | null
}

export interface GameAnalysisResult {
  game_id: number
  white_accuracy: number | null
  black_accuracy: number | null
  white_cpl: number | null
  black_cpl: number | null
  white_classification_counts: Record<string, number>
  black_classification_counts: Record<string, number>
  total_classification_counts: Record<string, number>
  moves: MoveAnalysisData[]
  analyzed_at: string | null
  status: string
  current_move: number | null
  total_moves: number | null
}

export interface ArrowConfig {
  showBestMove: boolean
  showSecondBest: boolean
  showThirdBest: boolean
  showThreats: boolean
}

export const DEFAULT_ARROW_CONFIG: ArrowConfig = {
  showBestMove: true,
  showSecondBest: false,
  showThirdBest: false,
  showThreats: false,
}