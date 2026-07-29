import { useState, useEffect, useCallback } from 'react'
import type { TrainingProgress } from '../types/studio'

const STORAGE_KEY = 'opening-progress'

function loadAll(): Record<string, TrainingProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(progress: Record<string, TrainingProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* quota exceeded */ }
}

export function useAllOpeningProgress() {
  const [allProgress, setAllProgress] = useState<Record<string, TrainingProgress>>(loadAll)

  useEffect(() => {
    saveAll(allProgress)
  }, [allProgress])

  const getProgress = useCallback(
    (courseId: string) =>
      allProgress[courseId] ?? { completedVariations: [], lastVariationId: null, lastMoveIdx: 0 },
    [allProgress],
  )

  const markVariationComplete = useCallback((courseId: string, variationId: string) => {
    setAllProgress((prev) => {
      const current = prev[courseId] ?? {
        completedVariations: [] as string[],
        lastVariationId: null as string | null,
        lastMoveIdx: 0,
      }
      if (current.completedVariations.includes(variationId)) return prev
      return {
        ...prev,
        [courseId]: {
          ...current,
          completedVariations: [...current.completedVariations, variationId],
          lastVariationId: variationId,
        },
      }
    })
  }, [])

  const resetCourse = useCallback((courseId: string) => {
    setAllProgress((prev) => {
      const next = { ...prev }
      delete next[courseId]
      return next
    })
  }, [])

  return { allProgress, getProgress, markVariationComplete, resetCourse }
}
