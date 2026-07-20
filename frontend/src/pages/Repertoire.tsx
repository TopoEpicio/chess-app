import { useState } from 'react'
import { RepertoireViewer } from '../components/repertoire/RepertoireViewer'
import { RepertoireSelector } from '../components/repertoire/RepertoireSelector'
import type { Opening } from '../types'

export function Repertoire() {
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null)

  if (selectedOpening) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <RepertoireViewer
          repertoireId={1}
          openingName={selectedOpening.name}
          rootNodeId={selectedOpening.startingNodeId}
          side={selectedOpening.side}
          onBack={() => setSelectedOpening(null)}
          onOpeningLinked={(startingNodeId) =>
            setSelectedOpening({ ...selectedOpening, startingNodeId })
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-sage-900 mb-8">Scegli un'apertura</h1>
      <RepertoireSelector onSelect={setSelectedOpening} />
    </div>
  )
}
