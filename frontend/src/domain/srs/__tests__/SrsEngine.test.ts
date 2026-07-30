import { describe, it, expect } from 'vitest'
import { createCard, reviewCard } from '../SrsEngine'
import type { CardState } from '../types'

describe('SrsEngine', () => {
  const baseInput = { fenKey: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b', nodeIds: ['n2'], expectedMoves: ['e5'] }

  function makeCard(overrides?: Partial<CardState>): CardState {
    return { ...createCard(baseInput), ...overrides }
  }

  it('creates a fresh card with zero interval', () => {
    const card = createCard(baseInput)
    expect(card.interval).toBe(0)
    expect(card.ease).toBe(2.5)
    expect(card.consecutiveCorrect).toBe(0)
    expect(card.forgets).toBe(0)
    expect(card.totalReviews).toBe(0)
  })

  it('schedules 1 day on first correct', () => {
    const card = makeCard()
    const result = reviewCard(card, 'correct')
    expect(result.state.interval).toBe(1)
    expect(result.state.consecutiveCorrect).toBe(1)
    expect(result.state.ease).toBe(2.65)
  })

  it('schedules 3 days on second consecutive correct', () => {
    const card = makeCard({ consecutiveCorrect: 1, interval: 1 })
    const result = reviewCard(card, 'correct')
    expect(result.state.interval).toBe(3)
    expect(result.state.consecutiveCorrect).toBe(2)
  })

  it('multiplies interval by ease on third+ consecutive correct', () => {
    const card = makeCard({ consecutiveCorrect: 2, interval: 3, ease: 2.5 })
    const result = reviewCard(card, 'correct')
    expect(result.state.interval).toBe(8)
  })

  it('resets interval on incorrect', () => {
    const card = makeCard({ interval: 10, consecutiveCorrect: 5, ease: 2.7 })
    const result = reviewCard(card, 'incorrect')
    expect(result.state.interval).toBe(0)
    expect(result.state.consecutiveCorrect).toBe(0)
    expect(result.state.ease).toBe(2.5)
    expect(result.state.forgets).toBe(1)
  })

  it('resets consecutive on accepted but keeps interval', () => {
    const card = makeCard({ consecutiveCorrect: 3, interval: 10 })
    const result = reviewCard(card, 'accepted')
    expect(result.state.consecutiveCorrect).toBe(0)
    expect(result.state.interval).toBe(10)
  })

  it('applies weight factor to interval', () => {
    const card = makeCard({ consecutiveCorrect: 2, interval: 3, ease: 2.5 })
    const light = reviewCard(card, 'correct', 5)
    const heavy = reviewCard(card, 'correct', 1)
    expect(light.state.interval).toBeLessThan(heavy.state.interval)
    expect(light.state.interval).toBe(5)
    expect(heavy.state.interval).toBe(11)
  })

  it('clamps ease to min/max', () => {
    const lowEase = makeCard({ ease: 1.3 })
    const r1 = reviewCard(lowEase, 'incorrect')
    expect(r1.state.ease).toBe(1.3)

    const highEase = makeCard({ ease: 2.9, consecutiveCorrect: 99 })
    const r2 = reviewCard(highEase, 'correct')
    expect(r2.state.ease).toBe(3.0)
  })

  it('records previous ease in result', () => {
    const card = makeCard({ ease: 2.5 })
    const result = reviewCard(card, 'correct')
    expect(result.previousEase).toBe(2.5)
  })

  it('stores fenKey and nodeIds', () => {
    const card = createCard(baseInput)
    expect(card.fenKey).toBe(baseInput.fenKey)
    expect(card.nodeIds).toEqual(baseInput.nodeIds)
  })
})
