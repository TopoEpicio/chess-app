import { useState, useEffect, useCallback } from 'react'
import type { TrainingProgress } from '../types/studio'

const STORAGE_KEY = 'opening-progress'

function loadAllProgress(): Record<string, TrainingProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAllProgress(progress: Record<string, TrainingProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* quota exceeded */ }
}

export function useOpeningProgress(courseId: string) {
  const [progress, setProgress] = useState<TrainingProgress>(() => {
    const all = loadAllProgress()
    return all[courseId] ?? { completedVariations: [], lastVariationId: null, lastMoveIdx: 0 }
  })

  useEffect(() => {
    const all = loadAllProgress()
    all[courseId] = progress
    saveAllProgress(all)
  }, [courseId, progress])

  const markVariationComplete = useCallback((variationId: string) => {
    setProgress((prev) => {
      if (prev.completedVariations.includes(variationId)) return prev
      return {
        ...prev,
        completedVariations: [...prev.completedVariations, variationId],
        lastVariationId: variationId,
        lastMoveIdx: 0,
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ completedVariations: [], lastVariationId: null, lastMoveIdx: 0 })
  }, [])

  const completedCount = progress.completedVariations.length

  return { progress, completedCount, markVariationComplete, resetProgress }
}
