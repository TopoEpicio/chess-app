import { useMemo } from 'react'
import { Chess } from 'chess.js'
import type { LineEval } from '../../../../types/eval'

interface EngineLinesProps {
  lines: LineEval[]
  fen: string
  multiPv?: number
  onMoveClick?: (fen: string) => void
  loading?: boolean
}

function movesUciToSan(fen: string, uciMoves: string[]): string[] {
  const game = new Chess(fen)
  return uciMoves.map((uci) => {
    const move = game.move({
      from: uci.slice(0, 2) as string,
      to: uci.slice(2, 4) as string,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
    })
    return move.san
  })
}

function evalLabel(line: LineEval): string {
  if (line.mate !== undefined) return `M${Math.abs(line.mate)}`
  if (line.cp === undefined) return '0.0'
  const val = line.cp / 100
  return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
}

function evalColor(line: LineEval): string {
  if (line.mate !== undefined) return line.mate > 0 ? 'text-emerald-600' : 'text-red-600'
  if (line.cp === undefined) return 'text-sage-600'
  return line.cp > 0 ? 'text-emerald-600' : line.cp < 0 ? 'text-red-600' : 'text-sage-600'
}

export function EngineLines({ lines, fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', multiPv = 3, onMoveClick, loading }: EngineLinesProps) {
  const sanLines = useMemo(() => {
    return lines.map((line) => ({
      ...line,
      san: movesUciToSan(fen, line.pv),
    }))
  }, [fen, lines])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: Math.min(multiPv, 3) }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 bg-sage-50 rounded-lg p-3">
            <div className="w-6 h-4 bg-sage-200 rounded" />
            <div className="w-16 h-4 bg-sage-200 rounded" />
            <div className="flex-1 h-4 bg-sage-200 rounded" />
          </div>
        ))}
        <div className="text-xs text-sage-500 text-center mt-2">Analisi in corso...</div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="text-sm text-sage-500 text-center py-4">
        Nessuna linea disponibile. Esegui l'analisi della posizione.
      </div>
    )
  }

  const displayLines = sanLines.slice(0, multiPv)

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
        Linee Engine
      </div>
      {displayLines.map((line) => (
        <div
          key={line.multiPv}
          className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm text-sm"
        >
          <span className="text-sage-400 font-mono text-xs shrink-0 mt-0.5">#{line.multiPv}</span>
          <span className={`font-mono text-xs font-medium shrink-0 mt-0.5 ${evalColor(line)}`}>
            {evalLabel(line)}
          </span>
          <span className="text-xs text-sage-400 shrink-0 mt-0.5">depth {line.depth}</span>
          <div className="flex flex-wrap gap-1">
            {line.san.map((san, idx) => (
              <button
                key={idx}
                onClick={() => onMoveClick?.(line.pv.slice(0, idx + 1).join(' '))}
                className="text-xs px-1.5 py-0.5 rounded hover:bg-sage-100 transition-colors font-mono text-sage-700"
              >
                {san}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
