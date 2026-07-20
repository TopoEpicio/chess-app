import type { EvalInfo } from './interface.ts'

export interface UciScoreInfo {
  multipv: number
  mate: number | null
  evaluation: number
  depth: number
  pv: string[]
}

function getSideToMove(fen: string): 'w' | 'b' {
  return (fen.split(' ')[1] || 'w') as 'w' | 'b'
}

export function parseScoreLine(line: string): UciScoreInfo | null {
  const parts = line.trim().split(/\s+/)
  if (parts[0] !== 'info' || !parts.includes('score')) return null

  const mpIdx = parts.includes('multipv') ? parseInt(parts[parts.indexOf('multipv') + 1]) : 1
  const scoreIdx = parts.indexOf('score')
  const isMate = parts[scoreIdx + 1] === 'mate'
  const raw = parseInt(parts[scoreIdx + 2], 10)
  const depthIdx = parts.indexOf('depth')
  const depth = depthIdx !== -1 ? parseInt(parts[depthIdx + 1], 10) : 0
  const pvStart = parts.indexOf('pv')
  const pv = pvStart !== -1 ? parts.slice(pvStart + 1) : []

  return { multipv: mpIdx, mate: isMate ? raw : null, evaluation: isMate ? 0 : raw / 100, depth, pv }
}

export function parseBestMoveLine(line: string): string | null {
  const parts = line.trim().split(/\s+/)
  if (parts[0] === 'bestmove' && parts[1] && parts[1] !== '(none)') {
    return parts[1]
  }
  return null
}

export function evalInfoFromScore(
  score: UciScoreInfo,
  fen: string,
): EvalInfo {
  const isBlack = getSideToMove(fen) === 'b'
  if (score.mate !== null) {
    return { bestMove: '', evaluation: 0, mate: isBlack ? -score.mate : score.mate, depth: score.depth }
  }
  return { bestMove: '', evaluation: isBlack ? -score.evaluation : score.evaluation, mate: null, depth: score.depth }
}

export function buildPositionCommand(fen: string): string {
  return fen === 'start' ? 'position startpos' : `position fen ${fen}`
}
