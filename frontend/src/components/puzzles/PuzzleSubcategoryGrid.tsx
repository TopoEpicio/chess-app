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
  const total = stats?.total ?? 0

  return (
    <>
      <nav className="flex items-center gap-2 mb-6 text-sm text-sage-200">
        <a href="#" onClick={(e) => { e.preventDefault(); onBack() }} className="text-sage-700 font-medium no-underline hover:text-sage-900 transition-colors">
          Puzzle
        </a>
        <span className="text-sage-200">/</span>
        <span className="text-sage-900 font-semibold">{category.title}</span>
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-[22px] font-bold text-sage-900">
          {getPuzzleIcon(category.icon)} {category.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-sage-700">
          <span>{total.toLocaleString()} puzzle</span>
          <button onClick={onBack} className="btn-ghost text-xs border border-sage-200 hover:bg-sage-100">
            <ArrowLeft size={16} className="inline-block" /> Indietro
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
              className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 text-center cursor-pointer transition-all duration-150 border-2 border-transparent hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] hover:border-sage-200 focus-visible:outline-2 focus-visible:outline-sage-500 focus-visible:outline-offset-2"
              onClick={() => onSelect(sub.key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(sub.key) } }}
            >
              <div className="text-[28px] leading-none mb-2">{getPuzzleIcon(sub.icon)}</div>
              <div className="text-[13px] font-semibold text-sage-900">{sub.name}</div>
              <div className="text-lg font-semibold text-sage-500 mt-1">{count.toLocaleString()}</div>
              <div className="text-[11px] text-sage-500 mt-1 leading-tight">{sub.desc}</div>
            </article>
          )
        })}
      </div>
    </>
  )
}
