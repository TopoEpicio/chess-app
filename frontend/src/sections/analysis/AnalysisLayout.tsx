import type { ReactNode } from 'react'

interface AnalysisLayoutProps {
  /** Main column: board card + actions (flexible width) */
  board: ReactNode
  /** Right column: tabs / details (fixed 520px on wide screens) */
  side: ReactNode
}

export function AnalysisLayout({ board, side }: AnalysisLayoutProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_520px] gap-4 items-start">
      <div className="min-w-0 space-y-4">{board}</div>
      <div className="min-w-0 space-y-4">{side}</div>
    </div>
  )
}