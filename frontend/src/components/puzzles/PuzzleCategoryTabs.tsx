import { useTranslation } from 'react-i18next'
import { CATEGORIES, CATEGORY_KEYS } from '../../data/puzzleCategories'
import type { PuzzleCategory, CategoryStats } from '../../types'
import { Target, BookOpen, Zap, Flag, Palette } from 'lucide-react'

interface Props {
  current: PuzzleCategory
  categoryStats: Record<string, CategoryStats> | null
  onSelect: (cat: PuzzleCategory) => void
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  mix: <Target size={16} className="inline-block" />,
  phases: <BookOpen size={16} className="inline-block" />,
  motifs: <Zap size={16} className="inline-block" />,
  mates: <Flag size={16} className="inline-block" />,
  'mate-themes': <Palette size={16} className="inline-block" />,
}

const CATEGORY_LOCALE_KEY: Record<string, string> = {
  mix: 'catMix',
  phases: 'catPhases',
  motifs: 'catMotifs',
  mates: 'catMates',
  'mate-themes': 'catMateThemes',
}

export function PuzzleCategoryTabs({ current, categoryStats, onSelect }: Props) {
  const { t } = useTranslation('common')

  return (
    <nav className="flex gap-2 bg-[var(--color-surface)] p-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] mb-8 overflow-x-auto" role="tablist">
      {CATEGORY_KEYS.map((key) => {
        const total = categoryStats?.[key]?.total ?? CATEGORIES[key]?.subs?.reduce((s, sub) => s + (categoryStats?.[key]?.subs?.[sub.key] ?? 0), 0) ?? 0
        return (
          <button
            key={key}
            role="tab"
            aria-selected={current === key}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius)] text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              current === key
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
            }`}
            onClick={() => onSelect(key as PuzzleCategory)}
          >
            <span>{CATEGORY_ICONS[key]}</span>
            {t(`puzzles.${CATEGORY_LOCALE_KEY[key]}`)}
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                current === key
                  ? 'bg-white/20 text-white/85'
                  : 'bg-[var(--color-border-strong)] text-[var(--color-text-muted)]'
              }`}
            >
              {total.toLocaleString()}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
