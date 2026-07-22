import { useEffect, useRef, type ReactNode } from 'react'

interface MenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const menuX = Math.min(x, window.innerWidth - 200)
  const menuY = Math.min(y, window.innerHeight - items.length * 44 - 16)

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white-pure rounded-box shadow-xl border border-sage-100 py-1 min-w-[180px]"
      style={{ left: menuX, top: menuY }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.onClick(); onClose() }}
          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-sage-50 transition-colors ${
            item.danger ? 'text-red-600 hover:bg-red-50' : 'text-sage-800'
          }`}
        >
          {item.icon && <span className="w-4 text-center">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  )
}
