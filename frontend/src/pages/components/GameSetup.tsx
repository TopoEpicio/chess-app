import { ArrowLeft, Bot, Crown, Dices } from 'lucide-react'

interface GameSetupProps {
  onBack?: () => void
  onStartGame: (side: 'white' | 'black') => void
  elo: number
  onEloChange: (elo: number) => void
}

export function GameSetup({ onBack, onStartGame, elo, onEloChange }: GameSetupProps) {
  const diffLabel = elo <= 600 ? 'Principiante' : elo <= 1200 ? 'Intermedio' : elo <= 2000 ? 'Avanzato' : elo <= 2800 ? 'Esperto' : 'Maestro'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button onClick={onBack} className="text-sage-500 hover:text-sage-700 text-lg leading-none" title="Torna indietro"><ArrowLeft size={16} className="inline-block" /></button>
        )}
        <h1 className="text-2xl font-bold">Gioca contro Bot</h1>
      </div>
      <div className="max-w-lg mx-auto mt-16">
        <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-8 text-center">
          <div className="text-5xl mb-4"><Bot size={20} className="inline-block" /></div>
          <h2 className="text-xl font-semibold text-sage-900 mb-2">Scegli il tuo colore</h2>
          <p className="text-sm text-sage-600 mb-6">Il bot giocherà con l'altro colore usando Stockfish</p>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">Difficoltà</span>
              <span className="text-sm font-bold text-sage-900">{diffLabel} · {elo}</span>
            </div>
            <input type="range" min="200" max="3200" step="50" value={elo}
              onChange={(e) => onEloChange(parseInt(e.target.value))}
              className="w-full accent-sage-500" />
            <div className="flex justify-between text-[11px] text-sage-400">
              <span>200</span>
              <span>3200</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => onStartGame('white')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
              <Crown size={20} className="inline-block" /> Bianco
            </button>
            <button onClick={() => onStartGame('black')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
              <Crown size={20} className="inline-block text-gray-400" /> Nero
            </button>
          </div>
          <button onClick={() => onStartGame(Math.random() < 0.5 ? 'white' : 'black')} className="btn-ghost mt-4 text-sm">
            <Dices size={16} className="inline-block" /> Random
          </button>
        </div>
      </div>
    </div>
  )
}