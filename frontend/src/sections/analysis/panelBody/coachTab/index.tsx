import { EducationalPanel } from '../../../../components/analysis/EducationalPanel'
import type { AnalysisExplanation } from '../../../../types/analysis'

interface CoachTabProps {
  analysis: AnalysisExplanation | null
  engineReady: boolean
}

export function CoachTab({ analysis, engineReady }: CoachTabProps) {
  return <EducationalPanel analysis={analysis} engineReady={engineReady} />
}
