import { Chess } from 'chess.js'

export interface ParsedMove {
  fen: string
  san: string
  annotation: string
  depth: number
}

export interface ParsedVariation {
  name: string
  description: string
  moves: ParsedMove[]
  notes: string[]
}

export interface ParsedRepertoire {
  openingName: string
  variations: ParsedVariation[]
}

const ITALIAN_TO_ENGLISH: Record<string, string> = {
  C: 'N', A: 'B', D: 'Q', R: 'K', T: 'R',
}

function isChessMove(token: string): boolean {
  if (/^O-O(?:-O)?[+#]?$/.test(token)) return true
  if (/^[KQRBNACDT]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[\+#]?$/.test(token) && token.length <= 7) return true
  return false
}

function normalizeMove(move: string): string {
  const first = move[0]
  const piece = ITALIAN_TO_ENGLISH[first]
  if (piece) return piece + move.slice(1)
  if (first >= 'A' && first <= 'Z') return move
  const upper = move.toUpperCase()
  const ooMatch = upper.match(/^O-O(?:-O)?/)
  if (ooMatch) return ooMatch[0]
  return move
}

export function parseRepertoireText(text: string): ParsedRepertoire {
  const lines = text.split('\n')
  const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0)

  const openingLine = cleanLines.find(l => l.startsWith('# ') && !l.startsWith('## '))
  const openingName = openingLine
    ? openingLine.replace(/^#\s*/, '').replace(/\*\*/g, '').trim()
    : 'Repertorio'

  const sections: string[][] = []
  let current: string[] = []
  for (const line of cleanLines) {
    if (line.startsWith('## ')) {
      if (current.length > 0) { sections.push(current); current = [] }
    }
    if (!line.startsWith('# ')) current.push(line)
  }
  if (current.length > 0) sections.push(current)

  const variations: ParsedVariation[] = sections.map(parseVariation).filter(v => v.moves.length > 0)

  return { openingName, variations }
}

function parseVariation(lines: string[]): ParsedVariation {
  const nameLine = lines.find(l => l.startsWith('## '))
  const name = nameLine
    ? nameLine.replace(/^##\s*/, '').replace(/\*\*/g, '').trim()
    : 'Variazione'

  const contentLines = lines.filter(l => !l.startsWith('## '))

  const notes = contentLines
    .filter(l => l.startsWith('>'))
    .map(l => l.replace(/^>\s*/, '').trim())

  const mainLines = contentLines.filter(l => !l.startsWith('>'))

  const allAnnotations: { san: string; annotation: string }[] = []
  const moveTokens: string[] = []

  for (const line of mainLines) {
    const noBrackets = line.replace(/\[([^\]]*)\]/g, (_, c) => {
      allAnnotations.push({ san: '', annotation: c.trim() })
      return ''
    }).trim()

    const parts = noBrackets.split(/\s+/)
    for (const part of parts) {
      if (/^\d+\.\.\.$/.test(part) || /^\d+\.$/.test(part)) continue
      if (isChessMove(part)) {
        moveTokens.push(part)
      }
    }
  }

  if (moveTokens.length === 0) return { name, description: '', moves: [], notes }

  const normalizedTokens = moveTokens.map(normalizeMove)

  let pgn = ''
  for (let i = 0; i < normalizedTokens.length; i++) {
    const moveNum = Math.floor(i / 2) + 1
    if (i % 2 === 0) pgn += `${moveNum}. `
    pgn += normalizedTokens[i] + ' '
  }

  let moves: ParsedMove[] = []
  try {
    const game = new Chess()
    game.loadPgn(pgn.trim())
    const history = game.history({ verbose: true })

    const tempGame = new Chess()
    for (let i = 0; i < history.length; i++) {
      tempGame.move(history[i].san)
      const san = history[i].san
      const originalSan = moveTokens[i] || san
      const matchedAnnotation = allAnnotations.find(a => a.san === '' || a.san === san)
      const inlineAnnotation = matchedAnnotation ? matchedAnnotation.annotation : ''
      const lineAnnotation = (mainLines.join(' ').match(new RegExp(`${san}\\s*\\[([^\\]]*)\\]`)))?.[1] || ''
      moves.push({
        fen: tempGame.fen(),
        san: originalSan,
        annotation: inlineAnnotation || lineAnnotation,
        depth: i + 1,
      })
    }
  } catch {
    const tempGame = new Chess()
    for (let i = 0; i < normalizedTokens.length; i++) {
      try {
        tempGame.move(normalizedTokens[i])
        const originalSan = moveTokens[i]
        const lineAnnotation = (mainLines.join(' ').match(new RegExp(`${normalizedTokens[i]}\\s*\\[([^\\]]*)\\]`)))?.[1] || ''
        moves.push({
          fen: tempGame.fen(),
          san: originalSan || normalizedTokens[i],
          annotation: lineAnnotation,
          depth: i + 1,
        })
      } catch { break }
    }
  }

  const descLines = mainLines.filter(l => {
    if (/^\d/.test(l)) return false
    if (l.startsWith('>')) return false
    if (moveTokens.some(m => l.includes(m))) return false
    return true
  })
  const description = descLines.join(' ').trim()

  return { name, description, moves, notes }
}