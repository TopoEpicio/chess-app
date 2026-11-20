import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';

export interface ClassificationRow {
  name: string;
  count: number;
  percentage: number;
  color: string;
  label: 'brilliant' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

interface ClassificationSummaryProps {
  rows: ClassificationRow[];
  totalMoves: number;
  className?: string;
}

export function ClassificationSummary({ rows, totalMoves, className = '' }: ClassificationSummaryProps) {
  const { t } = useTranslation('common')

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="space-y-3" role="list" aria-label={t('analysis.classificationDistribution')}>
        {rows.map((row, index) => (
          <div key={index} role="listitem" className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: row.color }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-[var(--color-text)] min-w-[90px]">{t(`analysis.${row.label}`)}</span>
            <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${row.percentage}%`, backgroundColor: row.color }}
              />
            </div>
            <span className="font-mono text-sm font-semibold text-[var(--color-text-muted)] w-16 text-right">
              {row.count}
            </span>
          </div>
        ))}
        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-muted)]">{t('analysis.totalAnalyzedMoves')}</span>
          <span className="font-mono font-semibold text-[var(--color-text)]">{totalMoves}</span>
        </div>
      </div>
    </Card>
  );
}
