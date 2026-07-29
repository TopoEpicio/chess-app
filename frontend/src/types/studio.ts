export type CourseSide = 'white' | 'black' | 'both'
export type CourseStyle = 'posizionale' | 'tattico' | 'difensivo' | 'aggressivo'
export type CourseDifficulty = 'facile' | 'media' | 'difficile'

export interface CourseVariation {
  id: string
  name: string
  moves: string[]
  fen: string
}

export interface OpeningCourse {
  id: string
  name: string
  eco: string
  side: CourseSide
  style: CourseStyle
  difficulty: CourseDifficulty
  description: string
  thumbnailId: string
  coachNote: string
  variations: CourseVariation[]
}

export interface OpeningFamily {
  id: string
  name: string
  lines: OpeningCourse[]
}

export interface TrainingProgress {
  completedVariations: string[]
  lastVariationId: string | null
  lastMoveIdx: number
}

export interface FilterState {
  side: CourseSide | 'all'
  style: CourseStyle | 'all'
  difficulty: CourseDifficulty | 'all'
  sort: 'progress' | 'name' | 'eco'
  family: string | 'all'
}

export interface TrainingState {
  courseId: string
  variationIdx: number
  moveIdx: number
  history: string[]
}
