import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { groupOpeningsByFamily } from '../../utils/courseMapper'
import type { OpeningCourse, CourseSide, CourseStyle, CourseDifficulty, FilterState } from '../../types/studio'

interface Props {
  courses: OpeningCourse[]
  progressMap: Record<string, { completed: number; total: number }>
  onStart: (course: OpeningCourse) => void
  onReview: (course: OpeningCourse) => void
}

export function CourseGrid({ courses, progressMap, onStart, onReview }: Props) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<FilterState>({
    side: 'all',
    style: 'all',
    difficulty: 'all',
    sort: 'eco',
    family: 'all',
  })

  const { families, order } = useMemo(() => {
    const groups = groupOpeningsByFamily(courses)
    const sortedKeys = Object.keys(groups).sort((a, b) => t(a).localeCompare(t(b)))
    return { families: groups, order: sortedKeys }
  }, [courses, t])

  const filteredFamilies = useMemo(() => {
    const result: Record<string, OpeningCourse[]> = {}
    for (const key of order) {
      let lines = families[key]

      if (filters.family !== 'all' && key !== filters.family) continue

      if (search.trim()) {
        const q = search.toLowerCase()
        lines = lines.filter((c) => c.name.toLowerCase().includes(q))
      }
      if (filters.side !== 'all') {
        lines = lines.filter((c) => c.side === filters.side)
      }
      if (filters.style !== 'all') {
        lines = lines.filter((c) => c.style === filters.style)
      }
      if (filters.difficulty !== 'all') {
        lines = lines.filter((c) => c.difficulty === filters.difficulty)
      }

      if (lines.length > 0) {
        result[key] = lines
      }
    }
    return result
  }, [families, order, search, filters])

  const visibleFamilyKeys = useMemo(() => {
    const keys = Object.keys(filteredFamilies)
    keys.sort((a, b) => t(a).localeCompare(t(b)))
    return keys
  }, [filteredFamilies, t])

  const hasActiveFilters = filters.side !== 'all' || filters.style !== 'all' || filters.difficulty !== 'all' || filters.family !== 'all' || search.trim() !== ''

  const allFamilyKeys = useMemo(() => {
    return Object.keys(families).sort((a, b) => t(a).localeCompare(t(b)))
  }, [families, t])

  const SIDE_OPTIONS: { value: CourseSide | 'all'; label: string }[] = [
    { value: 'all', label: t('studio.courses.filter.all') },
    { value: 'white', label: t('studio.courses.filter.white') },
    { value: 'black', label: t('studio.courses.filter.black') },
  ]

  const STYLE_OPTIONS: { value: CourseStyle | 'all'; label: string }[] = [
    { value: 'all', label: t('studio.courses.filter.all') },
    { value: 'posizionale', label: t('studio.courses.filter.positional') },
    { value: 'tattico', label: t('studio.courses.filter.tactical') },
    { value: 'difensivo', label: t('studio.courses.filter.defensive') },
    { value: 'aggressivo', label: t('studio.courses.filter.aggressive') },
  ]

  const DIFFICULTY_OPTIONS: { value: CourseDifficulty | 'all'; label: string }[] = [
    { value: 'all', label: t('studio.courses.filter.all') },
    { value: 'facile', label: t('studio.courses.filter.easy') },
    { value: 'media', label: t('studio.courses.filter.medium') },
    { value: 'difficile', label: t('studio.courses.filter.hard') },
  ]

  const SORT_OPTIONS: { value: FilterState['sort']; label: string }[] = [
    { value: 'name', label: t('studio.courses.sort.alpha') },
    { value: 'eco', label: t('studio.courses.sort.eco') },
  ]

  const toggleFamily = (key: string) => {
    setExpandedFamilies((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('studio.courses.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 border border-sage-200 rounded-lg text-sm bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {SIDE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilters((f) => ({ ...f, side: opt.value }))}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filters.side === opt.value
                ? 'bg-sage-500 text-white'
                : 'bg-white text-sage-700 border border-sage-200 hover:bg-sage-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="w-px h-5 bg-sage-200 mx-1" />
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilters((f) => ({ ...f, style: opt.value }))}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filters.style === opt.value
                ? 'bg-sage-500 text-white'
                : 'bg-white text-sage-700 border border-sage-200 hover:bg-sage-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="w-px h-5 bg-sage-200 mx-1" />
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilters((f) => ({ ...f, difficulty: opt.value }))}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filters.difficulty === opt.value
                ? 'bg-sage-500 text-white'
                : 'bg-white text-sage-700 border border-sage-200 hover:bg-sage-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-sage-500">{t('studio.courses.sort.label')}</label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as FilterState['sort'] }))}
            className="px-2 py-1 border border-sage-200 rounded text-xs bg-white text-sage-900 focus:outline-none focus:border-sage-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {visibleFamilyKeys.length === 0 ? (
        <div className="bg-white rounded-box shadow-card p-12 text-center">
          <div className="text-sage-300 text-4xl mb-3">📖</div>
          <p className="text-sage-700 font-medium">{t('studio.courses.empty.title')}</p>
          <p className="text-sm text-sage-500 mt-1">{t('studio.courses.empty.hint')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleFamilyKeys.map((key) => {
            const lines = filteredFamilies[key]
            const allCollapsed = !expandedFamilies.has(key) && hasActiveFilters === false
            const isExpanded = expandedFamilies.has(key) || hasActiveFilters

            return (
              <div key={key}>
                <button
                  onClick={() => toggleFamily(key)}
                  className="flex items-center gap-2 w-full text-left mb-3 group"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-sage-400 group-hover:text-sage-600" />
                  ) : (
                    <ChevronRight size={16} className="text-sage-400 group-hover:text-sage-600" />
                  )}
                  <h2 className="text-base font-semibold text-sage-800">{t(key)}</h2>
                  <span className="text-xs text-sage-400">({lines.length})</span>
                </button>
                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lines.map((course) => {
                      const p = progressMap[course.id] ?? { completed: 0, total: course.variations.length }
                      return (
                        <CourseCard
                          key={course.id}
                          course={course}
                          completedVariations={p.completed}
                          totalVariations={course.variations.length}
                          onStart={onStart}
                          onReview={onReview}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
