import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')
const THUMB_DIR = resolve(__dirname, '../public/thumbnails/openings')

interface OpeningEntry {
  id: string
  name: string
  fen: string
}

const PIECES: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
}

const SQ = 30
const BOARD = SQ * 8
const PX = 80
const PY = 25
const W = BOARD + PX * 2
const H = BOARD + PY * 2 + 18

function parseFen(fen: string): string[][] {
  const board: string[][] = []
  for (const rank of fen.split(' ')[0].split('/')) {
    const row: string[] = []
    for (const ch of rank) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < +ch; i++) row.push('')
      } else {
        row.push(ch)
      }
    }
    board.push(row)
  }
  return board
}

function genSvg(id: string, name: string, fen: string): string {
  const board = parseFen(fen)
  const label = name.length > 22 ? name.slice(0, 20) + '…' : name

  let squares = ''
  let pieces = ''

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const x = PX + c * SQ
      const y = PY + r * SQ
      const fill = (r + c) % 2 === 0 ? '#f5f3eb' : '#558855'
      squares += `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" fill="${fill}"/>`

      const p = board[r][c]
      if (p && PIECES[p]) {
        const isWhite = p === p.toUpperCase()
        const fillColor = isWhite ? '#ffffff' : '#1a1a1a'
        const strokeWidth = isWhite ? '1.8' : '0.6'
        const strokeColor = isWhite ? '#333333' : '#cccccc'
        pieces += `<text x="${x + SQ / 2}" y="${y + SQ / 2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="26" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" paint-order="stroke">${PIECES[p]}</text>`
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f4f5f2" rx="8"/>
  <g filter="url(#s)">
    ${squares}
    ${pieces}
  </g>
  <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#3a4234">${label}</text>
  <defs><filter id="s"><feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#000" flood-opacity="0.18"/></filter></defs>
</svg>`
}

function main() {
  const openings = JSON.parse(
    readFileSync(resolve(DATA_DIR, 'openings.generated.json'), 'utf-8'),
  ) as OpeningEntry[]

  const map = new Map(openings.map((o) => [o.id, o]))

  const slugs = [
    'italian-game', 'ruy-lopez', 'sicilian-defense', 'french-defense',
    'caro-kann', 'queens-gambit', 'kings-indian', 'english-opening',
    'scotch-game', 'kings-gambit', 'london-system', 'nimzo-indian',
    'scandinavian-defense', 'pirc-defense', 'dutch-defense', 'benoni',
    'alekhine-defense', 'grunfeld', 'vienna-game', 'bird-opening',
    'philidor', 'petrov',
  ]

  let count = 0
  for (const slug of slugs) {
    const o = map.get(slug)
    if (!o) { console.warn(`  SKIP ${slug}: not found`); continue }
    writeFileSync(resolve(THUMB_DIR, `${slug}.svg`), genSvg(o.id, o.name, o.fen), 'utf-8')
    count++
    console.log(`  OK  ${slug} → ${o.name}`)
  }

  console.log(`\nGenerated ${count} thumbnails`)
}

main()
