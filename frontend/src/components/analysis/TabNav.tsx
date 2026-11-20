import { useTranslation } from 'react-i18next'

export const TabNav = ({ selected, onSelect }: { selected: 'summary' | 'graph' | 'moves' | 'arrows' | 'coach'; onSelect: (tab: typeof selected) => void }) => {
  const { t } = useTranslation('common')
  const tabs = ['summary', 'graph', 'moves', 'arrows', 'coach'] as const

  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
            selected === tab ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
          }`}
        >
          {t(`analysis.${tab}`)}
        </button>
      ))}
    </div>
  )
}
