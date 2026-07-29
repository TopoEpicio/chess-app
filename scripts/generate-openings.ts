import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { Chess } from 'chess.js'

const DATA_DIR = resolve(import.meta.dirname, '../frontend/src/data')

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
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  // 1. Load RAW_OPENINGS from exported module
  const { RAW_OPENINGS } = await import(resolve(DATA_DIR, 'openings.ts'))

  // 2. Build existing openings
  const existingOpenings: Opening[] = RAW_OPENINGS.map((raw: any) => {
    const variations = raw.variations.map((v: any) => ({
      name: v.name,
      moves: v.moves,
      fen: computeFens(v.moves),
    }))
    return {
      id: raw.id,
      name: raw.name,
      eco: raw.eco,
      fen: variations[0].fen,
      variations,
    }
  })

  // 3. Build a set of existing FENs for dedup
  const existingFens = new Set<string>()
  for (const o of existingOpenings) {
    existingFens.add(o.fen)
    for (const v of o.variations) existingFens.add(v.fen)
  }

  // 4. Load Chesskit data
  const chesskitPath = resolve(DATA_DIR, 'openings-chesskit.json')
  const chesskitData: ChesskitEntry[] = JSON.parse(readFileSync(chesskitPath, 'utf-8'))

  // 5. Merge
  let added = 0
  let skipped = 0
  for (const entry of chesskitData) {
    const parts = entry.fen.split(' ')
    const fenKey = parts.length >= 4
      ? parts.slice(0, 4).join(' ')
      : entry.fen

    if (existingFens.has(fenKey)) {
      skipped++
      continue
    }

    existingOpenings.push({
      id: slugify(entry.name),
      name: entry.name,
      fen: fenKey,
      variations: [],
    })
    existingFens.add(fenKey)
    added++
  }

  // 6. Write output
  const outPath = resolve(DATA_DIR, 'openings.generated.json')
  writeFileSync(outPath, JSON.stringify(existingOpenings, null, 2), 'utf-8')
  console.log(`Generated: ${existingOpenings.length} openings`)
  console.log(`  Existing: ${RAW_OPENINGS.length}`)
  console.log(`  Added from Chesskit: ${added}`)
  console.log(`  Skipped (duplicate): ${skipped}`)
}

main().catch(console.error)
