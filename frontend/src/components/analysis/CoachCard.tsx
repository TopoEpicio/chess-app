import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: ReactNode
}

const variantStyles: Record<string, string> = {
  default: 'border-l-sage-500',
  success: 'border-l-green-line',
  warning: 'border-l-yellow-line',
  error: 'border-l-red-line',
}

export function CoachCard({ icon, title, variant = 'default', children }: Props) {
  return (
    <div className={`bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] overflow-hidden border-l-4 ${variantStyles[variant]}`}>
      <div className="px-4 py-3 border-b border-sage-100">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sage-600">{title}</h3>
        </div>
      </div>
      <div className="px-4 py-3 text-sm leading-relaxed text-sage-800">
        {children}
      </div>
    </div>
  )
}
