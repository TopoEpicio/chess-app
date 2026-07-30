export function normalizeFen(fen: string): string {
  const parts = fen.split(' ')
  if (parts.length < 4) return fen
  const enPassant = parts[3]
  const noEp = enPassant === '-' || enPassant === undefined ? '-' : normalizedEnPassant(parts[0], enPassant)
  return `${parts[0]} ${parts[1]} ${parts[2]} ${noEp}`
}

function normalizedEnPassant(board: string, epSquare: string): string {
  const file = epSquare[0]
  const rank = parseInt(epSquare[1])
  const pawnRank = rank === 3 ? 4 : 5
  const leftFile = String.fromCharCode(file.charCodeAt(0) - 1)
  const rightFile = String.fromCharCode(file.charCodeAt(0) + 1)
  const rows = board.split('/')
  const pawnRow = pawnRank === 4 ? rows[4] : rows[3]
  const hasPawn = (f: string) => pawnRow?.[f.charCodeAt(0) - 'a'.charCodeAt(0)] === 'P' || pawnRow?.[f.charCodeAt(0) - 'a'.charCodeAt(0)] === 'p'
  if (file >= 'b' && hasPawn(leftFile)) return epSquare
  if (file <= 'g' && hasPawn(rightFile)) return epSquare
  return '-'
}

export function fenToKey(fen: string): string {
  return normalizeFen(fen)
}
