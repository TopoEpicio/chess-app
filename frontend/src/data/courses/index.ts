import type { Course, CourseSummary } from '../../domain/course/types'
import italianGame from './italian-game'
import sicilianNajdorf from './sicilian-najdorf'
import caroKann from './caro-kann'
import londonSystem from './london-system'
import qgd from './qgd'

export const courseRegistry: Record<string, () => Promise<Course>> = {
  'italian-game': () => Promise.resolve(italianGame),
  'sicilian-najdorf': () => Promise.resolve(sicilianNajdorf),
  'caro-kann': () => Promise.resolve(caroKann),
  'london-system': () => Promise.resolve(londonSystem),
  'qgd': () => Promise.resolve(qgd),
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
  {
    id: 'caro-kann',
    title: 'Caro-Kann Defense',
    description: 'Master the Caro-Kann Defense (B10-B19) — one of the most solid and respected responses to 1.e4',
    difficulty: 'beginner',
    side: 'black',
    lessonCount: caroKann.modules.reduce((s, m) => s + m.lessons.length, 0),
    moduleCount: caroKann.modules.length,
  },
  {
    id: 'london-system',
    title: 'London System',
    description: 'Master the London System — a solid and versatile 1.d4 opening system for White that works against almost any Black setup',
    difficulty: 'beginner',
    side: 'white',
    lessonCount: londonSystem.modules.reduce((s, m) => s + m.lessons.length, 0),
    moduleCount: londonSystem.modules.length,
  },
  {
    id: 'qgd',
    title: "Queen's Gambit Declined",
    description: "Master the Queen's Gambit Declined — Black's most solid response to 1.d4, trusted by world champions for over a century",
    difficulty: 'intermediate',
    side: 'black',
    lessonCount: qgd.modules.reduce((s, m) => s + m.lessons.length, 0),
    moduleCount: qgd.modules.length,
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
