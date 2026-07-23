import type { ReactNode } from 'react'

interface AnalysisLayoutProps {
  board: ReactNode
  sidePanel: ReactNode
}

export function AnalysisLayout({ board, sidePanel }: AnalysisLayoutProps) {
  return (
    <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
      <div style={{ display: 'table-cell', width: 636, verticalAlign: 'top', paddingRight: 24 }} className="space-y-4">
        {board}
      </div>
      <div style={{ display: 'table-cell', verticalAlign: 'top' }} className="space-y-4">
        {sidePanel}
      </div>
    </div>
  )
}
