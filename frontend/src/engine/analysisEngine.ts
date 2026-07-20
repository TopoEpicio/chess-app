import { Chess } from 'chess.js'
import { PatternDetector } from '@chess-app/chess-domain'
import type { MultiPvLine, TacticalPattern, Threat, AnalysisExplanation } from '../types/analysis'

const PIECE_NAME_IT: Record<string, string> = {
  p: 'Pedone', n: 'Cavallo', b: 'Alfiere', r: 'Torre', q: 'Donna', k: 'Re',
}
const PIECE_ARTICLE: Record<string, string> = {
  p: 'il', n: 'il', b: 'l\'', r: 'la', q: 'la', k: 'il',
}

function newGame(fen: string): Chess {
  if (fen === 'start') {
    return new Chess()
  }
  return new Chess(fen)
}

export function detectTacticalPatterns(fen: string): TacticalPattern[] {
  const patterns: TacticalPattern[] = []
  let game: Chess
  try {
    game = newGame(fen)
  } catch {
    return patterns
  }

  const domainThemes = PatternDetector.detect(fen, '')

  if (domainThemes.includes('checkmate')) {
    patterns.push({ type: 'checkmate', severity: 'critical', description: 'Scacco matto!' })
    return patterns
  }

  const turn = game.turn()
  const oppColor = turn === 'w' ? 'b' : 'w'
  const board = game.board()

  if (game.isCheck()) {
    const multiCheck = board.flat().filter(sq =>
      sq && sq.color === oppColor && game.moves({ square: sq.square, verbose: true }).some(m =>
        m.san.endsWith('+') || m.san.endsWith('#')
      )
    )
    if (multiCheck.length >= 2) {
      patterns.push({
        type: 'double_check',
        severity: 'critical',
        description: 'Doppio scacco! Devi muovere il Re.',
      })
    } else {
      patterns.push({ type: 'check', severity: 'warning', description: 'Scacco!' })
    }
  }

  if (domainThemes.includes('fork')) {
    for (const row of board) {
      for (const sq of row) {
        if (!sq || sq.color !== turn) continue
        const moves = game.moves({ square: sq.square, verbose: true })
        const captures = moves.filter(m => m.captured)
        if (captures.length >= 2) {
          patterns.push({
            type: 'fork',
            severity: 'warning',
            description: `${PIECE_NAME_IT[sq.type] || sq.type} in ${sq.square} attacca ${captures.map(m => `${PIECE_NAME_IT[m.captured!]} in ${m.to}`).join(' e ')}! FORK!`,
            squares: captures.map(m => m.to),
          })
        }
      }
    }
  }

  if (domainThemes.includes('hanging_piece')) {
    for (const row of board) {
      for (const sq of row) {
        if (!sq || sq.color !== oppColor) continue
        const attackers = game.attackers(sq.square, turn)
        if (attackers.length === 0) continue
        const defenders = game.attackers(sq.square, oppColor)
        if (attackers.length > defenders.length) {
          patterns.push({
            type: 'hanging_piece',
            severity: defenders.length === 0 ? 'warning' : 'info',
            description: `${PIECE_NAME_IT[sq.type]} in ${sq.square} è ${defenders.length === 0 ? 'sospeso' : 'sottodifeso'} (${attackers.length} attaccanti, ${defenders.length} difensori).`,
            squares: [sq.square],
          })
        }
      }
    }
  }

  const kingSq = game.findPiece({ type: 'k', color: oppColor })[0]
  if (kingSq) {
    const kingFile = kingSq[0]
    const kingRank = parseInt(kingSq[1])
    let pawnShield = 0
    const pawnDir = oppColor === 'w' ? 1 : -1
    for (const f of [kingFile.charCodeAt(0) - 1, kingFile.charCodeAt(0), kingFile.charCodeAt(0) + 1]) {
      if (f < 97 || f > 104) continue
      const pawnSq = String.fromCharCode(f) + (kingRank + pawnDir)
      const piece = game.get(pawnSq as any)
      if (piece && piece.type === 'p' && piece.color === oppColor) pawnShield++
    }
    if (pawnShield < 2) {
      patterns.push({
        type: 'king_exposure',
        severity: 'info',
        description: `Il Re avversario in ${kingSq} ha solo ${pawnShield} pedone${pawnShield === 1 ? '' : 'i'} di protezione. ${pawnShield === 0 ? 'Completamente esposto!' : 'Indebolito.'}`,
        squares: [kingSq],
      })
    }
  }

  const pawns = game.findPiece({ type: 'p', color: turn })
  for (const psq of pawns) {
    const rank = parseInt(psq[1])
    if ((turn === 'w' && rank >= 7) || (turn === 'b' && rank <= 2)) {
      patterns.push({
        type: 'promotion_threat',
        severity: 'warning',
        description: `Pedone in ${psq} minaccia promozione! Spingilo o proteggilo.`,
        squares: [psq],
      })
    }
  }

  return patterns
}

