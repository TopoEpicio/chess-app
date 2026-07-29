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

export function findOpeningByFen(fen: string): Opening | undefined {
  const key = fen.split(' ').slice(0, 4).join(' ')
  return openings.find((o) => o.fen === key || o.variations.some((v) => v.fen === key))
}

export function findOpeningVariation(fen: string): { opening: Opening; variation: OpeningVariation } | undefined {
  const key = fen.split(' ').slice(0, 4).join(' ')
  for (const opening of openings) {
    const variation = opening.variations.find((v) => v.fen === key)
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
