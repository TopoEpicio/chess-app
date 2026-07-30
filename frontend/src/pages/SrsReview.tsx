import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { useSrsReview } from '../hooks/useSrsReview'
import type { ReviewQuality } from '../domain/srs/types'
import { ArrowLeft, RotateCcw, Check, X, SkipForward } from 'lucide-react'

interface Props {
  onBack: () => void
  onGenerateCards?: (generate: ReturnType<typeof useSrsReview>['generateCardsFromTree']) => void
}

export function SrsReview({ onBack, onGenerateCards }: Props) {
  const { t } = useTranslation()
  const { currentCard, stats, sessionComplete, submitReview, resetSession, totalDue, currentIdx } = useSrsReview()

  const handleResponse = useCallback((quality: ReviewQuality) => {
    submitReview(quality)
  }, [submitReview])

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-box shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('srs.session_complete')}</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-sage-50 rounded-lg">
              <p className="text-2xl font-bold text-sage-800">{stats.reviewed}</p>
              <p className="text-xs text-sage-600">{t('srs.reviewed')}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{stats.correct}</p>
              <p className="text-xs text-green-600">{t('srs.correct')}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">{stats.incorrect}</p>
              <p className="text-xs text-red-600">{t('srs.incorrect')}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={resetSession} className="btn-primary">{t('srs.review_again')}</button>
            <button onClick={onBack} className="btn-ghost">{t('srs.back')}</button>
          </div>
        </div>
      </div>
    )
  }

  if (totalDue === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
          <ArrowLeft size={16} /> {t('srs.back')}
        </button>
        <div className="bg-white rounded-box shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold mb-2">{t('srs.all_caught_up')}</h2>
          <p className="text-sage-600 mb-4">{t('srs.no_cards_due')}</p>
          <button onClick={resetSession} className="btn-primary">{t('srs.refresh')}</button>
        </div>
      </div>
    )
  }

  if (!currentCard) return null

  const game = new Chess(currentCard.fenKey)
  const legalMoves = game.moves({ verbose: false })
  const boardOrientation = game.turn() === 'w' ? 'white' : 'black'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> {t('srs.back')}
      </button>

      <div className="flex gap-6 items-start">
          <div className="shrink-0" style={{ width: 340 }}>
            <div style={{ width: 340, aspectRatio: '1/1' }}>
              <Chessboard
                options={{
                  id: 'srs-board',
                  position: currentCard.fenKey,
                  boardOrientation,
                }}
              />
            </div>

          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => handleResponse('incorrect')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium text-sm"
            >
              <X size={16} /> {t('srs.wrong')}
            </button>
            <button
              onClick={() => handleResponse('accepted')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium text-sm"
            >
              <SkipForward size={16} /> {t('srs.accept')}
            </button>
            <button
              onClick={() => handleResponse('correct')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium text-sm"
            >
              <Check size={16} /> {t('srs.correct')}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-sage-500">
            <span>{currentIdx + 1} / {totalDue}</span>
            <span>{t('srs.due')}: {new Date(currentCard.dueDate).toLocaleDateString()}</span>
            <span>{t('srs.ease')}: {currentCard.ease.toFixed(1)}x</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-box shadow-sm p-4">
            <h3 className="text-sm font-semibold mb-2">{t('srs.expected_moves')}</h3>
            {currentCard.expectedMoves.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentCard.expectedMoves.map((m) => (
                  <span key={m} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-sage-500">{t('srs.no_expected_moves')}</p>
            )}
          </div>

          <div className="bg-white rounded-box shadow-sm p-4 mt-3">
            <h3 className="text-sm font-semibold mb-2">{t('srs.legal_moves')}</h3>
            <div className="flex flex-wrap gap-1">
              {legalMoves.slice(0, 12).map((m) => (
                <span key={m} className="text-xs px-2 py-0.5 bg-sage-50 text-sage-600 rounded">
                  {m}
                </span>
              ))}
              {legalMoves.length > 12 && (
                <span className="text-xs text-sage-400">+{legalMoves.length - 12} {t('course.more')}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-box shadow-sm p-4 mt-3">
            <h3 className="text-sm font-semibold mb-2">{t('srs.card_stats')}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>{t('srs.reviews')}: <strong>{currentCard.totalReviews}</strong></div>
              <div>{t('srs.correct')}: <strong>{currentCard.totalCorrect}</strong></div>
              <div>{t('srs.forgets')}: <strong>{currentCard.forgets}</strong></div>
              <div>{t('srs.interval')}: <strong>{currentCard.interval}d</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