function detectThreats(fen: string, pv: string[]): Threat[] {
  const game = newGame(fen)
  const turn = game.turn()
  const oppColor = turn === 'w' ? 'b' : 'w'
  const threats: Threat[] = []

  const oppBoard = game.board()
  for (const row of oppBoard) {
    for (const sq of row) {
      if (!sq || sq.color !== oppColor) continue
      const moves = game.moves({ square: sq.square, verbose: true })
      for (const m of moves) {
        if (m.flags.includes('k') || m.flags.includes('q')) continue
        if (m.san.endsWith('+')) {
          threats.push({ moveSan: m.san, description: `Scacco con ${PIECE_NAME_IT[sq.type]} in ${m.to}!` })
        }
        if (m.captured && !m.san.endsWith('+')) {
          const capturedPiece = game.get(m.to as any)
          if (capturedPiece) {
            const defenders = game.attackers(m.to as any, oppColor)
            const attackers = game.attackers(m.to as any, turn)
            if (attackers.length > defenders.length || defenders.length === 0) {
              threats.push({ moveSan: m.san, description: `Cattura ${PIECE_NAME_IT[m.captured]} in ${m.to} (sottoattaccato).` })
            }
          }
        }
      }
    }
  }

  if (threats.length === 0 && pv.length >= 2) {
    const t2 = newGame(fen)
    try {
      t2.move(pv[0])
      const oppSan = t2.move(pv[1]).san
      const threatPiece = t2.get(t2.move(pv[1]).to as any)
      if (threatPiece) {
        threats.push({ moveSan: oppSan, description: `L'avversario risponde con ${oppSan} seguendo la linea principale.` })
      }
    } catch {}
  }

  return threats
}

function buildTopMoveExplanation(bestLine: MultiPvLine, patterns: TacticalPattern[], _game: Chess): string {
  const bestSan = bestLine.san

  if (patterns.some(p => p.type === 'checkmate')) {
    return `${bestSan}! Scacco matto! L'avversario non ha mosse legali.`
  }

  if (patterns.some(p => p.type === 'double_check')) {
    return `${bestSan}! Doppio scacco! L'avversario deve muovere il Re.`
  }

  const forkPattern = patterns.find(p => p.type === 'fork')
  if (forkPattern) {
    return `${bestSan}! Crea un FORK — ${forkPattern.description} L'avversario perde materiale.`
  }

  if (bestSan.endsWith('+')) {
    if (bestSan.includes('x')) {
      return `${bestSan}! Scacco + cattura! L'avversario deve parare lo scacco e tu guadagni materiale.`
    }
    return `${bestSan}! Scacco! L'avversario deve rispondere, guadagni tempo.`
  }

  if (bestSan.includes('x')) {
    const captured = bestSan.split('x')[1]
    return `${bestSan}! Cattura ${captured}. Guadagni materiale.`
  }

  const promoPattern = patterns.find(p => p.type === 'promotion_threat')
  if (promoPattern) {
    return `${bestSan}! ${promoPattern.description} L'avversario deve fermare il pedone.`
  }

  const hangingPattern = patterns.find(p => p.type === 'hanging_piece')
  if (hangingPattern && hangingPattern.severity === 'warning') {
    return `${bestSan}! Attacca ${hangingPattern.description} Guadagni materiale.`
  }

  const exposurePattern = patterns.find(p => p.type === 'king_exposure')
  if (exposurePattern) {
    return `${bestSan}! Sfrutta l'esposizione del Re avversario. ${exposurePattern.description}`
  }

  const dev = bestSan.match(/^[NBRQK]/)
  if (dev) {
    return `${bestSan}! Sviluppa ${PIECE_ARTICLE[dev[0].toLowerCase()] || 'il'} ${PIECE_NAME_IT[dev[0].toLowerCase()] || dev[0]} in ${bestSan.slice(1)}, una casa attiva che controlla il centro.`
  }

  const isPawnMove = bestSan.match(/^[a-h]/)
  if (isPawnMove) {
    const toSq = bestSan.replace('+', '').replace('#', '')
    return `${bestSan}! Spinge il pedone in ${toSq}, ${toSq[1] === '4' || toSq[1] === '5' ? 'controllando il centro.' : 'guadagnando spazio.'}`
  }

  return `${bestSan} — la mossa migliore secondo l'analisi (${bestLine.evaluation > 0 ? '+' : ''}${bestLine.evaluation.toFixed(2)}). Mantiene pressione e controllo della posizione.`
}

