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
