import type { TreeState } from '../tree/types'

export type LessonType = 'theory' | 'guess-move' | 'quiz' | 'model-game'

export interface QuizOption {
  text: string
  correct: boolean
}

export interface TheoryLesson {
  type: 'theory'
  id: string
  title: string
  content: string
}

export interface GuessMoveLesson {
  type: 'guess-move'
  id: string
  title: string
  nodeId: string
  hints?: string[]
}

export interface QuizLesson {
  type: 'quiz'
  id: string
  title: string
  question: string
  options: QuizOption[]
}

export interface ModelGameLesson {
  type: 'model-game'
  id: string
  title: string
  pgn: string
  pausePoints: string[]
}

export type Lesson = TheoryLesson | GuessMoveLesson | QuizLesson | ModelGameLesson

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Module {
  id: string
  title: string
  description?: string
  difficulty: Difficulty
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  side: 'white' | 'black' | 'both'
  eco?: string
  tree: TreeState
  modules: Module[]
}

export interface CourseSummary {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  side: 'white' | 'black' | 'both'
  lessonCount: number
  moduleCount: number
}

export interface CourseProgress {
  courseId: string
  completedLessons: string[]
  currentLessonId?: string
  startedAt: number
  completedAt?: number
}
