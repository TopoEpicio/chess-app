import { CATEGORIES, CATEGORY_KEYS } from '../../data/puzzleCategories'
import type { PuzzleCategory, CategoryStats } from '../../types'
import { Target, BookOpen, Zap, Flag, Palette } from 'lucide-react'

interface Props {
  current: PuzzleCategory
  categoryStats: Record<string, CategoryStats> | null
  onSelect: (cat: PuzzleCategory) => void
}

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  mix: { label: 'Mix', icon: <Target size={16} className="inline-block" /> },
  phases: { label: 'Fasi', icon: <BookOpen size={16} className="inline-block" /> },
  motifs: { label: 'Motivi', icon: <Zap size={16} className="inline-block" /> },
  mates: { label: 'Matti', icon: <Flag size={16} className="inline-block" /> },
  'mate-themes': { label: 'Temi', icon: <Palette size={16} className="inline-block" /> },
}

export function PuzzleCategoryTabs({ current, categoryStats, onSelect }: Props) {
  return (
    <nav className="flex gap-2 bg-white p-1.5 rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] mb-8 overflow-x-auto" role="tablist">
      {CATEGORY_KEYS.map((key) => {
        const info = CATEGORY_LABELS[key]
        const total = categoryStats?.[key]?.total ?? CATEGORIES[key]?.subs?.reduce((s, sub) => s + (categoryStats?.[key]?.subs?.[sub.key] ?? 0), 0) ?? 0
        return (
          <button
            key={key}
            role="tab"
            aria-selected={current === key}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-box text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              current === key
                ? 'bg-sage-500 text-white'
                : 'text-sage-700 hover:bg-sage-100 hover:text-sage-900'
            }`}
            onClick={() => onSelect(key as PuzzleCategory)}
          >
            <span>{info.icon}</span>
            {info.label}
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                current === key
                  ? 'bg-white/20 text-white/85'
                  : 'bg-sage-100 text-sage-500'
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
