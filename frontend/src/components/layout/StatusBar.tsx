import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next'
import { useEngineConfig } from '../../stores/engineStore';
import { Button } from '../ui/Button';

interface StatusBarProps {
  leftItems?: Array<{ label: string; value: string | number }>;
  rightActions?: ReactNode;
  saved?: boolean;
  className?: string;
}

export function StatusBar({ leftItems, rightActions, saved = true, className = '' }: StatusBarProps) {
  const { t } = useTranslation('common')
  const engineCfg = useEngineConfig();

  const defaultItems = [
    { label: t('analysis.engine'), value: 'Stockfish 16' },
    { label: t('analysis.depth'), value: `${engineCfg.depth} / ${engineCfg.depth}` },
    { label: 'Thread', value: engineCfg.threads },
    { label: 'Hash', value: `${engineCfg.hash} MB` },
    { label: 'MultiPV', value: engineCfg.multiPv },
  ];

  const items = leftItems || defaultItems;

  return (
    <footer className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex items-center justify-between flex-wrap gap-4 ${className}`} role="contentinfo">
      <div className="flex items-center gap-6 flex-wrap font-mono text-[11px] text-[var(--color-text-muted)]">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[var(--color-text-placeholder)]">{item.label}:</span>
            <span className="text-[var(--color-text)] font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {saved && (
          <span className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" aria-hidden="true" />
            {t('analysis.saved')}
          </span>
        )}
        {rightActions}
        <Button variant="ghost" size="sm" aria-label={t('analysis.exportAnalysis')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('common.export')}
        </Button>
      </div>
    </footer>
  );
}