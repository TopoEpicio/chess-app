import { useTranslation } from 'react-i18next'

interface CoachPanelProps {
  coachNote: string
  currentMove: string | null
  moveNumber: number
}

export function CoachPanel({ coachNote, currentMove, moveNumber }: CoachPanelProps) {
  const { t } = useTranslation()
  return (
    <div className="bg-white rounded-box shadow-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <h3 className="text-sm font-semibold text-sage-900">{t('studio.coach.title')}</h3>
      </div>
      <p className="text-sm text-sage-700 leading-relaxed">{coachNote}</p>
      {currentMove && (
        <div className="bg-sage-50 rounded-lg p-3 text-sm">
          <span className="text-sage-500">{t('studio.coach.move', { number: moveNumber })}</span>{' '}
          <span className="font-semibold text-sage-900">{currentMove}</span>
        </div>
      )}
    </div>
  )
}
