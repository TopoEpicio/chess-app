import { Bot, PartyPopper, Frown, Handshake } from 'lucide-react'
import { Chessboard } from '../../components/board/ThemedBoard'
import { EvalBar } from '../../components/board/EvalBar'
import type { EvalInfo } from '../../types/analysis'

interface BoardSectionProps {
  fen: string
  boardFlipped: boolean
  showEval: boolean
  lastEval: EvalInfo | null
  ready: boolean
  botThinking: boolean
  gameOver: boolean
  resultMsg: string
  turn: 'w' | 'b'
  userColor: 'w' | 'b'
  pmDisplay: { from: string; to: string } | null
  onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => boolean
  onSquareClick: ({ piece, square }: { piece: { pieceType: string } | null; square: string }) => void
  squareStyles: Record<string, React.CSSProperties> | undefined
  onRematch: () => void
  onChangeColor: () => void
  userSide: 'white' | 'black'
}

export function BoardSection({
  fen,
  boardFlipped,
  showEval,
  lastEval,
  ready,
  botThinking,
  gameOver,
  resultMsg,
  turn,
  userColor,
  pmDisplay,
  onPieceDrop,
  onSquareClick,
  squareStyles,
  onRematch,
  onChangeColor,
  userSide,
}: BoardSectionProps) {
  return (
    <div className="flex gap-3 items-start">
      <div style={{ display: showEval ? 'flex' : 'none', width: 40, height: 520 }} className="shrink-0">
        <EvalBar evalInfo={lastEval} engineReady={ready} boardOrientation={boardFlipped ? 'black' : 'white'} />
      </div>
      <div className="relative" style={{ width: 520, aspectRatio: '1/1' }}>
        <Chessboard
          options={{
            id: 'play-board',
            position: fen === 'start' ? undefined : fen,
            boardOrientation: boardFlipped ? 'black' : 'white',
            onPieceDrop,
            onSquareClick,
            squareStyles,
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
                <button onClick={onRematch} className="btn-primary flex-1 text-sm">Rivincita</button>
                <button onClick={onChangeColor} className="btn-ghost flex-1 text-sm">Cambia colore</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}