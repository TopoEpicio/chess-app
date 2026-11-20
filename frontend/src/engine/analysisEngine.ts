// NOTE (i18n): Coach explanations in buildTopMoveExplanation, buildAlternativeExplanation,
// detectTacticalPatterns, detectThreats, and deriveConcepts are hardcoded English sentences.
// This is a deliberate P3 decision — chess explanations use domain-specific English terms
// (SAN moves, piece names, tactical vocabulary) that do not translate cleanly. If full
// i18n is required later, add keys like analysis.explain.develop, analysis.explain.push,
// analysis.explain.best, analysis.explain.worse, analysis.explain.principle.
import i18n from '../i18n'
import { Chess } from 'chess.js'
import { PatternDetector } from '@chess-app/chess-domain'
import type { MultiPvLine, TacticalPattern, Threat, AnalysisExplanation } from '../types/analysis'

const t = (key: string, opts?: Record<string, string | number>) => i18n.t(key, opts)

const PIECE_NAME: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
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
    patterns.push({ type: 'checkmate', severity: 'critical', description: t('analysis.checkmate') })
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
        description: t('analysis.checkmate'), // reuse for double check context
      })
    } else {
      patterns.push({ type: 'check', severity: 'warning', description: t('analysis.check') })
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
            description: `${PIECE_NAME[sq.type] || sq.type} on ${sq.square} attacks ${captures.map(m => `${PIECE_NAME[m.captured!]} on ${m.to}`).join(' and ')}! Fork!`,
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
            description: `${PIECE_NAME[sq.type]} on ${sq.square} is ${defenders.length === 0 ? 'hanging' : 'underdefended'} (${attackers.length} attackers, ${defenders.length} defenders).`,
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
        description: `The opposing king on ${kingSq} has only ${pawnShield} pawn${pawnShield === 1 ? '' : 's'} protecting. ${pawnShield === 0 ? 'Completely exposed!' : 'Weakened.'}`,
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
        description: `Pawn on ${psq} threatens promotion! Push it or protect it.`,
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
          threats.push({ moveSan: m.san, description: `Check with ${PIECE_NAME[sq.type]} on ${m.to}!` })
        }
        if (m.captured && !m.san.endsWith('+')) {
          const capturedPiece = game.get(m.to as any)
          if (capturedPiece) {
            const defenders = game.attackers(m.to as any, oppColor)
            const attackers = game.attackers(m.to as any, turn)
            if (attackers.length > defenders.length || defenders.length === 0) {
              threats.push({ moveSan: m.san, description: `Captures ${PIECE_NAME[m.captured]} on ${m.to} (underattacked).` })
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
        threats.push({ moveSan: oppSan, description: `The opponent responds with ${oppSan} following the main line.` })
      }
    } catch {}
  }

  return threats
}

