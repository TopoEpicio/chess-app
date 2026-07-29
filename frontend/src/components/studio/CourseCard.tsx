import { useTranslation } from 'react-i18next'
import { ProgressRing } from './ProgressRing'
import { getThumbnailUrl } from '../../data/opening-thumbnails'
import type { OpeningCourse } from '../../types/studio'

const SIDE_COLORS = { white: 'bg-blue-100 text-blue-700', black: 'bg-gray-200 text-gray-800', both: 'bg-sage-100 text-sage-700' } as const

const STYLE_COLORS: Record<string, string> = {
  posizionale: 'bg-blue-100 text-blue-700',
  tattico: 'bg-orange-100 text-orange-700',
  difensivo: 'bg-green-100 text-green-700',
  aggressivo: 'bg-red-100 text-red-700',
}

interface Props {
  course: OpeningCourse
  completedVariations: number
  totalVariations: number
  onStart: (course: OpeningCourse) => void
  onReview: (course: OpeningCourse) => void
}

export function CourseCard({ course, completedVariations, totalVariations, onStart, onReview }: Props) {
  const { t } = useTranslation()
  const allDone = completedVariations === totalVariations
  const thumbnailUrl = getThumbnailUrl(course.id)

  return (
    <div className="bg-white rounded-box shadow-card overflow-hidden hover:shadow-card transition-shadow">
      <div className="relative aspect-[4/3] bg-sage-100 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt=""
          className="w-full h-full object-contain p-4"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
        <div className="absolute top-2 right-2">
          <ProgressRing completed={completedVariations} total={totalVariations} size={40} />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SIDE_COLORS[course.side]}`}>
            {t(`studio.side.${course.side}`)}
          </span>
          <span className="text-xs font-mono text-sage-400">{course.eco}</span>
        </div>
        <h3 className="text-sm font-semibold text-sage-900 leading-tight">{course.name}</h3>
        {course.description && (
          <p className="text-xs text-sage-600 line-clamp-2">{course.description}</p>
        )}
        <div className="flex gap-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full ${STYLE_COLORS[course.style] ?? 'bg-sage-100 text-sage-700'}`}>
            {t(`studio.courses.filter.${course.style === 'posizionale' ? 'positional' : course.style === 'tattico' ? 'tactical' : course.style === 'difensivo' ? 'defensive' : 'aggressive'}`)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${course.difficulty === 'facile' ? 'bg-green-100 text-green-700' : course.difficulty === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {t(`studio.courses.filter.${course.difficulty === 'facile' ? 'easy' : course.difficulty === 'media' ? 'medium' : 'hard'}`)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-sage-500">{completedVariations}/{totalVariations} {t('studio.courses.lines')}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onStart(course)}
            className="btn-primary flex-1 text-xs py-2"
          >
            {allDone ? t('studio.courses.review') : completedVariations > 0 ? t('studio.courses.continue') : t('studio.courses.start')}
          </button>
          {completedVariations > 0 && !allDone && (
            <button
              onClick={() => onReview(course)}
              className="btn-ghost flex-none text-xs py-2 px-3"
            >
              {t('studio.courses.review')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
