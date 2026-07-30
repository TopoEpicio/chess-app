import { describe, it, expect } from 'vitest'
import { getCourse, listCourses } from '../index'
import { getAllMainlineNodes } from '../../../domain/tree/TreeEngine'

describe('course registry', () => {
  it('lists available courses', async () => {
    const summaries = listCourses()
    expect(summaries.length).toBeGreaterThanOrEqual(2)
    expect(summaries.find(s => s.id === 'italian-game')).toBeDefined()
    expect(summaries.find(s => s.id === 'sicilian-najdorf')).toBeDefined()
  })

  it('loads Italian Game without errors', async () => {
    const course = await getCourse('italian-game')
    expect(course).toBeDefined()
    expect(course.id).toBe('italian-game')
    expect(course.tree.rootId).toBeTruthy()
    expect(Object.keys(course.tree.nodes).length).toBeGreaterThan(10)

    const mainline = getAllMainlineNodes(course.tree)
    expect(mainline.length).toBeGreaterThan(5)
    const moves = mainline.slice(1).map(n => n.move)
    expect(moves[0]).toBe('e4')
    expect(moves[2]).toBe('Nf3')
  })

  it('loads Sicilian Najdorf without errors', async () => {
    const course = await getCourse('sicilian-najdorf')
    expect(course).toBeDefined()
    expect(course.id).toBe('sicilian-najdorf')
    expect(course.difficulty).toBe('advanced')
    const nodes = Object.values(course.tree.nodes)
    expect(nodes.length).toBeGreaterThan(10)

    const e4 = nodes.find(n => n.move === 'e4')
    expect(e4).toBeDefined()

    const c5 = nodes.find(n => n.move === 'c5')
    expect(c5).toBeDefined()

    const a6 = nodes.find(n => n.move === 'a6')
    expect(a6).toBeDefined()
  })

  it('course modules reference valid nodeIds', async () => {
    const course = await getCourse('italian-game')
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.type === 'guess-move') {
          expect(course.tree.nodes[lesson.nodeId]).toBeDefined()
        }
      }
    }
  })
})
