import { useState, useEffect, useRef, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { useUciEngine } from '../engine/useUciEngine'
import { ArrowLeft, Bot, Crown, Dices, PartyPopper, Frown, Handshake, RotateCw, Flag, ChevronDown, ChevronUp } from 'lucide-react'
import { useEngineConfig } from '../stores/engineStore'

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

  const userColor = userSide === 'white' ? 'w' : 'b'

  const triggerBotMove = useCallback(async () => {
    const game = gameRef.current
    if (game.isGameOver()) {
      setGameOver(true)
      setResultMsg(getResultMessage(game))
      return
    }
    if (game.turn() === userColor) return

    setBotThinking(true)
    try {
      const info = await bestMove(game.fen())
      if (!info.bestMove) return
      const move = game.move(info.bestMove, { sloppy: true })
      if (move) {
        setFen(game.fen())
        setMoves(prev => [...prev, move.san])
      }
    } catch (e) {
      console.error('Bot move error:', e)
    } finally {
      setBotThinking(false)
      if (game.isGameOver()) {
        setGameOver(true)
        setResultMsg(getResultMessage(game))
      }
    }
  }, [bestMove, userColor])

  useEffect(() => {
    if (!userSide || gameOver || botThinking) return
    triggerBotMove()
  }, [userSide, fen, gameOver, botThinking, triggerBotMove])

  const handleDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
    if (!targetSquare || botThinking || gameOver || !userSide) return false
    const game = gameRef.current
    if (game.turn() !== userColor) return false

    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
      if (!move) return false
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

  const startGame = (side: 'white' | 'black') => {
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
    setGameOver(true)
    setResultMsg('Hai abbandonato')
  }

  if (!userSide) {
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
                onChange={(e) => setElo(parseInt(e.target.value))}
                className="w-full accent-sage-500" />
              <div className="flex justify-between text-[11px] text-sage-400">
                <span>200</span>
                <span>3200</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => startGame('white')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                <Crown size={20} className="inline-block" /> Bianco
              </button>
              <button onClick={() => startGame('black')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                <Crown size={20} className="inline-block text-gray-400" /> Nero
              </button>
            </div>
            <button onClick={() => startGame(Math.random() < 0.5 ? 'white' : 'black')} className="btn-ghost mt-4 text-sm">
              <Dices size={16} className="inline-block" /> Random
            </button>
          </div>
        </div>
      </div>
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
          <div className="relative" style={{ width: 520, aspectRatio: '1/1' }}>
            <Chessboard
              options={{
                id: 'play-board',
                position: fen === 'start' ? undefined : fen,
                boardOrientation: boardFlipped ? 'black' : 'white',
                onPieceDrop: handleDrop,
                boardStyle: { borderRadius: '8px', boxShadow: '0 2px 12px rgba(45,53,39,0.08)' },
              }}
            />
            {botThinking && (
              <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="bg-white-pure rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium text-sage-700">
                  <span className="animate-spin text-lg inline-block"><Bot size={16} className="inline-block animate-spin" /></span> Bot sta pensando...
                </div>
              </div>
            )}
            {gameOver && (
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="bg-white-pure rounded-box shadow-xl p-6 mx-4 text-center max-w-xs">
                  <div className="text-3xl mb-2">{resultMsg.includes('matto') ? <PartyPopper size={24} className="inline-block" /> : resultMsg.includes('abbandonato') ? <Frown size={24} className="inline-block" /> : <Handshake size={24} className="inline-block" />}</div>
                  <p className="text-lg font-semibold text-sage-900 mb-1">{resultMsg}</p>
                  <p className="text-sm text-sage-500 mb-4">
                    {resultMsg === 'Scacco matto!'
                      ? (turn === userColor ? 'Hai perso!' : 'Hai vinto!')
                      : resultMsg.includes('abbandonato') ? 'Alla prossima!' : 'Nessun vincitore'}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => startGame(userSide)} className="btn-primary flex-1 text-sm">Rivincita</button>
                    <button onClick={() => setUserSide(null)} className="btn-ghost flex-1 text-sm">Cambia colore</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setBoardFlipped(f => !f)} className="p-2 rounded hover:bg-sage-100 text-sage-700" title="Capovolgi"><RotateCw size={16} className="inline-block" /></button>
            <button onClick={() => startGame(userSide)} className="btn-ghost text-sm">Nuova partita</button>
            <button onClick={() => setUserSide(null)} className="btn-ghost text-sm">Cambia colore</button>
            {!gameOver && <button onClick={resign} className="btn-ghost text-sm text-red-500 hover:text-red-700"><Flag size={16} className="inline-block" /> Abbandona</button>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-box border border-sage-100 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-3">Partita</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Crown size={20} className="inline-block" /> Bianco</span>
                <span className={`font-medium ${userSide === 'white' ? 'text-sage-900' : 'text-sage-500'}`}>
                  {userSide === 'white' ? 'Tu' : 'Bot'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Crown size={20} className="inline-block text-gray-400" /> Nero</span>
                <span className={`font-medium ${userSide === 'black' ? 'text-sage-900' : 'text-sage-500'}`}>
                  {userSide === 'black' ? 'Tu' : 'Bot'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-sage-100 text-xs text-sage-500">
                Stato: <span className="font-medium text-sage-700">
                  {gameOver ? resultMsg : botThinking ? 'Bot al pensiero...' : turn === userColor ? 'Tocca a te!' : 'In corso'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-box border border-sage-100 flex flex-col max-h-[400px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 p-4 pb-2 shrink-0">
              Mosse ({moves.length})
            </div>
            <div className="overflow-y-auto p-4 pt-0">
              {moves.length === 0 ? (
                <p className="text-xs text-sage-400 italic">Ancora nessuna mossa</p>
              ) : (
                <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm font-mono">
                  {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                    const w = moves[i * 2]
                    const b = moves[i * 2 + 1]
                    return (
                      <>
                        <span key={`n-${i}`} className="text-sage-400 text-xs pt-0.5">{i + 1}.</span>
                        <span key={`w-${i}`} className={`${moves[i * 2] === w ? 'text-sage-900' : ''}`}>{w}</span>
                        <span key={`b-${i}`} className={`${b ? 'text-sage-900' : ''}`}>{b || ''}</span>
                      </>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-box border border-sage-100 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">Pezzi catturati</div>
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-0.5 text-lg max-w-[120px]">
                {Array.from({ length: 16 - whiteCount }).map((_, i) => (
                  <ChevronDown key={`cwu-${i}`} size={16} className="inline-block opacity-50" />
                ))}
              </div>
              <div className="flex flex-wrap gap-0.5 text-lg max-w-[120px]">
                {Array.from({ length: 16 - blackCount }).map((_, i) => (
                  <ChevronUp key={`cbu-${i}`} size={16} className="inline-block opacity-50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
