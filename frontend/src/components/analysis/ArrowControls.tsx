import type { ArrowConfig } from '../../types/analysis'
import { DEFAULT_ARROW_CONFIG } from '../../types/analysis'

interface Props {
  config: ArrowConfig
  onChange: (config: ArrowConfig) => void
}

const ARROW_COLORS = {
  best: '#008000',
  second: '#0044ff',
  third: '#8800cc',
  threat: '#ff0000',
}

export function ArrowControls({ config, onChange }: Props) {
  const toggle = (key: keyof ArrowConfig) => {
    onChange({ ...config, [key]: !config[key] })
  }

  return (
    <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-sage-500">
          Frecce sul tabellone
        </div>
        <button
          onClick={() => onChange(DEFAULT_ARROW_CONFIG)}
          className="text-[10px] text-sage-500 hover:text-sage-700 underline"
        >
          Default
        </button>
      </div>

      <div className="space-y-2">
        {([
          { key: 'showBestMove' as const, label: 'Miglior mossa', color: ARROW_COLORS.best, desc: 'Freccia verde verso la mossa migliore secondo Stockfish' },
          { key: 'showSecondBest' as const, label: 'Seconda migliore', color: ARROW_COLORS.second, desc: 'Freccia blu verso la seconda scelta dell\'engine' },
          { key: 'showThirdBest' as const, label: 'Terza migliore', color: ARROW_COLORS.third, desc: 'Freccia viola verso la terza opzione' },
          { key: 'showThreats' as const, label: 'Minacce avversarie', color: ARROW_COLORS.threat, desc: 'Freccia rossa verso la mossa migliore dell\'avversario' },
        ] as const).map(({ key, label, color, desc }) => (
          <label
            key={key}
            className="flex items-center gap-3 p-2 rounded hover:bg-sage-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={config[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-sage-500 cursor-pointer"
            />
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col">
              <span className="text-sm text-sage-900 font-medium">{label}</span>
              <span className="text-[10px] text-sage-500">{desc}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="border-t border-sage-100 pt-3 mt-3 text-[10px] text-sage-500">
        Le frecce cambiano automaticamente quando navighi tra le mosse.
        {config.showThreats && (
          <span className="block mt-1 text-red-line">
            Minacce attive: mostra la miglior risposta del giocatore avversario dopo la tua mossa.
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Calcola le frecce da mostrare sulla scacchiera per una data posizione analizzata.
 */
export function getArrowsForPosition(
  moveData: { best_move_uci: string; second_move_uci: string | null; third_move_uci: string | null; pvs: string[][] | null } | null,
  config: ArrowConfig,
): Array<{ startSquare: string; endSquare: string; color: string }> {
  const arrows: Array<{ startSquare: string; endSquare: string; color: string }> = []
  if (!moveData) return arrows

  const uciToSquares = (uci: string): { from: string; to: string } => ({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
  })

  if (config.showBestMove && moveData.best_move_uci) {
    const { from, to } = uciToSquares(moveData.best_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.best })
  }
  if (config.showSecondBest && moveData.second_move_uci) {
    const { from, to } = uciToSquares(moveData.second_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.second })
  }
  if (config.showThirdBest && moveData.third_move_uci) {
    const { from, to } = uciToSquares(moveData.third_move_uci)
    arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.third })
  }
  if (config.showThreats && moveData.pvs && moveData.pvs[0] && moveData.pvs[0].length >= 3) {
    const threatUci = moveData.pvs[0][2]
    if (threatUci) {
      const { from, to } = uciToSquares(threatUci)
      arrows.push({ startSquare: from, endSquare: to, color: ARROW_COLORS.threat })
    }
  }

  return arrows
}