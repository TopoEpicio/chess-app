import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { CLASSIFICATION_META } from '../../types/analysis'

export interface MoveRow {
  moveNumber: number;
  whiteMove: string;
  blackMove?: string;
  evaluation?: string;
  depth?: number;
  classification?: 'brilliant' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  time?: string;
  isCurrent?: boolean;
}

interface MoveTableProps {
  rows: MoveRow[];
  columns?: Array<{ key: string; label: string; width?: string; render?: (row: MoveRow) => ReactNode }>;
  className?: string;
}

const t = (key: string, opts?: Record<string, string | number>) => i18n.t(key, opts)

const defaultColumns = [
  { key: 'moveNumber', label: t('analysis.moveNumber'), width: '60px' },
  { key: 'whiteMove', label: t('analysis.whiteMove'), width: '150px' },
  { key: 'blackMove', label: t('analysis.blackMove'), width: '150px' },
  { key: 'evaluation', label: t('analysis.evaluation'), width: '120px' },
  { key: 'depth', label: t('analysis.depth'), width: '90px' },
  { key: 'time', label: t('analysis.time'), width: '80px' },
];

function classificationSymbol(classification: MoveRow['classification']): string {
  return CLASSIFICATION_META[classification]?.symbol ?? ''
}

function symbolColor(classification: MoveRow['classification']): string {
  switch (classification) {
    case 'brilliant':
    case 'best':
    case 'excellent':
    case 'good':
      return 'var(--color-success)'
    case 'inaccuracy':
    case 'mistake':
      return 'var(--color-warning)'
    case 'blunder':
      return 'var(--color-danger)'
    default:
      return 'var(--color-text-muted)'
  }
}

export function MoveTable({ rows, columns = defaultColumns, className = '' }: MoveTableProps) {
  return (
    <div className={`overflow-y-auto max-h-96 ${className}`}>
      <table className="w-full border-collapse text-sm" role="table">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                style={{ width: col.width }}
                className="px-3 py-2.5 text-left font-semibold text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors ${row.isCurrent ? 'bg-[var(--color-primary-light)]' : 'hover:bg-[var(--color-bg)]'}`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-3 py-2.5 border-b border-[var(--color-border)] whitespace-nowrap">
                  {col.render ? (
                    col.render(row)
                  ) : col.key === 'moveNumber' ? (
                    <span className="font-mono text-[var(--color-text-muted)] tabular-nums">{row[col.key]}</span>
                  ) : col.key === 'whiteMove' || col.key === 'blackMove' ? (
                    <span className={`font-mono ${row.isCurrent && col.key === 'whiteMove' ? 'text-[var(--color-primary)] font-semibold' : ''}`}>
                      {row[col.key]}
                      {row.classification && (
                        <span className='ml-1 text-xs font-bold' style={{ color: symbolColor(row.classification) }} aria-hidden='true'>
                          {classificationSymbol(row.classification)}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="font-mono text-[var(--color-text-secondary)] tabular-nums">{row[col.key] as string | number}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


