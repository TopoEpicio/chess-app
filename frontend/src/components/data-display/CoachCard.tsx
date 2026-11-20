import { type ReactNode } from 'react';
import { Card } from '../ui/Card';

interface CoachCardProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'insight';
  className?: string;
}

export function CoachCard({ title = 'Coach Insight', children, variant = 'default', className = '' }: CoachCardProps) {
  const variants = {
    default: 'bg-[var(--color-bg)] border border-[var(--color-border)]',
    primary: 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]',
    insight: 'bg-[var(--color-success-light)] border border-[var(--color-success)]',
  };

  return (
    <Card variant="outlined" padding="md" className={`${variants[variant]} ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs
          ${variant === 'primary' ? 'bg-[var(--color-primary)]' : variant === 'insight' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-muted)]'}
        `}>
          C
        </div>
        <h4 className="font-semibold text-[var(--color-text)]">{title}</h4>
      </div>
      <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{children}</div>
    </Card>
  );
}