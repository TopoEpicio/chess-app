import { EvaluationChart } from '../../../../components/analysis/EvaluationChart'
import type { MoveAnalysisData } from '../../../../types/analysis'

interface GraphTabProps {
  moves: MoveAnalysisData[]
  currentMoveIndex?: number
  onMoveClick?: (moveIndex: number) => void
}

export function GraphTab({ moves, currentMoveIndex, onMoveClick }: GraphTabProps) {
  return (
    <div className="space-y-4">
      <EvaluationChart moves={moves} currentMoveIndex={currentMoveIndex} onMoveClick={onMoveClick} />
    </div>
  )
}
