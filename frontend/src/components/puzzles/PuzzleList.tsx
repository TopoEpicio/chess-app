import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PuzzleCard } from './PuzzleCard'
import { useUciEngine } from '../../engine/useUciEngine'
import { generateExplanation } from '../../engine/analysisEngine'
import type { AnalysisExplanation } from '../../types/analysis'
import type { Puzzle } from '../../types'
import { Search } from 'lucide-react'

interface Props {
  puzzles: Puzzle[]
  loading: boolean
  onSelect?: (index: number) => void
  onDelete?: (id: number) => void
  onSolve: (id: number, correct: boolean, timeMs: number) => void
}

export function PuzzleList({ puzzles, loading, onSelect, onDelete, onSolve }: Props) {
  const { t } = useTranslation('common')
  const { deepAnalyze } = useUciEngine()
  const [explanations, setExplanations] = useState<Record<string, AnalysisExplanation>>({})

  const getExplanation = useCallback(async (fen: string): Promise<AnalysisExplanation | null> => {
    if (explanations[fen]) return explanations[fen]
    try {
      const multiPv = await deepAnalyze(fen, 3)
      if (multiPv.length === 0) return null
      const result = generateExplanation({ multiPv, fen })
      setExplanations(prev => ({ ...prev, [fen]: result }))
      return result
    } catch {
      return null
    }
  }, [deepAnalyze, explanations])

  if (loading && puzzles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--color-primary)] border-t-transparent" />
      </div>
    )
  }

  if (puzzles.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-[40px] mb-4 opacity-40"><Search size={32} className="inline-block text-[var(--color-text-muted)]" /></div>
        <div className="text-lg font-semibold text-[var(--color-text)] mb-2">{t('puzzles.noPuzzles')}</div>
        <div className="text-sm text-[var(--color-text-secondary)]">{t('puzzles.tryOtherFilters')}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {puzzles.map((puzzle, index) => (
        <PuzzleCard
          key={puzzle.id}
          puzzle={{
            id: Number(puzzle.id),
            fen: puzzle.fen,
            solution: puzzle.solution,
            theme: puzzle.theme,
            difficulty: puzzle.difficulty,
            phase: puzzle.phase,
          }}
          onSolve={(correct, timeMs) => onSolve(Number(puzzle.id), correct, timeMs)}
          getExplanation={getExplanation}
          onClick={onSelect ? () => onSelect(index) : undefined}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
