import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { EvalBar } from './EvalBar'
import { useEngineAdapter } from '../../engine/EngineProvider'

interface Props {
  boardWidth?: number
  showEval?: boolean
  fen?: string
  boardOrientation?: 'white' | 'black'
  onMove?: (move: { from: string; to: string; promotion?: string }) => void
}

export function InteractiveBoard({ boardWidth = 400, showEval = true, fen, boardOrientation, onMove }: Props) {
  const [game] = useState(() => new Chess())
  const [position, setPosition] = useState(fen || 'start')
  const { evalInfo, analyze, ready, error } = useEngineAdapter()
  const prevFenRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (fen === undefined) {
      game.reset()
      prevFenRef.current = undefined
      setPosition('start')
      return
    }
    if (fen === prevFenRef.current) return
    prevFenRef.current = fen

    try {
      game.load(fen)
    } catch {
      return
    }
    setPosition(fen)
  }, [fen, game])

  useEffect(() => {
    if (!ready) return
      const fen =
        position === 'start'
          ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
          : position
    analyze(fen)
  }, [position, ready, analyze])

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
        setPosition(newFen)
        onMove?.({ from: sourceSquare, to: targetSquare, promotion })
        return true
      } catch {
        return false
      }
    },
    [game, onMove]
  )

  const boardStyle = useMemo(() => ({
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(45, 53, 39, 0.08)',
  }), [])

  const darkSquareStyle = useMemo(() => ({ backgroundColor: '#7a9a6a' }), [])
  const lightSquareStyle = useMemo(() => ({ backgroundColor: '#edeed7' }), [])

  const chessOptions = useMemo(() => ({
    id: 'main-board',
    position: position === 'start' ? undefined : position,
    onPieceDrop: onDrop,
    boardOrientation: boardOrientation || 'white',
    boardStyle,
    darkSquareStyle,
    lightSquareStyle,
  }), [position, onDrop, boardOrientation, boardStyle, darkSquareStyle, lightSquareStyle])

  const evalWidth = 100
  const totalWidth = boardWidth + (showEval ? 16 + evalWidth : 0)

  return (
    <div style={{ width: totalWidth, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: boardWidth, aspectRatio: '1/1', flexShrink: 0 }}>
        <Chessboard options={chessOptions} />
      </div>
      {showEval && (
        <div style={{ width: evalWidth, height: boardWidth, flexShrink: 0 }}>
          <EvalBar evalInfo={evalInfo} engineReady={ready} engineError={error} boardOrientation={boardOrientation} />
        </div>
      )}
    </div>
  )
}
