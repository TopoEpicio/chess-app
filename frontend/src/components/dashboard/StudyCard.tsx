import type { ReactNode } from 'react'

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
      className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-6 cursor-pointer hover:shadow-[0_4px_20px_rgba(45,53,39,0.12)] transition-shadow"
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
        <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <MiniBoard />
        </div>
      </div>
    </div>
  )
}

function MiniBoard() {
  const light = 'bg-board-light'
  const dark = 'bg-board-dark'
  const pattern = [
    light, dark, light, dark,
    dark, light, dark, light,
    light, dark, light, dark,
    dark, light, dark, light,
    light, dark, light, dark,
    dark, light, dark, light,
    light, dark, light, dark,
    dark, light, dark, light,
  ]
  return (
    <div className="grid grid-cols-4 w-full h-full">
      {pattern.map((c, i) => (
        <div key={i} className={c} />
      ))}
    </div>
  )
}
