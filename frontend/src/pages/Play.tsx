import { useState, useEffect, useRef, useCallback, Fragment, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { useUciEngine } from '../engine/useUciEngine'
import { logger } from '../lib/logger'
import { EvalBar } from '../components/board/EvalBar'
import type { EvalInfo } from '../types/analysis'
import { ArrowLeft, Bot, Crown, Dices, PartyPopper, Frown, Handshake, RotateCw, Flag, ChevronDown, ChevronUp } from 'lucide-react'
import { useEngineConfig } from '../stores/engineStore'
import { GameSetup } from './components/GameSetup'
import { BoardSection } from './components/BoardSection'
import { GameInfo } from './components/GameInfo'

function getResultMessage(game: Chess): string {
  if (game.isCheckmate()) return 'Scacco matto!'
  if (game.isStalemate()) return 'Stallo — patta'
  if (game.isDraw()) return 'Patta'
  if (game.isThreefoldRepetition()) return 'Patta per ripetizione'
  if (game.isInsufficientMaterial()) return 'Patta — materiale insufficiente'
  return ''
}

export function Play({ onBack }: { onBack?: () => void }) {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState('start')
  const [userSide, setUserSide] = useState<'white' | 'black' | null>(null)
  const [botThinking, setBotThinking] = useState(false)
  const [moves, setMoves] = useState<string[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [resultMsg, setResultMsg] = useState('')
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [elo, setElo] = useState(1200)
  const { bestMove, ready } = useUciEngine()
  const engineCfg = useEngineConfig()

  const [showEval, setShowEval] = useState(false)
  const [lastEval, setLastEval] = useState<EvalInfo | null>(null)

  const premoveRef = useRef<{ from: string; to: string; promotion?: string } | null>(null)
  const premoveSourceRef = useRef<string | null>(null)
  const [pmDisplay, setPmDisplay] = useState<{ from: string; to: string } | null>(null)

  const clearPremove = useCallback(() => {
    premoveRef.current = null
    premoveSourceRef.current = null
    setPmDisplay(null)
  }, [])

  const userColor = userSide === 'white' ? 'w' : 'b'

  const triggerBotMove = useCallback(async () => {
    const game = gameRef.current
    if (game.isGameOver()) {
      setGameOver(true)
      setResultMsg(getResultMessage(game))
      return
    }
    if (game.turn() === userColor) return
    if (!ready) return

    setBotThinking(true)
    try {
      const info = await bestMove(game.fen(), elo)
      setLastEval(info)
      if (!info.bestMove) return
      const move = game.move(info.bestMove, { sloppy: true })
      if (move) {
        setFen(game.fen())
        setMoves(prev => [...prev, move.san])
      }
    } catch (e) {
      logger.error('Bot move error:', e)
    } finally {
      setBotThinking(false)
      premoveSourceRef.current = null

      if (premoveRef.current && !game.isGameOver() && game.turn() === userColor) {
        const pm = premoveRef.current
        premoveRef.current = null
        setPmDisplay(null)
        try {
          const move = game.move({ from: pm.from, to: pm.to, promotion: pm.promotion ?? 'q' })
          if (move) {
            setFen(game.fen())
            setMoves(prev => [...prev, move.san])
          }
        } catch {
          // Invalid premove, silently discard
        }
      }

      if (game.isGameOver()) {
        setGameOver(true)
        setResultMsg(getResultMessage(game))
      }
    }
  }, [bestMove, userColor, ready, elo])

  useEffect(() => {
    if (!userSide || gameOver || botThinking) return
    triggerBotMove()
  }, [userSide, fen, gameOver, botThinking, triggerBotMove, ready])

  const handleDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
    if (!targetSquare || botThinking || gameOver || !userSide) return false
    const game = gameRef.current
    if (game.turn() !== userColor) return false

    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
      if (!move) return false
      clearPremove()
      setFen(game.fen())
      setMoves(prev => [...prev, move.san])
      if (game.isGameOver()) {
        setGameOver(true)
        setResultMsg(getResultMessage(game))
      }
      return true
    } catch {
      return false
    }
  }, [botThinking, gameOver, userSide, userColor])

  const selectOwnPiece = useCallback((square: string) => {
    premoveSourceRef.current = square
    setPmDisplay({ from: square, to: '' })
  }, [])

  const clearSelection = useCallback(() => {
    premoveSourceRef.current = null
    setPmDisplay(null)
  }, [])

  const handleSquareClick = useCallback(({ piece, square }: { piece: { pieceType: string } | null; square: string }) => {
    if (!userSide || gameOver) return
    const game = gameRef.current
    const isMyTurn = game.turn() === userColor

    const isOwn = piece !== null && (
      userColor === 'w' ? piece.pieceType === piece.pieceType.toUpperCase()
      : piece.pieceType === piece.pieceType.toLowerCase()
    )

    if (premoveSourceRef.current && square === premoveSourceRef.current) {
      clearSelection()
      return
    }

    if (isOwn) {
      selectOwnPiece(square)
      return
    }

    if (premoveSourceRef.current) {
      if (isMyTurn) {
        try {
          const move = game.move({ from: premoveSourceRef.current, to: square, promotion: 'q' })
          if (move) {
            premoveRef.current = null
            clearSelection()
            setFen(game.fen())
            setMoves(prev => [...prev, move.san])
            if (game.isGameOver()) {
              setGameOver(true)
              setResultMsg(getResultMessage(game))
            }
          } else {
            clearSelection()
          }
        } catch {
          clearSelection()
        }
      } else {
        premoveRef.current = { from: premoveSourceRef.current, to: square, promotion: 'q' }
        clearSelection()
        setPmDisplay({ from: premoveRef.current.from, to: premoveRef.current.to })
      }
    }
  }, [gameOver, userSide, userColor, selectOwnPiece, clearSelection])

  const startGame = (side: 'white' | 'black') => {
    clearPremove()
    engineCfg.setSkillElo(elo)
    gameRef.current = new Chess()
    setFen('start')
    setMoves([])
    setGameOver(false)
    setResultMsg('')
    setBotThinking(false)
    setUserSide(side)
    setBoardFlipped(side === 'black')
  }

  const resign = () => {
    clearPremove()
    setGameOver(true)
    setResultMsg('Hai abbandonato')
  }

  const squareStyles = useMemo(() => {
    if (!pmDisplay) return undefined
    const isMyTurn = gameRef.current.turn() === userColor
    const isPremove = !isMyTurn && !!pmDisplay.to
    const styles: Record<string, React.CSSProperties> = {}
    if (pmDisplay.from) {
      styles[pmDisplay.from] = {
        background: isPremove ? 'rgba(100, 150, 255, 0.45)' : 'rgba(200, 200, 80, 0.35)',
        borderRadius: '50%',
      }
    }
    if (pmDisplay.to) {
      styles[pmDisplay.to] = {
        background: 'rgba(100, 150, 255, 0.45)',
        borderRadius: '50%',
      }
    }
    return styles
  }, [pmDisplay, userColor])

  if (!userSide) {
    return (
      <GameSetup
        onBack={onBack}
        onStartGame={startGame}
        elo={elo}
        onEloChange={setElo}
      />
    )
  }

  const game = gameRef.current
  const turn = game.turn()
  const board = game.board()
  const whiteCount = board.flat().filter(p => p?.color === 'w').length
  const blackCount = board.flat().filter(p => p?.color === 'b').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-sage-500 hover:text-sage-700 text-lg leading-none" title="Torna indietro"><ArrowLeft size={16} className="inline-block" /></button>
          )}
          <h1 className="text-2xl font-bold">Gioca contro Bot</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col items-center gap-4">
          <BoardSection
            fen={fen}
            boardFlipped={boardFlipped}
            showEval={showEval}
            lastEval={lastEval}
            ready={ready}
            botThinking={botThinking}
            gameOver={gameOver}
            resultMsg={resultMsg}
            turn={turn}
            userColor={userColor}
            pmDisplay={pmDisplay}
            onPieceDrop={handleDrop}
            onSquareClick={handleSquareClick}
            squareStyles={squareStyles}
            onRematch={() => startGame(userSide)}
            onChangeColor={() => setUserSide(null)}
            userSide={userSide}
          />

          <div className="flex items-center gap-3">
            <button onClick={() => setBoardFlipped(f => !f)} className="p-2 rounded hover:bg-sage-100 text-sage-700" title="Capovolgi"><RotateCw size={16} className="inline-block" /></button>
            <button onClick={() => startGame(userSide)} className="btn-ghost text-sm">Nuova partita</button>
            <button onClick={() => setUserSide(null)} className="btn-ghost text-sm">Cambia colore</button>
            <button onClick={() => setShowEval(f => !f)} className="btn-ghost text-sm">{showEval ? 'Nascondi valutazione' : 'Mostra valutazione'}</button>
            {!gameOver && <button onClick={resign} className="btn-ghost text-sm text-red-500 hover:text-red-700"><Flag size={16} className="inline-block" /> Abbandona</button>}
          </div>
        </div>

        <GameInfo
          userSide={userSide}
          gameOver={gameOver}
          resultMsg={resultMsg}
          botThinking={botThinking}
          turn={turn}
          userColor={userColor}
          pmDisplay={pmDisplay}
          moves={moves}
          whiteCount={whiteCount}
          blackCount={blackCount}
        />
      </div>
    </div>
  )
}
