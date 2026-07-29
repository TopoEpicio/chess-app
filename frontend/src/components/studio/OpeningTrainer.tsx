import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, CheckCircle } from 'lucide-react'
import { CoachPanel } from './CoachPanel'
import { OpeningTrainerBoard } from './OpeningTrainerBoard'
import type { OpeningCourse } from '../../types/studio'

interface Props {
  course: OpeningCourse
  initialVariationIdx?: number
  onClose: () => void
  onVariationComplete: (variationId: string) => void
}

export function OpeningTrainer({ course, initialVariationIdx = 0, onClose, onVariationComplete }: Props) {
  const { t } = useTranslation()
  const [variationIdx, setVariationIdx] = useState(initialVariationIdx)
  const [moveIdx, setMoveIdx] = useState(-1)
  const [showComplete, setShowComplete] = useState(false)

  const variation = course.variations[variationIdx]
  const moveHistory = variation?.moves ?? []

  useEffect(() => {
    setMoveIdx(-1)
    setShowComplete(false)
  }, [variationIdx])

  const handleNext = useCallback(() => {
    if (moveIdx < moveHistory.length - 1) {
      setMoveIdx((i) => i + 1)
    } else if (!showComplete) {
      setShowComplete(true)
      onVariationComplete(variation.id)
    }
  }, [moveIdx, moveHistory.length, showComplete, variation?.id, onVariationComplete])

  const handlePrev = useCallback(() => {
    setMoveIdx((i) => Math.max(-1, i - 1))
  }, [])

  const handleReset = useCallback(() => {
    setMoveIdx(-1)
    setShowComplete(false)
  }, [])

  const currentMove = moveIdx >= 0 ? moveHistory[moveIdx] : null
  const moveNumber = moveIdx >= 0 ? Math.floor(moveIdx / 2) + 1 : 0

  const boardOrientation = course.side === 'black' ? 'black' : 'white'

  if (!variation) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-box p-8 text-center">
          <p className="text-sage-700">{t('studio.trainer.noVariations')}</p>
          <button onClick={onClose} className="btn-primary mt-4">{t('studio.trainer.close')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-sage-50 rounded-box shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-sage-100 rounded-t-box px-5 py-3 flex items-center justify-between z-10">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-sage-900 truncate">{course.name}</h2>
            <p className="text-xs text-sage-500 truncate">{variation.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {course.variations.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVariationIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === variationIdx ? 'bg-sage-500' : 'bg-sage-200 hover:bg-sage-300'
                  }`}
                  title={v.name}
                />
              ))}
            </div>
            <button onClick={onClose} className="text-sage-400 hover:text-sage-700">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <OpeningTrainerBoard
              fen={variation.fen}
              boardOrientation={boardOrientation}
              moveHistory={moveHistory}
              currentMoveIdx={moveIdx}
              onPrev={handlePrev}
              onNext={handleNext}
              onReset={handleReset}
            />
            <div className="mt-3 bg-white rounded-box shadow-card p-3">
              <h4 className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">{t('studio.trainer.moves')}</h4>
              <div className="flex flex-wrap gap-1">
                {moveHistory.map((m, i) => (
                  <span
                    key={i}
                    className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      i === moveIdx
                        ? 'bg-sage-500 text-white'
                        : i < moveIdx
                          ? 'bg-sage-100 text-sage-700'
                          : 'text-sage-400'
                    }`}
                  >
                    {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}{m}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <CoachPanel
              coachNote={course.coachNote}
              currentMove={currentMove}
              moveNumber={moveNumber}
            />
            {showComplete && (
              <div className="bg-green-50 border border-green-200 rounded-box p-4 text-center space-y-2">
                <CheckCircle size={32} className="mx-auto text-green-500" />
                <p className="text-sm font-semibold text-green-800">{t('studio.trainer.completedTitle')}</p>
                <p className="text-xs text-green-600">{t('studio.trainer.completedText', { name: variation.name })}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={moveIdx < 0}
                className="btn-ghost flex-1 disabled:opacity-30"
              >
                {t('studio.trainer.back')}
              </button>
              <button
                onClick={handleNext}
                className="btn-primary flex-1"
              >
                {moveIdx < moveHistory.length - 1 ? t('studio.trainer.next') : showComplete ? t('studio.trainer.completed') : t('studio.trainer.complete')}
              </button>
              <button
                onClick={onClose}
                className="btn-ghost flex-1"
              >
                {t('studio.trainer.exit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
