export interface LineEval {
  pv: string[]
  depth: number
  multiPv: number
  cp?: number
  mate?: number
}

export interface PositionEval {
  lines: LineEval[]
  opening?: string
  moveClassification?: string
  bestMove?: string
}

export interface GameEval {
  positions: PositionEval[]
  estimatedElo?: EstimatedElo
  accuracy: Accuracy
  settings: {
    engine: string
    date: string
    depth: number
    multiPv: number
  }
}

export interface EstimatedElo {
  white: number
  black: number
}

export interface Accuracy {
  white: number
  black: number
}

export interface CurrentPosition {
  lastMove?: { from: string; to: string; san: string; color: string }
  currentMoveIdx?: number
  eval?: PositionEval
  lastEval?: PositionEval
  opening?: string
}

export interface SavedEvals {
  [fen: string]: PositionEval & { engine: string }
}

export interface EvaluateGameParams {
  fens: string[]
  uciMoves: string[]
  depth?: number
  multiPv?: number
  setEvaluationProgress?: (progress: number) => void
  playersRatings?: { white?: number; black?: number }
  workersNb?: number
}

export interface EvaluatePositionWithUpdateParams {
  fen: string
  depth?: number
  multiPv?: number
  setPartialEval?: (positionEval: PositionEval) => void
}
