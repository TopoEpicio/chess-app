import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { Chess } from 'chess.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')

interface OpeningVariation {
  name: string
  moves: string[]
  fen: string
}

interface Opening {
  id: string
  name: string
  fen: string
  eco?: string
  variations: OpeningVariation[]
}

interface ChesskitEntry {
  name: string
  fen: string
}

function computeFens(moves: string[]): string {
  const game = new Chess()
  for (const m of moves) game.move(m)
  const fen = game.fen()
  return fen.split(' ').slice(0, 4).join(' ')
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  const { RAW_OPENINGS } = await import(pathToFileURL(resolve(DATA_DIR, 'openings-source.ts')).href)
  const existingFens = new Set<string>()

  const existingOpenings: Opening[] = RAW_OPENINGS.map((raw: any) => {
    const variations = raw.variations.map((v: any) => {
      const f = computeFens(v.moves)
      existingFens.add(f)
      return { name: v.name, moves: v.moves, fen: f }
    })
    const f = variations[0].fen
    existingFens.add(f)
    return { id: raw.id, name: raw.name, eco: raw.eco, fen: f, variations }
  })

  const chesskitPath = resolve(DATA_DIR, 'openings-chesskit.json')
  const chesskitData: ChesskitEntry[] = JSON.parse(readFileSync(chesskitPath, 'utf-8'))

  let added = 0
  let skippedFen = 0
  let mergedVars = 0
  for (const entry of chesskitData) {
    const parts = entry.fen.split(' ')
    const fenKey = parts.length >= 4
      ? parts.slice(0, 4).join(' ')
      : entry.fen
    if (existingFens.has(fenKey)) { skippedFen++; continue }

    const ckId = slugify(entry.name)
    const existing = existingOpenings.find((o) => o.id === ckId)
    if (existing) {
      existing.variations.push({ name: entry.name, moves: [], fen: fenKey })
      existingFens.add(fenKey)
      mergedVars++
      continue
    }

    existingOpenings.push({ id: ckId, name: entry.name, fen: fenKey, variations: [] })
    existingFens.add(fenKey)
    added++
  }

  const outPath = resolve(DATA_DIR, 'openings.generated.json')
  writeFileSync(outPath, JSON.stringify(existingOpenings, null, 2), 'utf-8')
  console.log(`Generated: ${existingOpenings.length} openings`)
  console.log(`  Existing (RAW): ${RAW_OPENINGS.length}`)
  console.log(`  Added from Chesskit: ${added}`)
  console.log(`  Merged as variations: ${mergedVars}`)
  console.log(`  Skipped (duplicate FEN): ${skippedFen}`)
}

main().catch(console.error)