function buildTopMoveExplanation(bestLine: MultiPvLine, patterns: TacticalPattern[], _game: Chess): string {
  const bestSan = bestLine.san

  if (patterns.some(p => p.type === 'checkmate')) {
    return `${bestSan}! Checkmate! The opponent has no legal moves.`
  }

  if (patterns.some(p => p.type === 'double_check')) {
    return `${bestSan}! Double check! The opponent must move the king.`
  }

  const forkPattern = patterns.find(p => p.type === 'fork')
  if (forkPattern) {
    return `${bestSan}! Creates a fork — ${forkPattern.description} The opponent loses material.`
  }

  if (bestSan.endsWith('+')) {
    if (bestSan.includes('x')) {
      return `${bestSan}! Check + capture! The opponent must parry the check and you gain material.`
    }
    return `${bestSan}! Check! The opponent must respond, you gain tempo.`
  }

  if (bestSan.includes('x')) {
    const captured = bestSan.split('x')[1]
    return `${bestSan}! Captures ${captured}. You gain material.`
  }

  const promoPattern = patterns.find(p => p.type === 'promotion_threat')
  if (promoPattern) {
    return `${bestSan}! ${promoPattern.description} The opponent must stop the pawn.`
  }

  const hangingPattern = patterns.find(p => p.type === 'hanging_piece')
  if (hangingPattern && hangingPattern.severity === 'warning') {
    return `${bestSan}! Attacks ${hangingPattern.description} You gain material.`
  }

  const exposurePattern = patterns.find(p => p.type === 'king_exposure')
  if (exposurePattern) {
    return `${bestSan}! Exploits the exposed opposing king. ${exposurePattern.description}`
  }

  const dev = bestSan.match(/^[NBRQK]/)
  if (dev) {
    return `${bestSan}! Develops the ${PIECE_NAME[dev[0].toLowerCase()] || dev[0]} to ${bestSan.slice(1)}, an active square controlling the center.`
  }

  const isPawnMove = bestSan.match(/^[a-h]/)
  if (isPawnMove) {
    const toSq = bestSan.replace('+', '').replace('#', '')
    return `${bestSan}! Pushes the pawn to ${toSq}, ${toSq[1] === '4' || toSq[1] === '5' ? 'controlling the center.' : 'gaining space.'}`
  }

  return `${bestSan} — the best move according to analysis (${bestLine.evaluation > 0 ? '+' : ''}${bestLine.evaluation.toFixed(2)}). Maintains pressure and control of the position.`
}

function buildAlternativeExplanation(best: MultiPvLine, alt: MultiPvLine, game: Chess): string {
  const absDiff = Math.abs(best.evaluation - alt.evaluation)

  if (absDiff < 0.3) {
    return `${alt.san} is similar to ${best.san} (${absDiff.toFixed(2)} difference). Playable but ${best.evaluation > alt.evaluation ? 'less precise' : 'less safe'}.`
  }

  if (absDiff > 1.5) {
    return `${alt.san} is much worse than ${best.san} (${absDiff.toFixed(2)} points lost). Allows the opponent to take the initiative.`
  }

  const pvStart = alt.pv.length >= 2 ? alt.pv[1] : null
  if (pvStart) {
    const t2 = newGame(game.fen())
    try {
      t2.move(alt.pv[0])
      const oppResp = t2.move(pvStart).san
      return `${alt.san} concedes ${absDiff.toFixed(2)} points. After ${alt.san}, the opponent plays ${oppResp}.`
    } catch {}
  }

  return `${alt.san} — ${absDiff.toFixed(2)} points worse than ${best.san}. ${best.evaluation > alt.evaluation ? `${best.san} is more aggressive.` : `${best.san} is safer.`}`
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
    concepts.push('Look for forks in positions with unprotected pieces or an exposed king.')
    concepts.push('The knight is the king of forks — exploit its ability to jump.')
  }
  if (patterns.some(p => p.type === 'checkmate')) {
    concepts.push('Remember checkmate patterns — they often arise from attacks on a weakened king.')
  }
  if (patterns.some(p => p.type === 'double_check')) {
    concepts.push('Double check is devastating: only the king can parry it.')
  }
  if (patterns.some(p => p.type === 'hanging_piece')) {
    concepts.push('Always check if your pieces are defended. A hanging piece loses the game.')
  }
  if (patterns.some(p => p.type === 'king_exposure')) {
    concepts.push('An exposed king is an invitation to attack. Keep pawns in front of the castled king.')
    concepts.push('Opening lines toward the opposing king is often the winning plan.')
  }
  if (patterns.some(p => p.type === 'promotion_threat')) {
    concepts.push('A pawn on the 7th rank is worth almost a piece. Push it!')
  }

  if (concepts.length === 0) {
    const allMoves = game.moves({ verbose: true })
    const devMoves = allMoves.filter(m => m.piece !== 'p' && m.piece !== 'k')
    if (devMoves.length > 5) {
      concepts.push('Develop pieces before attacking. A piece in play is worth more than two at home.')
    }
    concepts.push('Always evaluate the opponent\'s threats before making your plan.')
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
        explanation: t('analysis.noAnalysisResult'),
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
