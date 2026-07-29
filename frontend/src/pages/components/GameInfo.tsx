import { Fragment } from 'react'
import { Crown, ChevronDown, ChevronUp } from 'lucide-react'

interface GameInfoProps {
  userSide: 'white' | 'black'
  gameOver: boolean
  resultMsg: string
  botThinking: boolean
  turn: 'w' | 'b'
  userColor: 'w' | 'b'
  pmDisplay: { from: string; to: string } | null
  moves: string[]
  whiteCount: number
  blackCount: number
}

export function GameInfo({
  userSide,
  gameOver,
  resultMsg,
  botThinking,
  turn,
  userColor,
  pmDisplay,
  moves,
  whiteCount,
  blackCount,
}: GameInfoProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-box border border-sage-100 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">Partita</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Crown size={20} className="inline-block" /> Bianco</span>
            <span className={`font-medium ${userSide === 'white' ? 'text-sage-900' : 'text-sage-500'}`}>
              {userSide === 'white' ? 'Tu' : 'Bot'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Crown size={20} className="inline-block text-gray-400" /> Nero</span>
            <span className={`font-medium ${userSide === 'black' ? 'text-sage-900' : 'text-sage-500'}`}>
              {userSide === 'black' ? 'Tu' : 'Bot'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-sage-100 text-xs text-sage-500">
            Stato: <span className="font-medium text-sage-700">
              {gameOver ? resultMsg : botThinking ? 'Bot al pensiero...' : turn === userColor ? 'Tocca a te!' : 'In corso'}
              {pmDisplay?.to ? ` · Premossa: ${pmDisplay.from}→${pmDisplay.to}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-box border border-sage-100 flex flex-col max-h-[400px]">
        <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 p-4 pb-2 shrink-0">
          Mosse ({moves.length})
        </div>
        <div className="overflow-y-auto p-4 pt-0">
          {moves.length === 0 ? (
            <p className="text-xs text-sage-400 italic">Ancora nessuna mossa</p>
          ) : (
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm font-mono">
              {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                const w = moves[i * 2]
                const b = moves[i * 2 + 1]
                return (
                  <Fragment key={`move-row-${i}`}>
                    <span className="text-sage-400 text-xs pt-0.5">{i + 1}.</span>
                    <span className={`${moves[i * 2] === w ? 'text-sage-900' : ''}`}>{w}</span>
                    <span className={`${b ? 'text-sage-900' : ''}`}>{b || ''}</span>
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-box border border-sage-100 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">Pezzi catturati</div>
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-0.5 text-lg max-w-[120px]">
            {Array.from({ length: 16 - whiteCount }).map((_, i) => (
              <ChevronDown key={`cwu-${i}`} size={16} className="inline-block opacity-50" />
            ))}
          </div>
          <div className="flex flex-wrap gap-0.5 text-lg max-w-[120px]">
            {Array.from({ length: 16 - blackCount }).map((_, i) => (
              <ChevronUp key={`cbu-${i}`} size={16} className="inline-block opacity-50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}