function buildAlternativeExplanation(best: MultiPvLine, alt: MultiPvLine, game: Chess): string {
  const absDiff = Math.abs(best.evaluation - alt.evaluation)

  if (absDiff < 0.3) {
    return `${alt.san} è simile a ${best.san} (${absDiff.toFixed(2)} di differenza). Giocabile ma ${best.evaluation > alt.evaluation ? 'meno precisa' : 'meno sicura'}.`
  }

  if (absDiff > 1.5) {
    return `${alt.san} è molto peggio di ${best.san} (${absDiff.toFixed(2)} punti persi). Permette all'avversario di prendere l'iniziativa.`
  }

  const pvStart = alt.pv.length >= 2 ? alt.pv[1] : null
  if (pvStart) {
    const t2 = newGame(game.fen())
    try {
      t2.move(alt.pv[0])
      const oppResp = t2.move(pvStart).san
      return `${alt.san} concede ${absDiff.toFixed(2)} punti. Dopo ${alt.san}, l'avversario gioca ${oppResp}.`
    } catch {}
  }

  return `${alt.san} — ${absDiff.toFixed(2)} punti peggio di ${best.san}. ${best.evaluation > alt.evaluation ? `${best.san} è più aggressiva.` : `${best.san} è più sicura.`}`
}

function formatFollowUp(pv: string[], game: Chess): string {
  if (pv.length <= 1) return ''
  const g = newGame(game.fen())
  const moves: string[] = []
  for (const uci of pv) {
    try {
      const m = g.move(uci)
      moves.push(m.san)
    } catch { break }
  }
  if (moves.length <= 1) return ''
  return moves.slice(1).join(' ')
}

function deriveConcepts(patterns: TacticalPattern[], game: Chess): string[] {
  const concepts: string[] = []

  if (patterns.some(p => p.type === 'fork')) {
    concepts.push('Cerca fork in posizioni con pezzi non protetti o Re esposto.')
    concepts.push('Il Cavallo è il re dei fork — sfrutta la sua capacità di saltare.')
  }
  if (patterns.some(p => p.type === 'checkmate')) {
    concepts.push('Ricorda i pattern di matto — spesso nascono da attacchi al Re indebolito.')
  }
  if (patterns.some(p => p.type === 'double_check')) {
    concepts.push('Il doppio scacco è devastante: solo il Re può pararlo.')
  }
  if (patterns.some(p => p.type === 'hanging_piece')) {
    concepts.push('Controlla sempre se i tuoi pezzi sono difesi. Un pezzo sospeso perde la partita.')
  }
  if (patterns.some(p => p.type === 'king_exposure')) {
    concepts.push('Un Re esposto è un invito all\'attacco. Tieni pedoni davanti al Re arroccato.')
    concepts.push('Aprire linee verso il Re avversario è spesso il piano vincente.')
  }
  if (patterns.some(p => p.type === 'promotion_threat')) {
    concepts.push('Un pedone sulla 7ª traversa vale quasi un pezzo. Spingilo!')
  }

  if (concepts.length === 0) {
    const allMoves = game.moves({ verbose: true })
    const devMoves = allMoves.filter(m => m.piece !== 'p' && m.piece !== 'k')
    if (devMoves.length > 5) {
      concepts.push('Sviluppa i pezzi prima di attaccare. Un pezzo in gioco vale più di due in casa.')
    }
    concepts.push('Valuta sempre le minacce dell\'avversario prima di fare il tuo piano.')
  }

  return concepts.slice(0, 3)
}

export function generateExplanation(params: {
  multiPv: MultiPvLine[]
  fen: string
}): AnalysisExplanation {
  const { multiPv, fen } = params
  const game = newGame(fen)
  const patterns = detectTacticalPatterns(fen)
  const bestLine = multiPv[0]
  const alts = multiPv.slice(1)

  const topMove = bestLine
    ? {
        san: bestLine.san,
        evaluation: bestLine.evaluation,
        mate: bestLine.mate,
        explanation: buildTopMoveExplanation(bestLine, patterns, game),
        followUp: formatFollowUp(bestLine.pv, game),
      }
    : {
        san: '',
        evaluation: 0,
        mate: null,
        explanation: 'Analisi non disponibile.',
        followUp: '',
      }

  const alternatives = alts.map(alt => ({
    san: alt.san,
    evaluation: alt.evaluation,
    mate: alt.mate,
    whyWorse: buildAlternativeExplanation(bestLine, alt, game),
  }))

  const threats = bestLine ? detectThreats(fen, bestLine.pv) : []
  const keyConcepts = deriveConcepts(patterns, game)

  return {
    fen,
    topMove,
    alternatives,
    threats,
    tacticalPatterns: patterns,
    keyConcepts,
  }
}
