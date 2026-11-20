import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: ReactNode
}

const variantStyles: Record<string, string> = {
  default: 'border-l-[var(--color-primary)]',
  success: 'border-l-green-line',
  warning: 'border-l-yellow-line',
  error: 'border-l-red-line',
}

export function CoachCard({ icon, title, variant = 'default', children }: Props) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] overflow-hidden border-l-4 ${variantStyles[variant]}`}>
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none flex items-center">{icon}</span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{title}</h3>
        </div>
      </div>
      <div className="px-4 py-3 text-sm leading-relaxed text-[var(--color-text)]">
        {children}
      </div>
    </div>
  )
}
