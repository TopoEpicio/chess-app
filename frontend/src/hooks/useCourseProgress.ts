import { useState, useCallback } from 'react'
import { LocalStorageRepo } from '../persistence/LocalStorageRepo'
import type { CourseProgress } from '../domain/course/types'

const progressRepo = new LocalStorageRepo<CourseProgress>('course-progress')

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    return progressRepo.get(courseId) || {
      courseId,
      completedLessons: [],
      startedAt: Date.now(),
    }
  })

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const next = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }
      progressRepo.set(courseId, next)
      return next
    })
  }, [courseId])

  const setCurrentLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const next = { ...prev, currentLessonId: lessonId }
      progressRepo.set(courseId, next)
      return next
    })
  }, [courseId])

  const markComplete = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, completedAt: Date.now() }
      progressRepo.set(courseId, next)
      return next
    })
  }, [courseId])

  const resetProgress = useCallback(() => {
    progressRepo.delete(courseId)
    setProgress({
      courseId,
      completedLessons: [],
      startedAt: Date.now(),
    })
  }, [courseId])

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  )

  return {
    progress,
    completeLesson,
    setCurrentLesson,
    markComplete,
    resetProgress,
    isLessonCompleted,
    lessonCount: progress.completedLessons.length,
  }
}
