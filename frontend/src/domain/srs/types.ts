export type ReviewQuality = 'correct' | 'incorrect' | 'accepted'

export interface CardState {
  fenKey: string
  nodeIds: string[]
  expectedMoves: string[]
  interval: number
  ease: number
  consecutiveCorrect: number
  forgets: number
  dueDate: number
  totalReviews: number
  totalCorrect: number
}

export interface ReviewInput {
  fenKey: string
  nodeIds: string[]
  expectedMoves: string[]
}

export interface ReviewResult {
  state: CardState
  quality: ReviewQuality
  previousEase: number
}
