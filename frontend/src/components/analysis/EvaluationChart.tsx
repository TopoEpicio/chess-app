import { useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { MoveAnalysisData } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'
import { clsx } from 'clsx'

interface Props {
  moves: MoveAnalysisData[]
  onMoveClick?: (moveIndex: number) => void
  currentMoveIndex?: number
}

function groupMovesByNumber(moves: MoveAnalysisData[]) {
  const movesByNumber = new Map<number, { white?: MoveAnalysisData; black?: MoveAnalysisData }>()
  for (const move of moves) {
    const entry = movesByNumber.get(move.move_number) ?? { white: undefined, black: undefined }
    if (move.is_white) {
      entry.white = move
    } else {
      entry.black = move
    }
    movesByNumber.set(move.move_number, entry)
  }

  const sortedNumbers = Array.from(movesByNumber.keys()).sort((a, b) => a - b)
  return sortedNumbers.map(moveNumber => {
    const entry = movesByNumber.get(moveNumber)!
    return {
      moveNumber,
      whiteMove: entry.white,
      blackMove: entry.black,
      playedEval: entry.white?.played_eval ?? entry.black?.played_eval ?? 0,
      classification: entry.white?.classification ?? entry.black?.classification,
      isWhite: true,
    }
  })
}

const PADDING = { top: 28, right: 24, bottom: 36, left: 52 }
const CHART_HEIGHT = 280

function evalToNorm(eval_: number): number {
  if (eval_ === 0) return 0.5
  const clamped = Math.max(-10, Math.min(10, eval_))
  return 0.5 - (clamped / 10) * 0.42
}

function evalLabel(eval_: number): string {
  if (eval_ === 0) return '0.0'
  return eval_ > 0 ? `+${eval_.toFixed(1)}` : eval_.toFixed(1)
}

function classificationDotColor(classification: string | undefined): string {
  if (!classification) return '#6B7280'
  switch (classification) {
    case 'brilliant':
    case 'best':
      return '#3B82F6'
    case 'excellent':
    case 'good':
    case 'great':
      return '#3B82F6'
    case 'inaccuracy':
    case 'mistake':
      return '#F97316'
    case 'blunder':
    case 'miss':
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

const WHITE_FILL = '#FFFFFF'
const BLACK_FILL = '#000000'
const BLACK_OUTLINE = '#000000'
const BASELINE_COLOR = '#6B7280'

function buildSmoothPath(points: { x: number; y: number }[]): { d: string; body: string } {
  const parts = points.map((p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const prev = points[i - 1]
    const next = points[i + 1]
    const cp1x = prev.x + (p.x - prev.x) / 2
    const cp1y = prev.y
    const cp2x = p.x - (next ? (next.x - p.x) / 2 : (p.x - prev.x) / 2)
    const cp2y = p.y
    return `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  })
  return { d: parts.join(' '), body: parts.slice(1).join(' ') }
}

function interpolateZero(p1: { x: number; y: number; eval: number }, p2: { x: number; y: number; eval: number }, zeroY: number) {
  const t = (zeroY - p1.y) / (p2.y - p1.y)
  return { x: p1.x + t * (p2.x - p1.x), y: zeroY }
}

function buildClipPaths(points: { x: number; y: number; eval: number }[], zeroY: number, topY: number, bottomY: number) {
  const positiveParts: string[] = []
  const negativeParts: string[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const bothAbove = p1.eval >= 0 && p2.eval >= 0
    const bothBelow = p1.eval <= 0 && p2.eval <= 0
    const crosses = (p1.eval > 0 && p2.eval < 0) || (p1.eval < 0 && p2.eval > 0)

    if (bothAbove) {
      positiveParts.push(`L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`)
    } else if (bothBelow) {
      negativeParts.push(`L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`)
    } else if (crosses) {
      const cross = interpolateZero(p1, p2, zeroY)
      if (p1.eval > 0) {
        positiveParts.push(`L ${cross.x.toFixed(1)} ${cross.y.toFixed(1)}`)
        negativeParts.push(`M ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`)
      } else {
        negativeParts.push(`L ${cross.x.toFixed(1)} ${cross.y.toFixed(1)}`)
        positiveParts.push(`M ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`)
      }
    }
  }

  const firstX = points[0].x
  const lastX = points[points.length - 1].x

  let whiteClipPath = ''
  if (positiveParts.length > 0) {
    const startAbove = points[0].eval >= 0
    whiteClipPath = `M ${firstX.toFixed(1)} ${bottomY.toFixed(1)} `
    if (startAbove) {
      whiteClipPath += `L ${firstX.toFixed(1)} ${points[0].y.toFixed(1)} `
    }
    whiteClipPath += positiveParts.join(' ')
    whiteClipPath += ` L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} Z`
  }

  let blackClipPath = ''
  if (negativeParts.length > 0) {
    const startBelow = points[0].eval <= 0
    blackClipPath = `M ${firstX.toFixed(1)} ${topY.toFixed(1)} `
    if (startBelow) {
      blackClipPath += `L ${firstX.toFixed(1)} ${points[0].y.toFixed(1)} `
    }
    blackClipPath += negativeParts.join(' ')
    blackClipPath += ` L ${lastX.toFixed(1)} ${topY.toFixed(1)} Z`
  }

  return { whiteClipPath, blackClipPath }
}

export function EvaluationChart({ moves, onMoveClick, currentMoveIndex }: Props) {
  const { t } = useTranslation('common')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const groupedMoves = useMemo(() => groupMovesByNumber(moves), [moves])

  if (groupedMoves.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 text-center text-sm text-[var(--color-text-muted)]">
        {t('analysis.noData')}
      </div>
    )
  }

  const svgWidth = 760
  const innerW = svgWidth - PADDING.left - PADDING.right
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const totalH = CHART_HEIGHT
  const stepX = innerW / Math.max(groupedMoves.length - 1, 1)

  const points = groupedMoves.map((m, i) => {
    return {
      x: PADDING.left + i * stepX,
      y: PADDING.top + evalToNorm(m.playedEval) * innerH,
      moveNumber: m.moveNumber,
      classification: m.classification,
      eval: m.playedEval,
    }
  })

  const zeroY = PADDING.top + evalToNorm(0) * innerH
  const topY = PADDING.top
  const bottomY = PADDING.top + innerH

  const smooth = buildSmoothPath(points)
  const smoothPathD = smooth.d
  const smoothBody = smooth.body
  const { whiteClipPath, blackClipPath } = buildClipPaths(points, zeroY, topY, bottomY)

  const gridLines = [-10, -5, 0, 5, 10]

  const currentGroupedIndex = currentMoveIndex !== undefined && currentMoveIndex >= 0
    ? Math.floor(currentMoveIndex / 2)
    : undefined

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {t('analysis.gameTrend')}
      </div>

      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${totalH}`}
          className="w-full"
          style={{ minWidth: '100%', aspectRatio: `${svgWidth} / ${totalH}` }}
        >
          <defs>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={WHITE_FILL} stopOpacity="0.9" />
              <stop offset="100%" stopColor={WHITE_FILL} stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="blackGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLACK_FILL} stopOpacity="0.9" />
              <stop offset="100%" stopColor={BLACK_FILL} stopOpacity="0.3" />
            </linearGradient>
            {whiteClipPath && (
              <clipPath id="whiteClip">
                <path d={whiteClipPath} />
              </clipPath>
            )}
            {blackClipPath && (
              <clipPath id="blackClip">
                <path d={blackClipPath} />
              </clipPath>
            )}
          </defs>

          {gridLines.filter(v => v !== 0).map(val => {
            const y = PADDING.top + evalToNorm(val) * innerH
            return (
              <g key={val}>
                <line
                  x1={PADDING.left}
                  x2={svgWidth - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeDasharray="4 4"
                  strokeWidth={0.5}
                />
                <text
                  x={PADDING.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-[var(--color-text-muted)] font-mono"
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            )
          })}

          <line
            x1={PADDING.left}
            x2={svgWidth - PADDING.right}
            y1={zeroY}
            y2={zeroY}
            stroke={BASELINE_COLOR}
            strokeWidth={1}
          />

          {currentGroupedIndex !== undefined && currentGroupedIndex >= 0 && currentGroupedIndex < points.length && (
            <line
              x1={points[currentGroupedIndex].x}
              x2={points[currentGroupedIndex].x}
              y1={PADDING.top}
              y2={PADDING.top + innerH}
              stroke="var(--color-text-muted)"
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity="0.5"
            />
          )}

          {/* White fill: from absolute BOTTOM up to curve, clipped to positive regions */}
          {whiteClipPath && (
            <path
              d={`M ${PADDING.left} ${bottomY} L ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} ${smoothBody} L ${points[points.length - 1].x.toFixed(1)} ${bottomY} Z`}
              fill="url(#whiteGrad)"
              stroke={BLACK_OUTLINE}
              strokeWidth={1}
              clipPath="url(#whiteClip)"
            />
          )}

          {/* Black fill: from absolute TOP down to curve, clipped to negative regions */}
          {blackClipPath && (
            <path
              d={`M ${PADDING.left} ${topY} L ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} ${smoothBody} L ${points[points.length - 1].x.toFixed(1)} ${topY} Z`}
              fill="url(#blackGrad)"
              stroke={BLACK_OUTLINE}
              strokeWidth={1}
              clipPath="url(#blackClip)"
            />
          )}

          {/* Eval line */}
          <path
            d={smoothPathD}
            fill="none"
            stroke={BLACK_OUTLINE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {groupedMoves.map((m, i) => {
            const p = points[i]
            if (!p) return null
            const hasClass = m.classification &&
              m.classification !== 'best' &&
              m.classification !== 'excellent' &&
              m.classification !== 'good' &&
              m.classification !== 'book' &&
              m.classification !== 'forced'
            if (!hasClass) return null

            const meta = CLASSIFICATION_META[m.classification]
            const size = m.classification === 'blunder' ? 7 : m.classification === 'mistake' ? 6 : m.classification === 'inaccuracy' ? 5 : 4
            const dotColor = classificationDotColor(m.classification)

            return (
              <g key={`ind-${i}`} className="cursor-pointer" onClick={() => onMoveClick?.(i * 2)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={size}
                  fill={dotColor}
                  stroke={BLACK_OUTLINE}
                  strokeWidth={1.5}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                />

                {hoveredIdx === i && (
                  <g>
                    <rect
                      x={p.x + 10}
                      y={p.y - 32}
                      width={220}
                      height={40}
                      rx={4}
                      fill="var(--color-bg)"
                      opacity={0.95}
                    />
                    <text x={p.x + 18} y={p.y - 16} fill="var(--color-text)" fontSize="11">
                      {t('analysis.moveLabel', { number: m.moveNumber, side: 'w', san: m.whiteMove?.san ?? '' })}
                    </text>
                    <text x={p.x + 18} y={p.y + 2} fill={dotColor} fontSize="11" fontWeight="bold">
                      {meta.symbol} {t(`analysis.cls.${m.classification}`)} (eval: {evalLabel(m.playedEval)})
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {groupedMoves.filter((_m, i) => i % Math.max(1, Math.floor(groupedMoves.length / 14)) === 0).map((m, _i) => {
            const idx = groupedMoves.indexOf(m)
            const x = PADDING.left + idx * stepX
            if (idx === -1) return null
            return (
              <text key={idx} x={x} y={totalH - 12} textAnchor="middle" className="text-[9px] fill-[var(--color-text-muted)] font-mono">
                {m.moveNumber}
              </text>
            )
          })}

          <g transform={`translate(${svgWidth - PADDING.right - 180}, ${PADDING.top - 8})`}>
            {(['blunder', 'mistake', 'inaccuracy'] as const).map((cls, i) => {
              return (
                <g key={cls} transform={`translate(0, ${i * 18})`}>
                  <circle cx={4} cy={6} r={3} fill={classificationDotColor(cls)} stroke={BLACK_OUTLINE} strokeWidth={1} />
                  <text x={14} y={10} fontSize="10" fill="var(--color-text-secondary)">
                    {t(`analysis.cls.${cls}`)}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className={clsx('grid grid-cols-2 gap-4 mt-3 text-xs text-[var(--color-text-secondary)]', groupedMoves.length === 0 && 'hidden')}>
        <div>
          {t('analysis.bestMoveWhite')} {' '}
          {(() => {
            const w = moves.filter(m => m.is_white)
            if (w.length === 0) return t('analysis.na')
            const best = w.reduce((a, b) => a.eval_swing < b.eval_swing ? a : b)
            return `${best.move_number}.${best.san} (swing: +${(best.eval_swing * 100).toFixed(0)}cp)`
          })()}
        </div>
        <div>
          {t('analysis.bestMoveBlack')} {' '}
          {(() => {
            const b = moves.filter(m => !m.is_white)
            if (b.length === 0) return t('analysis.na')
            const best = b.reduce((a, b2) => a.eval_swing < b2.eval_swing ? a : b2)
            return `${best.move_number}...${best.san} (swing: +${(best.eval_swing * 100).toFixed(0)}cp)`
          })()}
        </div>
      </div>
    </div>
  )
}