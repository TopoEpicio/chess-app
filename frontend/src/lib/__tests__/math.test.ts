import { describe, it, expect } from 'vitest'
import { ceilsNumber, getHarmonicMean, getStandardDeviation, getWeightedMean } from '../math'

describe('ceilsNumber', () => {
  it('returns value when within range', () => {
    expect(ceilsNumber(5, 0, 10)).toBe(5)
  })

  it('clamps to min when below', () => {
    expect(ceilsNumber(-5, 0, 10)).toBe(0)
  })

  it('clamps to max when above', () => {
    expect(ceilsNumber(15, 0, 10)).toBe(10)
  })

  it('works with negative ranges', () => {
    expect(ceilsNumber(-10, -5, 5)).toBe(-5)
  })

  it('works at exact boundaries', () => {
    expect(ceilsNumber(0, 0, 10)).toBe(0)
    expect(ceilsNumber(10, 0, 10)).toBe(10)
  })
})

describe('getHarmonicMean', () => {
  it('calculates harmonic mean of positive numbers', () => {
    expect(getHarmonicMean([1, 2, 4])).toBeCloseTo(1.714, 3)
  })

  it('works with equal numbers', () => {
    expect(getHarmonicMean([5, 5, 5])).toBeCloseTo(5, 3)
  })

  it('handles single element', () => {
    expect(getHarmonicMean([10])).toBe(10)
  })

  it('handles two elements', () => {
    expect(getHarmonicMean([2, 8])).toBeCloseTo(3.2, 3)
  })
})

describe('getStandardDeviation', () => {
  it('calculates std dev of uniform array', () => {
    expect(getStandardDeviation([5, 5, 5, 5])).toBe(0)
  })

  it('calculates std dev of [1, 2, 3, 4]', () => {
    const std = getStandardDeviation([1, 2, 3, 4])
    expect(std).toBeCloseTo(1.118, 2)
  })

  it('works with single element', () => {
    expect(getStandardDeviation([10])).toBe(0)
  })

  it('works with larger spread', () => {
    const std = getStandardDeviation([1, 1, 10, 10])
    expect(std).toBeCloseTo(4.5, 1)
  })
})

describe('getWeightedMean', () => {
  it('calculates weighted mean with equal weights', () => {
    expect(getWeightedMean([2, 4, 6], [1, 1, 1])).toBe(4)
  })

  it('gives more weight to larger values', () => {
    expect(getWeightedMean([2, 10], [1, 3])).toBeCloseTo(8, 3)
  })

  it('gives more weight to smaller values', () => {
    expect(getWeightedMean([2, 10], [3, 1])).toBeCloseTo(4, 3)
  })

  it('throws when weights array is shorter', () => {
    expect(() => getWeightedMean([1, 2, 3], [1, 1])).toThrow('Weights array is too short')
  })

  it('allows longer weights array (ignores extra)', () => {
    expect(getWeightedMean([1, 2], [1, 1, 10])).toBe(1.5)
  })
})
