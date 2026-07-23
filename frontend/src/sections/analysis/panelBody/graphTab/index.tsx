import { EvaluationChart } from '../../../../components/analysis/EvaluationChart'
import type { MoveAnalysisData } from '../../../../types/analysis'

interface GraphTabProps {
  moves: MoveAnalysisData[]
}

export function GraphTab({ moves }: GraphTabProps) {
  return (
    <div className="space-y-4">
      <EvaluationChart moves={moves} />
    </div>
  )
}
