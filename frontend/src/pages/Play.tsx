import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { useUciEngine } from '../engine/useUciEngine'
import { ArrowLeft, Bot, Crown, Dices, PartyPopper, Frown, Handshake, RotateCw, Flag, ChevronDown, ChevronUp } from 'lucide-react'

export function Play({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation('common')
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState('start')
  const [userSide, setUserSide] = useState<'white' | 'black' | null>(null)
  const [botThinking, setBotThinking] = useState(false)
  const [moves, setMoves] = useState<string[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [resultMsg, setResultMsg] = useState('')
  const [resultKind, setResultKind] = useState<'checkmate' | 'draw' | 'resigned' | null>(null)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [elo, setElo] = useState(1200)
  const { bestMove, ready, error: engineError } = useUciEngine()

  const userColor = userSide === 'white' ? 'w' : 'b'

  function getResultMessage(game: Chess): string {
    if (game.isCheckmate()) return t('play.checkmate')
    if (game.isStalemate()) return t('play.stalemate')
    if (game.isDraw()) return t('play.draw')
    if (game.isThreefoldRepetition()) return t('play.drawByRepetition')
    if (game.isInsufficientMaterial()) return t('play.drawByInsufficientMaterial')
    return ''
  }

  function getResultKind(game: Chess): 'checkmate' | 'draw' | null {
    if (game.isCheckmate()) return 'checkmate'
    if (game.isStalemate() || game.isDraw() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) return 'draw'
    return null
  }

  const triggerBotMove = useCallback(async () => {
    const game = gameRef.current
    if (game.isGameOver()) {
      setGameOver(true)
      setResultMsg(getResultMessage(game))
      setResultKind(getResultKind(game))
      return
    }
    if (game.turn() === userColor) return

    if (!ready || engineError) {
      console.error('Engine not ready for bot move', { ready, engineError })
      return
    }

    setBotThinking(true)
    try {
      const info = await bestMove(game.fen(), elo)
      if (!info.bestMove) return
      const move = game.move(info.bestMove, { strict: false })
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
        setResultKind(getResultKind(game))
      }
    }
  }, [bestMove, userColor, elo, t, ready, engineError])

  useEffect(() => {
    if (!userSide || gameOver || botThinking || !ready) return
    triggerBotMove()
  }, [userSide, fen, gameOver, botThinking, ready, triggerBotMove])

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
        setResultKind(getResultKind(game))
      }
      return true
    } catch {
      return false
    }
  }, [botThinking, gameOver, userSide, userColor, t])

  const startGame = (side: 'white' | 'black') => {
    gameRef.current = new Chess()
    setFen('start')
    setMoves([])
    setGameOver(false)
    setResultMsg('')
    setResultKind(null)
    setBotThinking(false)
    setUserSide(side)
    setBoardFlipped(side === 'black')
  }

  const resign = () => {
    setGameOver(true)
    setResultMsg(t('play.resign'))
    setResultKind('resigned')
  }

  const diffLabelKey = elo <= 600 ? 'beginner' : elo <= 1200 ? 'intermediate' : elo <= 2000 ? 'advanced' : elo <= 2800 ? 'expert' : 'master'

  if (!userSide) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button onClick={onBack} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-lg leading-none" title={t('play.back')}>
              <ArrowLeft size={16} className="inline-block" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{t('play.vsBot')}</h1>
        </div>
        <div className="max-w-lg mx-auto mt-16">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-8 text-center border border-[var(--color-border)]">
            <div className="text-5xl mb-4"><Bot size={20} className="inline-block" /></div>
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">{t('play.chooseColor')}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">{t('play.botPlaysOther')}</p>

            <div className="mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{t('play.difficulty')}</span>
                <span className="text-sm font-bold text-[var(--color-text)]">{t(`play.${diffLabelKey}`)}  {elo}</span>
              </div>
              <input type="range" min="200" max="3200" step="50" value={elo}
                onChange={(e) => setElo(parseInt(e.target.value))}
                className="w-full accent-[var(--color-primary)]" />
              <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>200</span>
                <span>3200</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => startGame('white')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                <Crown size={20} className="inline-block" /> {t('play.white')}
              </button>
              <button onClick={() => startGame('black')} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                <Crown size={20} className="inline-block" /> {t('play.black')}
              </button>
            </div>
            <button onClick={() => startGame(Math.random() < 0.5 ? 'white' : 'black')} className="btn-ghost mt-4 text-sm">
              <Dices size={16} className="inline-block" /> {t('play.random')}
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
            <button onClick={onBack} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-lg leading-none" title={t('play.back')}>
              <ArrowLeft size={16} className="inline-block" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{t('play.vsBot')}</h1>
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
                boardStyle: { borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
              }}
            />
            {botThinking && (
              <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="bg-[var(--color-surface)] rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  <span className="animate-spin text-lg inline-block"><Bot size={16} className="inline-block animate-spin" /></span> {t('analysis.botThinking')}
                </div>
              </div>
            )}
            {!ready && !engineError && (
              <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="bg-[var(--color-surface)] rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  <span className="animate-spin text-lg inline-block"><Bot size={16} className="inline-block animate-spin" /></span> {t('play.loadingEngine')}
                </div>
              </div>
            )}
            {gameOver && (
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-xl p-6 mx-4 text-center max-w-xs border border-[var(--color-border)]">
                  <div className="text-3xl mb-2">{resultKind === 'checkmate' ? <PartyPopper size={24} className="inline-block" /> : resultKind === 'resigned' ? <Frown size={24} className="inline-block" /> : <Handshake size={24} className="inline-block" />}</div>
                  <p className="text-lg font-semibold text-[var(--color-text)] mb-1">{resultMsg}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    {resultKind === 'checkmate'
                      ? (turn === userColor ? t('play.youLost') : t('play.youWon'))
                      : resultKind === 'resigned' ? t('play.seeYouSoon') : t('play.noWinner')}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => startGame(userSide)} className="btn-primary flex-1 text-sm">{t('play.rematch')}</button>
                    <button onClick={() => setUserSide(null)} className="btn-ghost flex-1 text-sm">{t('play.changeColor')}</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setBoardFlipped(f => !f)} className="p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title={t('analysis.flipBoard')}>
              <RotateCw size={16} className="inline-block" />
            </button>
            <button onClick={() => startGame(userSide)} className="btn-ghost text-sm">{t('play.newGame')}</button>
            <button onClick={() => setUserSide(null)} className="btn-ghost text-sm">{t('play.changeColor')}</button>
            {!gameOver && <button onClick={resign} className="btn-ghost text-sm text-[var(--color-danger)] hover:text-[var(--color-danger-hover)]"><Flag size={16} className="inline-block" /> {t('play.resign')}</button>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">{t('play.game')}</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Crown size={20} className="inline-block" /> {t('play.white')}</span>
                <span className={`font-medium ${userSide === 'white' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {userSide === 'white' ? t('play.you') : t('play.bot')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Crown size={20} className="inline-block" /> {t('play.black')}</span>
                <span className={`font-medium ${userSide === 'black' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {userSide === 'black' ? t('play.you') : t('play.bot')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                <span>{t('play.status')}: </span>
                <span className="font-medium">
                  {engineError
                    ? t('play.engineUnavailable')
                    : !ready
                      ? t('play.loadingEngine')
                      : gameOver ? resultMsg : botThinking ? t('analysis.botThinking') : turn === userColor ? t('play.yourTurn') : t('play.inProgress')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] flex flex-col max-h-[400px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] p-4 pb-2 shrink-0 border-b border-[var(--color-border)]">
              {t('play.moves', { count: moves.length })}
            </div>
            <div className="overflow-y-auto p-4 pt-0">
              {moves.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)] italic">{t('play.noMovesYet')}</p>
              ) : (
                <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm font-mono">
                  {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                    const w = moves[i * 2]
                    const b = moves[i * 2 + 1]
                    return (
                      <Fragment key={i}>
                        <span className="text-[var(--color-text-muted)] text-xs pt-0.5">{i + 1}.</span>
                        <span className={`${moves[i * 2] === w ? 'text-[var(--color-text)]' : ''}`}>{w}</span>
                        <span className={`${b ? 'text-[var(--color-text)]' : ''}`}>{b || ''}</span>
                      </Fragment>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">{t('play.capturedPieces')}</div>
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
