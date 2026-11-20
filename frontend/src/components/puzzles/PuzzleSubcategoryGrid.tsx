import { useTranslation } from 'react-i18next'
import type { CategoryDef } from '../../data/puzzleCategories'
import type { CategoryStats } from '../../types'
import { ArrowLeft } from 'lucide-react'
import { getPuzzleIcon } from './puzzleIcons'

interface Props {
  category: CategoryDef
  stats: CategoryStats | null
  onSelect: (subKey: string) => void
  onBack: () => void
}

export function PuzzleSubcategoryGrid({ category, stats, onSelect, onBack }: Props) {
  const { t } = useTranslation('common')
  const total = stats?.total ?? 0

  return (
    <>
      <nav className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-secondary)]">
        <a href="#" onClick={(e) => { e.preventDefault(); onBack() }} className="text-[var(--color-text-secondary)] font-medium no-underline hover:text-[var(--color-text)] transition-colors">
          {t('puzzles.title')}
        </a>
        <span className="text-[var(--color-text-secondary)]">/</span>
        <span className="text-[var(--color-text)] font-semibold">{category.title}</span>
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-[22px] font-bold text-[var(--color-text)]">
          {getPuzzleIcon(category.icon)} {category.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
          <span>{total.toLocaleString()} {t('puzzles.title').toLowerCase()}</span>
          <button onClick={onBack} className="btn-ghost text-xs border border-[var(--color-border)] hover:bg-[var(--color-bg)]">
            <ArrowLeft size={16} className="inline-block" /> {t('common.back')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {category.subs.map((sub) => {
          const count = stats?.subs?.[sub.key] ?? 0
          return (
            <article
              key={sub.key}
              role="button"
              tabIndex={0}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-transparent p-5 text-center cursor-pointer transition-all duration-150 shadow-[var(--shadow-sm)] hover:translate-y-[-2px] hover:shadow-[var(--shadow)] hover:border-[var(--color-border)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
              onClick={() => onSelect(sub.key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(sub.key) } }}
            >
              <div className="text-[28px] leading-none mb-2">{getPuzzleIcon(sub.icon)}</div>
              <div className="text-[13px] font-semibold text-[var(--color-text)]">{sub.name}</div>
              <div className="text-lg font-semibold text-[var(--color-text-secondary)] mt-1">{count.toLocaleString()}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-1 leading-tight">{sub.desc}</div>
            </article>
          )
        })}
      </div>
    </>
  )
}
