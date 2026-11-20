import type { ReactNode } from 'react'
import { useTheme } from '../../stores/themeStore'
import { BOARD_COLORS } from '../board/boardColors'

interface Props {
  tag: string
  title: string
  description: string
  children?: ReactNode
  onClick?: () => void
}

export function StudyCard({ tag, title, description, children, onClick }: Props) {
  return (
    <div
      className="bg-surface rounded-box shadow-card p-6 cursor-pointer hover:shadow-card transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-sage-500">
            {tag}
          </div>
          <h2 className="text-lg font-semibold mt-1">{title}</h2>
          <p className="text-sm text-sage-700 mt-1">{description}</p>
          {children}
        </div>
        <div className="w-20 aspect-square flex-shrink-0 rounded overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <MiniBoard />
        </div>
      </div>
    </div>
  )
}

function MiniBoard() {
  const { boardTheme } = useTheme()
  const colors = BOARD_COLORS[boardTheme] ?? BOARD_COLORS.default
  const pattern: Array<'light' | 'dark'> = [
    'light', 'dark', 'light', 'dark',
    'dark', 'light', 'dark', 'light',
    'light', 'dark', 'light', 'dark',
    'dark', 'light', 'dark', 'light',
  ]
  return (
    <div className="grid grid-cols-4 w-full h-full">
      {pattern.map((t, i) => (
        <div key={i} style={{ backgroundColor: t === 'light' ? colors.light : colors.dark }} />
      ))}
    </div>
  )
}
