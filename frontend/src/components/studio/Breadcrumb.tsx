import type { BreadcrumbItem } from '../../types'

interface Props {
  items: BreadcrumbItem[]
  onNavigate: (folderId: number | null) => void
}

export function Breadcrumb({ items, onNavigate }: Props) {
  return (
    <nav className="flex items-center gap-1 text-sm text-sage-600 mb-4 overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => onNavigate(null)}
        className="hover:text-sage-900 font-medium transition-colors shrink-0"
      >
        Studio
      </button>
      {items.map((item, i) => (
        <span key={item.id ?? 'root'} className="flex items-center gap-1 shrink-0">
          <span className="text-sage-400">/</span>
          {i === items.length - 1 ? (
            <span className="text-sage-900 font-semibold">{item.name}</span>
          ) : (
            <button
              onClick={() => onNavigate(item.id)}
              className="hover:text-sage-900 transition-colors"
            >
              {item.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  )
}
