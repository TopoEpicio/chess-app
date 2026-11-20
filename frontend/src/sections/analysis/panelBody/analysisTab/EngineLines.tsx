import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import type { LineEval } from '../../../../types/eval'

interface EngineLinesProps {
  lines: LineEval[]
  /** Position the PV lines start from. Needed to convert UCI to SAN. */
  fen?: string
  multiPv?: number
  onMoveClick?: (fen: string) => void
  loading?: boolean
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function movesUciToSan(fen: string, uciMoves: string[]): string[] {
  const game = new Chess(fen)
  const san: string[] = []
  for (const uci of uciMoves) {
    try {
      const move = game.move({
        from: uci.slice(0, 2) as string,
        to: uci.slice(2, 4) as string,
        promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
      })
      san.push(move.san)
    } catch {
      // Illegal move for this position: keep the raw UCI so the row still renders.
      san.push(uci)
      break
    }
  }
  return san
}

type PvToken =
  | { kind: 'number'; text: string }
  | { kind: 'move'; text: string; moveIndex: number }

/**
 * Builds the inline notation of a principal variation, lichess/chess.com style:
 * `1. e4 e5 2. Nf3 Nc6`. The move number is only printed in front of White's
 * moves; if the line starts with a Black move the number is printed as `1...`.
 */
function buildPvTokens(fen: string, sanMoves: string[]): PvToken[] {
  const parts = fen.trim().split(/\s+/)
  let whiteToMove = parts[1] !== 'b'
  let moveNumber = parts[5] ? parseInt(parts[5], 10) || 1 : 1

  const tokens: PvToken[] = []
  sanMoves.forEach((san, idx) => {
    if (whiteToMove) {
      tokens.push({ kind: 'number', text: `${moveNumber}.` })
    } else if (idx === 0) {
      tokens.push({ kind: 'number', text: `${moveNumber}...` })
    }
    tokens.push({ kind: 'move', text: san, moveIndex: idx })
    if (whiteToMove) {
      // Black replies with the same move number.
      whiteToMove = false
    } else {
      moveNumber += 1
      whiteToMove = true
    }
  })
  return tokens
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

export function EngineLines({ lines, fen = START_FEN, multiPv = 3, onMoveClick, loading }: EngineLinesProps) {
  const { t } = useTranslation('common')
  const sanLines = useMemo(() => {
    // Render in rank order (#1 first) so the first visible row is always the
    // line the green best-move arrow comes from.
    return [...lines]
      .sort((a, b) => a.multiPv - b.multiPv)
      .map((line) => ({
        ...line,
        tokens: buildPvTokens(fen, movesUciToSan(fen, line.pv)),
      }))
  }, [lines, fen])

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
        <div className="text-xs text-sage-500 text-center mt-2">{t('analysis.analyzingPosition')}</div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="text-sm text-sage-500 text-center py-4">
        {t('analysis.noEngineLines')}
      </div>
    )
  }

  const displayLines = sanLines.slice(0, multiPv)

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
        {t('analysis.engineLines')}
      </div>
      {displayLines.map((line) => (
        <div
          key={line.multiPv}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sage-400 font-mono text-xs shrink-0">#{line.multiPv}</span>
            <span className={`font-mono text-xs font-medium shrink-0 ${evalColor(line)}`}>
              {evalLabel(line)}
            </span>
          </div>
          {/* Inline notation, lichess/chess.com style: "1. e4 e5 2. Nf3 Nc6" */}
          <div className="font-mono text-xs leading-5 text-sage-700 break-words">
            {line.tokens.map((token, idx) => (
              <Fragment key={idx}>
                {token.kind === 'number' ? (
                  <span className="text-sage-400 select-none">{token.text}</span>
                ) : (
                  <button
                    onClick={() => onMoveClick?.(line.pv.slice(0, token.moveIndex + 1).join(' '))}
                    title="Vai a questa posizione"
                    className="hover:text-sage-900 hover:bg-sage-100 rounded px-0.5 text-left transition-colors"
                  >
                    {token.text}
                  </button>
                )}
                {idx < line.tokens.length - 1 && ' '}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
