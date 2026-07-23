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

interface ChessBoardProps {
  position?: string
  moveData?: MoveAnalysisData | null
  classification?: MoveClassification
  lastMoveUci?: string
  boardOrientation?: 'white' | 'black'
  boardWidth?: number
  showEval?: boolean
  onMove?: (move: { from: string; to: string; promotion?: string }) => void
  onSquareClick?: (square: string) => void
  highlightedSquares?: Record<string, React.CSSProperties>
}

export function ChessBoard({
  position,
  moveData,
  classification,
  lastMoveUci,
  boardOrientation = 'white',
  boardWidth = 400,
  showEval = true,
  onMove,
  highlightedSquares,
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

  const arrows = moveData
    ? getBoardArrows(moveData, arrowConfig)
    : []

  const displayClassification = classification || moveData?.classification
  const displayLastMoveUci = lastMoveUci || moveData?.best_move_uci

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

  const handleRightClick = useCallback((square: string) => {
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

  const evalWidth = 100
  const totalWidth = boardWidth + (showEval ? 16 + evalWidth : 0)

  return (
    <div style={{ width: totalWidth, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: boardWidth, aspectRatio: '1/1', flexShrink: 0, position: 'relative' }}>
        <Chessboard options={chessOptions} />
        <SquareRenderer icons={icons} boardWidth={boardWidth} />
      </div>
      {showEval && (
        <div style={{ width: evalWidth, height: boardWidth, flexShrink: 0 }}>
          <EvalBar evalInfo={null} engineReady={false} boardOrientation={boardOrientation} />
        </div>
      )}
    </div>
  )
}
