import generatedOpenings from './openings.generated.json'

export interface OpeningVariation {
  name: string
  moves: string[]
  fen: string
}

export interface Opening {
  id: string
  name: string
  fen: string
  eco?: string
  variations: OpeningVariation[]
}

export const openings: Opening[] = generatedOpenings as Opening[]

/** Compare two FENs using the minimum shared field count.
 *  Query FENs have 6+ fields; stored FENs may have 1-4 fields.
 *  Comparing by the lower count ensures 1-field stored FENs
 *  (board-only, ~96% of the database) still match while
 *  4-field stored FENs still distinguish castling rights. */
function matchFen(a: string, b: string): boolean {
  const aParts = a.split(' ')
  const bParts = b.split(' ')
  const fields = Math.min(aParts.length, bParts.length, 4)
  return aParts.slice(0, fields).join(' ') === bParts.slice(0, fields).join(' ')
}

export function findOpeningByFen(fen: string): Opening | undefined {
  return openings.find((o) => matchFen(o.fen, fen) || o.variations.some((v) => matchFen(v.fen, fen)))
}

export function findOpeningVariation(fen: string): { opening: Opening; variation: OpeningVariation } | undefined {
  for (const opening of openings) {
    const variation = opening.variations.find((v) => matchFen(v.fen, fen))
    if (variation) return { opening, variation }
  }
  return undefined
}

export function searchOpenings(query: string): Opening[] {
  if (!query) return openings
  const q = query.toLowerCase()
  return openings.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.variations.some((v) => v.name.toLowerCase().includes(q)),
  )
}
