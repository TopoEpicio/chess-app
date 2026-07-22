export const TabNav = ({ selected, onSelect }: { selected: 'summary' | 'graph' | 'moves' | 'arrows' | 'coach'; onSelect: (tab: typeof selected) => void }) => {
  const tabs = ['summary', 'graph', 'moves', 'arrows', 'coach'] as const
  const labels: Record<string, string> = { summary: 'Riepilogo', graph: 'Grafico', moves: 'Mosse', arrows: 'Freece', coach: 'Coach' }

  return (
    <div className="flex gap-1 mb-4 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
            selected === tab ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
          }`}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  )
}