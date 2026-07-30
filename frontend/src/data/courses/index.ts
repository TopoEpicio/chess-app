import type { Course, CourseSummary } from '../../domain/course/types'
import italianGame from './italian-game'
import sicilianNajdorf from './sicilian-najdorf'

export const courseRegistry: Record<string, () => Promise<Course>> = {
  'italian-game': () => Promise.resolve(italianGame),
  'sicilian-najdorf': () => Promise.resolve(sicilianNajdorf),
}

const summaries: CourseSummary[] = [
  {
    id: 'italian-game',
    title: 'Italian Game',
    description: 'Master the Italian Game from the basics to advanced lines including the Giuoco Piano, Two Knights Defense, and Evans Gambit',
    difficulty: 'beginner',
    side: 'white',
    lessonCount: italianGame.modules.reduce((s, m) => s + m.lessons.length, 0),
    moduleCount: italianGame.modules.length,
  },
  {
    id: 'sicilian-najdorf',
    title: 'Sicilian Najdorf',
    description: 'Master the Sicilian Najdorf (B90-B99) — one of the sharpest and most respected openings in chess',
    difficulty: 'advanced',
    side: 'black',
    lessonCount: sicilianNajdorf.modules.reduce((s, m) => s + m.lessons.length, 0),
    moduleCount: sicilianNajdorf.modules.length,
  },
]

export const courseSummaries: Record<string, CourseSummary> = Object.fromEntries(
  summaries.map((s) => [s.id, s]),
)

export function getCourse(id: string): Promise<Course> {
  const loader = courseRegistry[id]
  if (!loader) throw new Error(`Course not found: ${id}`)
  return loader()
}

export function listCourses(): CourseSummary[] {
  return summaries
}
