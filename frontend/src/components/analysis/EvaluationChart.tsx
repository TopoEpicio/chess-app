import { useState, useRef } from 'react'
import type { MoveAnalysisData } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'
import { clsx } from 'clsx'

interface Props {
  moves: MoveAnalysisData[]
  onMoveClick?: (moveIndex: number) => void
}

const PADDING = { top: 28, right: 24, bottom: 36, left: 52 }
const CHART_HEIGHT = 240

function evalToNorm(eval_: number): number {
  if (eval_ === 0) return 0.5
  const clamped = Math.max(-10, Math.min(10, eval_))
  return 0.5 - (clamped / 10) * 0.42
}

function evalLabel(eval_: number): string {
  if (eval_ === 0) return '0.0'
  return eval_ > 0 ? `+${eval_.toFixed(1)}` : eval_.toFixed(1)
}

export function EvaluationChart({ moves, onMoveClick }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  if (moves.length === 0) {
    return (
      <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5 text-center text-sm text-sage-500">
        Nessun dato disponibile. Esegui prima l'analisi della partita.
      </div>
    )
  }

  const svgWidth = 760
  const innerW = svgWidth - PADDING.left - PADDING.right
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const totalH = CHART_HEIGHT
  const stepX = innerW / Math.max(moves.length - 1, 1)

  const points = moves.map((m, i) => {
    return {
      x: PADDING.left + i * stepX,
      y: PADDING.top + evalToNorm(m.played_eval) * innerH,
      isBlunder: m.classification === 'blunder',
      isMistake: m.classification === 'mistake',
      isInaccuracy: m.classification === 'inaccuracy',
    }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  const gridLines = [-10, -5, 0, 5, 10]

  return (
    <div className="bg-white rounded-box shadow-[0_2px_12px_rgba(45,53,39,0.08)] p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">
        Andamento della Partita
      </div>

      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${totalH}`}
          className="w-full"
          style={{ minWidth: '600px', aspectRatio: `${svgWidth} / ${totalH}` }}
        >
          {/* Grid */}
          {gridLines.map(val => {
            const y = PADDING.top + evalToNorm(val) * innerH
            return (
              <g key={val}>
                <line x1={PADDING.left - 8} x2={svgWidth - PADDING.right} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x={PADDING.left - 10} y={y + 4} textAnchor="end" className="text-[11px] fill-sage-500">
                  {val === 0 ? '0' : val > 0 ? `+${val}` : val}
                </text>
              </g>
            )
          })}

          {/* Axis labels */}
          <text x={svgWidth / 2} y={totalH - 4} textAnchor="middle" className="text-[10px] fill-sage-400">
            Numero mossa
          </text>

          {/* Move labels on X axis */}
          {moves.filter((_m, i) => i % Math.max(1, Math.floor(moves.length / 12)) === 0).map((m, _i) => {
            const idx = moves.indexOf(m)
            const x = PADDING.left + idx * stepX
            if (idx === -1) return null
            const displayNum = `${m.move_number}${m.is_white ? '' : ''}`
            return (
              <text key={idx} x={x} y={totalH - 12} textAnchor="middle" className="text-[9px] fill-sage-400">
                {displayNum}
              </text>
            )
          })}

          {/* Background gradient */}
          <defs>
            <linearGradient id="evalGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4caf50" />
              <stop offset="50%" stopColor="#898989" />
              <stop offset="100%" stopColor="#f44336" />
            </linearGradient>
          </defs>

          {/* Eval line */}
          <path d={pathD} fill="none" stroke="#2a6231" strokeWidth={2} strokeLinejoin="round" />

          {/* Classification indicators */}
          {moves.map((m, i) => {
            const p = points[i]
            if (!p) return null
            const hasClass = m.classification && (m.classification as string) !== 'best' && (m.classification as string) !== 'excellent' && (m.classification as string) !== 'good' && (m.classification as string) !== 'book' && (m.classification as string) !== 'forced'
            if (!hasClass) return null

            const meta = CLASSIFICATION_META[m.classification]
            const size = m.classification === 'blunder' ? 6 : m.classification === 'mistake' ? 5 : m.classification === 'inaccuracy' ? 4 : 3

            return (
              <g key={`ind-${i}`} className="cursor-pointer" onClick={() => onMoveClick?.(i)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={size}
                  fill={meta.color}
                  stroke="#fff"
                  strokeWidth={1}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                />

                {hoveredIdx === i && (
                  <g>
                    <rect
                      x={p.x + 8}
                      y={p.y - 28}
                      width={200}
                      height={36}
                      rx={4}
                      fill="#302e2b"
                      opacity={0.95}
                    />
                    <text x={p.x + 16} y={p.y - 12} fill="#fff" fontSize="11">
                      Mossa {m.move_number}{m.is_white ? 'w' : 'b'}: {m.san}
                    </text>
                    <text x={p.x + 16} y={p.y + 2} fill={meta.color} fontSize="11" fontWeight="bold">
                      {meta.symbol} {meta.label} (eval: {evalLabel(m.played_eval)})
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Legend */}
          <g>
            {(['blunder', 'mistake', 'inaccuracy'] as const).map((cls, i) => {
              const meta = CLASSIFICATION_META[cls]
              return (
                <g key={cls} transform={`translate(${svgWidth - PADDING.right - 260}, ${PADDING.top - 8 + i * 16})`}>
                  <circle cx={4} cy={6} r={3} fill={meta.color} />
                  <text x={14} y={10} fontSize="10" fill="#555">
                    {meta.label}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Best and worst */}
      <div className={clsx('grid grid-cols-2 gap-4 mt-3 text-xs text-sage-600', moves.length === 0 && 'hidden')}>
        <div>
          Miglior mossa Bianco:{' '}
          {(() => {
            const w = moves.filter(m => m.is_white)
            if (w.length === 0) return 'N/A'
            const best = w.reduce((a, b) => a.eval_swing < b.eval_swing ? a : b)
            return `${best.move_number}.${best.san} (swing: +${(best.eval_swing * 100).toFixed(0)}cp)`
          })()}
        </div>
        <div>
          Miglior mossa Nero:{' '}
          {(() => {
            const b = moves.filter(m => !m.is_white)
            if (b.length === 0) return 'N/A'
            const best = b.reduce((a, b2) => a.eval_swing < b2.eval_swing ? a : b2)
            return `${best.move_number}...${best.san} (swing: +${(best.eval_swing * 100).toFixed(0)}cp)`
          })()}
        </div>
      </div>
    </div>
  )
}