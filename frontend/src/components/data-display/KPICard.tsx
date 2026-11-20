import { type ReactNode } from 'react';
import { Card } from '../ui/Card';

interface KPICardProps {
  label: string;
  value: string | number;
  subText?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  className?: string;
}

export function KPICard({ label, value, subText, trend, variant = 'default', className = '' }: KPICardProps) {
  const variants = {
    default: '',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    danger: 'text-[var(--color-danger)]',
    primary: 'text-[var(--color-primary)]',
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
        {trend && (
          <span className={`
            font-mono text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-sm)]
            ${trend.direction === 'up' ? 'bg-[var(--color-success-light)] text-[var(--color-success)]' : ''}
            ${trend.direction === 'down' ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]' : ''}
            ${trend.direction === 'neutral' ? 'bg-[var(--color-bg)] text-[var(--color-text-muted)]' : ''}
          `}>
            {trend.value}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold tracking-tight ${variants[variant]}`}>{value}</p>
      {subText && <p className="mt-1 font-mono text-[11px] text-[var(--color-text-muted)]">{subText}</p>}
    </Card>
  );
}