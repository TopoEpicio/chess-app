import { useCallback, useState, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { useAtomValue } from 'jotai'
import { Chessboard } from './ThemedBoard'
import { EvalBar } from './EvalBar'
import { SquareRenderer } from './SquareRenderer'
import { getBoardArrows } from './boardArrows'
import { getSquareStyles, getClassificationIcons } from './boardStyles'
import { arrowConfigAtom } from '../../state/atoms/engineAtoms'
import type { MoveAnalysisData, MoveClassification } from '../../types/analysis'
import type { EvalInfo } from '../../types/analysis'
import type { LineEval } from '../../types/eval'

interface ChessBoardProps {
  position?: string
  moveData?: MoveAnalysisData | null
  /**
   * Live engine lines for the current position — the same data that renders the
   * engine-lines table. The arrows are derived from it so that the arrow and
   * the suggestions can never disagree.
   */
  engineLines?: LineEval[] | null
  classification?: MoveClassification
  lastMoveUci?: string
  boardOrientation?: 'white' | 'black'
  boardWidth?: number
  showEval?: boolean
  evalInfo?: EvalInfo | null
  engineReady?: boolean
  engineError?: string | null
  /** Configured depth the live search is deepening towards (Settings). */
  engineTargetDepth?: number
  onMove?: (move: { from: string; to: string; promotion?: string }) => void
  onSquareClick?: (square: string) => void
  highlightedSquares?: Record<string, React.CSSProperties>
  /** Make the board responsive and fill container width */
  responsive?: boolean
}

/**
 * UCI of the move that was actually played, reconstructed from the position
 * before the move and its SAN. `moveData.best_move_uci` is the *engine's*
 * suggestion and must not be used as the "last move" highlight.
 */
function playedMoveUci(moveData: MoveAnalysisData | null | undefined): string | undefined {
  if (!moveData?.san || !moveData.fen_before) return undefined
  try {
    const move = new Chess(moveData.fen_before).move(moveData.san)
    return `${move.from}${move.to}${move.promotion ?? ''}`
  } catch {
    return undefined
  }
}

export function ChessBoard({
  position,
  moveData,
  engineLines,
  classification,
  lastMoveUci,
  boardOrientation = 'white',
  boardWidth = 400,
  showEval = true,
  evalInfo,
  engineReady = false,
  engineError = null,
  engineTargetDepth,
  onMove,
  highlightedSquares,
  responsive = false,
}: ChessBoardProps) {
  const [game] = useState(() => new Chess())
  const [internalPosition, setInternalPosition] = useState(position || 'start')
  const prevFenRef = useRef<string | undefined>(undefined)
  const arrowConfig = useAtomValue(arrowConfigAtom)
  const [rightClickHighlights, setRightClickHighlights] = useState<Record<string, React.CSSProperties>>({})

  useEffect(() => {
    if (position === undefined) {
      game.reset()
      prevFenRef.current = undefined
      setInternalPosition('start')
      return
    }
    if (position === prevFenRef.current) return
    prevFenRef.current = position

    try {
      game.load(position)
    } catch {
      return
    }
    setInternalPosition(position)
  }, [position, game])

  const arrows = getBoardArrows(moveData, arrowConfig, engineLines)

  const displayClassification = classification || moveData?.classification
  // The yellow "last move" highlight must show the move that was played, not
  // the engine's suggestion (which is drawn as an arrow).
  const displayLastMoveUci = lastMoveUci || playedMoveUci(moveData)

  const squareStyles = {
    ...getSquareStyles({
      lastMoveUci: displayLastMoveUci,
      classification: displayClassification,
      rightClickHighlights,
    }),
    ...(highlightedSquares || {}),
  }

  const icons = getClassificationIcons({
    classification: displayClassification,
    lastMoveUci: displayLastMoveUci,
  })

  const onDrop = useCallback(
    ({ piece, sourceSquare, targetSquare }: { piece: { pieceType: string }; sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare) return false
      const promotion = piece.pieceType.toLowerCase() === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1')
        ? 'q'
        : undefined

      try {
        const result = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion,
        })
        if (!result) return false

        const newFen = game.fen()
        setInternalPosition(newFen)
        onMove?.({ from: sourceSquare, to: targetSquare, promotion })
        return true
      } catch {
        return false
      }
    },
    [game, onMove]
  )

  const handleRightClick = useCallback(({ square }: { square: string }) => {
    setRightClickHighlights((prev) => {
      if (prev[square]) {
        const next = { ...prev }
        delete next[square]
        return next
      }
      return { ...prev, [square]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } }
    })
  }, [])

  const chessOptions = {
    id: 'main-board',
    position: internalPosition === 'start' ? undefined : internalPosition,
    onPieceDrop: onDrop,
    onSquareRightClick: handleRightClick,
    boardOrientation,
    arrows: arrows.length > 0 ? arrows : undefined,
    squareStyles: Object.keys(squareStyles).length > 0 ? squareStyles : undefined,
  }

const evalWidth = 48

  if (responsive) {
    // Responsive mode: CSS Grid gives the row a definite height from the board's aspect ratio.
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showEval ? '48px minmax(0, 1fr)' : 'minmax(0, 1fr)',
          gap: 12,
          alignItems: 'start',
          width: '100%',
        }}
      >
        {showEval && (
          <div style={{ width: 48, alignSelf: 'stretch', minHeight: 120 }}>
            <EvalBar
              evalInfo={evalInfo}
              engineReady={engineReady}
              engineError={engineError}
              boardOrientation={boardOrientation}
              targetDepth={engineTargetDepth}
            />
          </div>
        )}
        <div style={{ position: 'relative', aspectRatio: '1 / 1', minWidth: 0, width: '100%' }} data-testid="board-wrap">
          <Chessboard options={chessOptions} />
          <SquareRenderer icons={icons} />
        </div>
      </div>
    )
  }

  const totalWidth = boardWidth + (showEval ? 12 + evalWidth : 0)

  return (
    <div style={{ width: totalWidth, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {showEval && (
        <div style={{ width: evalWidth, height: boardWidth, flexShrink: 0, minHeight: 120 }}>
          <EvalBar
            evalInfo={evalInfo}
            engineReady={engineReady}
            engineError={engineError}
            boardOrientation={boardOrientation}
            targetDepth={engineTargetDepth}
          />
        </div>
      )}
      <div style={{ width: boardWidth, aspectRatio: '1/1', flexShrink: 0, position: 'relative' }}>
        <Chessboard options={chessOptions} />
        <SquareRenderer icons={icons} boardWidth={boardWidth} />
      </div>
    </div>
  )
}
