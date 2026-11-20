import { MoveClassificationTable } from '../../../../components/analysis/MoveClassificationTable'
import type { MoveAnalysisData } from '../../../../types/analysis'

interface ClassificationTabProps {
  moves: MoveAnalysisData[]
  classificationCounts?: Record<string, number>
  currentIndex: number
  onMoveSelect: (index: number) => void
}

export function ClassificationTab({
  moves,
  classificationCounts,
  currentIndex,
  onMoveSelect,
}: ClassificationTabProps) {
  return (
    <div className="space-y-4">
      <MoveClassificationTable
        moves={moves}
        classificationCounts={classificationCounts}
        currentIndex={currentIndex}
        onMoveSelect={onMoveSelect}
      />
    </div>
  )
}
