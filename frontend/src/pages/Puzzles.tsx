import { useEffect, useState } from 'react'
import { PuzzleCategoryTabs } from '../components/puzzles/PuzzleCategoryTabs'
import { PuzzleSubcategoryGrid } from '../components/puzzles/PuzzleSubcategoryGrid'
import { PuzzleList } from '../components/puzzles/PuzzleList'
import { PuzzleSolver } from '../components/puzzles/PuzzleSolver'
import { ImportBulkModal } from '../components/puzzles/ImportBulkModal.tsx'
import { usePuzzleStore } from '../stores/puzzleStore'
import { CATEGORIES, getCategory, getSubcategory } from '../data/puzzleCategories'
import type { PuzzleCategory, CategoryStats } from '../types'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { getPuzzleIcon } from '../components/puzzles/puzzleIcons'

type View = 'categories' | 'subcategories' | 'puzzles'

export function Puzzles() {
  const {
    puzzles, loadPuzzles, loadCategoryStats, categoryStats, deletePuzzle, submitAttempt, loading,
    category, subcategory, setCategory, setSubcategory,
  } = usePuzzleStore()

  const [view, setView] = useState<View>('categories')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string>('')
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [pageSize, setPageSize] = useState(50)

  useEffect(() => {
    loadCategoryStats()
  }, [loadCategoryStats])

  const handleSelectCategory = (cat: PuzzleCategory) => {
    setCategory(cat)
    const catDef = CATEGORIES[cat]
    if (cat === 'mix' || !catDef?.subs?.length) {
      setSubcategory(null)
      setView('puzzles')
      loadPuzzles({ category: cat })
    } else {
      setView('subcategories')
    }
  }

  const PHASE_VALUES = new Set(['opening', 'middlegame', 'endgame'])

  const handleSelectSubcategory = (subKey: string) => {
    setSubcategory(subKey)
    setView('puzzles')
    const catDef = getCategory(category)
    const subDef = catDef?.subs?.find(s => s.key === subKey)
    const theme = subDef?.theme
    const isPhase = theme && PHASE_VALUES.has(theme)
    loadPuzzles({
      category,
      subcategory: subKey,
      theme: isPhase ? undefined : theme,
      phase: isPhase ? theme : subDef?.phase,
      difficulty: difficultyFilter ? parseInt(difficultyFilter) : undefined,
    })
  }

  const handleFilter = () => {
    handleSelectSubcategory(subcategory ?? '')
  }

  const handleBack = () => {
    const catDef = CATEGORIES[category]
    if (category === 'mix' || !catDef?.subs?.length) {
      setView('categories')
    } else {
      setView('subcategories')
    }
    setSelectedIndex(null)
  }

  const handleBackToCategories = () => {
    setView('categories')
  }

  const handleBackToSubcategories = () => {
    setView('subcategories')
  }

  const catDef = getCategory(category)
  const subDef = subcategory ? getSubcategory(category, subcategory) : null
  const totalPuzzles = puzzles.length

  // PuzzleSolver view
  if (selectedIndex !== null && puzzles[selectedIndex]) {
    const p = puzzles[selectedIndex]
    const puzzleData = {
      id: Number(p.id),
      fen: p.fen,
      solution: p.solution,
      theme: p.theme?.[0] ?? 'fork',
      difficulty: p.difficulty,
    }

    return (
      <PuzzleSolver
        puzzle={puzzleData}
        onSolve={(correct, timeMs) => {
          submitAttempt({ puzzle_id: Number(p.id), user_id: 1, correct, time_ms: timeMs })
        }}
        onNext={() => {
          const next = selectedIndex + 1
          if (next < puzzles.length) {
            setSelectedIndex(next)
          } else {
            setSelectedIndex(null)
            handleBack()
            loadPuzzles({ category })
          }
        }}
        onBack={() => {
          setSelectedIndex(null)
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-sage-900"><ChevronRight size={18} className="inline-block" /> Puzzle</h1>
          <p className="text-[15px] text-sage-700">Scegli una categoria per iniziare ad allenarti</p>
        </div>
        <button
          className="btn-ghost text-sm border border-sage-200 hover:bg-sage-100"
          onClick={() => setShowBulkImport(true)}
        >
          + Importa blocchi
        </button>
      </div>
      {showBulkImport && <ImportBulkModal onClose={() => setShowBulkImport(false)} />}

      <PuzzleCategoryTabs
        current={category}
        categoryStats={categoryStats}
        onSelect={handleSelectCategory}
      />

      {view === 'categories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Mix featured card */}
          <article
            role="button"
            tabIndex={0}
            className="bg-sage-100 rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 cursor-pointer transition-all duration-150 col-span-2 hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)]"
            onClick={() => handleSelectCategory('mix')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectCategory('mix') } }}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-[17px] font-semibold text-sage-900">Mix — Allenamento completo</div>
                <div className="text-[13px] text-sage-700 mt-1">Tutti i puzzle mescolati. Come in partita vera.</div>
              </div>
              <div className="text-[28px] font-semibold text-sage-900">
                {categoryStats?.mix?.total?.toLocaleString() ?? '...'}
              </div>
            </div>
          </article>

          {(['phases', 'motifs', 'mates', 'mate-themes'] as const).map((catKey) => {
            const def = CATEGORIES[catKey]
            const stats = categoryStats?.[catKey]
            const total = stats?.total ?? 0
            const borders: Record<string, string> = {
              phases: '#3b82f6',
              motifs: '#f59e0b',
              mates: '#ef4444',
              'mate-themes': '#8b5cf6',
            }
            return (
              <article
                key={catKey}
                role="button"
                tabIndex={0}
                className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 text-center cursor-pointer transition-all duration-150 border-2 border-transparent hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] hover:border-sage-200"
                style={{ borderLeft: `3px solid ${borders[catKey]}` }}
                onClick={() => handleSelectCategory(catKey)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectCategory(catKey) } }}
              >
                <div className="text-[28px] leading-none mb-2">{getPuzzleIcon(def.icon)}</div>
                <div className="text-[13px] font-semibold text-sage-900">{def.title}</div>
                <div className="text-lg font-semibold text-sage-500 mt-1">{total.toLocaleString()}</div>
                <div className="text-[11px] text-sage-500 mt-1 leading-tight">
                  {def.subs.slice(0, 3).map(s => s.name).join(' · ')}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {view === 'subcategories' && catDef && (
        <PuzzleSubcategoryGrid
          category={catDef}
          stats={categoryStats?.[category] ?? null}
          onSelect={handleSelectSubcategory}
          onBack={handleBackToCategories}
        />
      )}

      {view === 'puzzles' && (
        <>
          <nav className="flex items-center gap-2 mb-6 text-sm text-sage-200">
            <a href="#" onClick={(e) => { e.preventDefault(); handleBackToCategories() }} className="text-sage-700 font-medium no-underline hover:text-sage-900 transition-colors">
              Puzzle
            </a>
            {catDef && catDef.subs?.length > 0 && (
              <>
                <span className="text-sage-200">/</span>
                <a href="#" onClick={(e) => { e.preventDefault(); handleBackToSubcategories() }} className="text-sage-700 font-medium no-underline hover:text-sage-900 transition-colors">
                  {catDef.title}
                </a>
              </>
            )}
            <span className="text-sage-900 font-semibold">{subDef?.name ?? catDef?.title ?? 'Mix'}</span>
          </nav>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-[22px] font-bold text-sage-900">
              {getPuzzleIcon(subDef?.icon ?? catDef?.icon)} {subDef?.name ?? catDef?.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-sage-700">
              <span>{totalPuzzles > 0 ? `${totalPuzzles} puzzle disponibili` : '...'}</span>
              <button onClick={handleBack} className="btn-ghost text-xs border border-sage-200 hover:bg-sage-100">
                <ArrowLeft size={16} className="inline-block" /> Indietro
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap p-4 bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] mb-5">
            <span className="text-xs font-semibold text-sage-700 uppercase tracking-wider">Difficoltà</span>
            <select
              className="px-3 py-2 border border-sage-200 rounded-box text-sm bg-white text-sage-900 font-sans cursor-pointer focus:outline-none focus:border-sage-500"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">Tutte (1–10)</option>
              <option value="1-3">Facile (1–3)</option>
              <option value="4-6">Media (4–6)</option>
              <option value="7-10">Difficile (7–10)</option>
            </select>
            <button onClick={handleFilter} className="btn-primary text-xs ml-auto">
              Filtra
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-sage-500">Mostra</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-sage-200 rounded text-xs bg-white text-sage-900 focus:outline-none focus:border-sage-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-sage-500">di {puzzles.length}</span>
            </div>
          </div>

          <PuzzleList
            puzzles={puzzles.slice(0, pageSize)}
            loading={loading}
            onSelect={(index) => setSelectedIndex(index)}
            onDelete={(id) => deletePuzzle(id)}
            onSolve={async (id, correct, timeMs) => {
              await submitAttempt({ puzzle_id: id, user_id: 1, correct, time_ms: timeMs })
            }}
          />
        </>
      )}
    </div>
  )
}
