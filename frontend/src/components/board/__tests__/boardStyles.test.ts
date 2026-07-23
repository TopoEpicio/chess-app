import { describe, it, expect } from 'vitest'
import { getSquareStyles, getClassificationIcons } from '../boardStyles'
import type { MoveClassification } from '../../../types/analysis'

describe('getSquareStyles', () => {
  it('returns empty when no classification or lastMoveUci', () => {
    expect(getSquareStyles({})).toEqual({})
  })

  it('highlights last move squares', () => {
    const result = getSquareStyles({ lastMoveUci: 'e2e4' })
    expect(result.e2).toBeDefined()
    expect(result.e4).toBeDefined()
    expect(result.e2!.backgroundColor).toMatch(/rgba/)
    expect(result.e4!.backgroundColor).toMatch(/rgba/)
  })

  it('colors destination square for blunder classification', () => {
    const result = getSquareStyles({ lastMoveUci: 'e2e4', classification: 'blunder' })
    expect(result.e4).toBeDefined()
    expect(result.e4!.backgroundColor).toBeDefined()
  })

  it('includes right-click highlights', () => {
    const rightClickHighlights = { d4: { backgroundColor: 'rgba(255,255,0,0.4)' } }
    const result = getSquareStyles({ rightClickHighlights })
    expect(result.d4).toEqual(rightClickHighlights.d4)
  })

  it('merges lastMoveUci highlight with classification color on same square', () => {
    const result = getSquareStyles({ lastMoveUci: 'e2e4', classification: 'mistake' })
    expect(result.e4).toBeDefined()
  })
})

describe('getClassificationIcons', () => {
  it('returns empty array when no classification', () => {
    expect(getClassificationIcons({})).toEqual([])
  })

  it('returns empty for best classification', () => {
    expect(getClassificationIcons({ classification: 'best', lastMoveUci: 'e2e4' })).toEqual([])
  })

  it('returns !! icon for brilliant', () => {
    const icons = getClassificationIcons({ classification: 'brilliant', lastMoveUci: 'g1f3' })
    expect(icons).toHaveLength(1)
    expect(icons[0].square).toBe('f3')
    expect(icons[0].icon).toBe('!!')
  })

  it('returns ?? icon for blunder', () => {
    const icons = getClassificationIcons({ classification: 'blunder', lastMoveUci: 'e2e4' })
    expect(icons).toHaveLength(1)
    expect(icons[0].icon).toBe('??')
  })

  it('returns ? icon for mistake', () => {
    const icons = getClassificationIcons({ classification: 'mistake', lastMoveUci: 'e2e4' })
    expect(icons[0].icon).toBe('?')
  })

  it('returns ?! for inaccuracy', () => {
    const icons = getClassificationIcons({ classification: 'inaccuracy', lastMoveUci: 'e2e4' })
    expect(icons[0].icon).toBe('?!')
  })

  it('returns ! for good', () => {
    const icons = getClassificationIcons({ classification: 'good', lastMoveUci: 'e2e4' })
    expect(icons[0].icon).toBe('!')
  })

  it('returns empty array when no lastMoveUci', () => {
    expect(getClassificationIcons({ classification: 'blunder' })).toEqual([])
  })

  it('does not include best class icons', () => {
    const icons = getClassificationIcons({
      classification: 'excellent' as MoveClassification,
      lastMoveUci: 'e2e4',
    })
    expect(icons).toEqual([])
  })
})
