import {
  openings as precompiledOpenings,
  type Opening,
  type OpeningVariation,
} from './openings_precompiled'

export type { Opening, OpeningVariation }
export { precompiledOpenings as openings }

const openings = precompiledOpenings

export interface OpeningMatch {
  opening: Opening
  variation: OpeningVariation
  ply: number
}

// ---------------------------------------------------------------------------
// Move-prefix trie (lazy, built once, cached)
//
// Every variation is a SAN move list. We insert each variation into a trie
// keyed by SAN move and record the opening/variation at *every* node along
// the path (i.e. after every ply). A lookup then walks the supplied moves and
// keeps the deepest node that carries a match, so the most specific known
// line wins. The trie is built on the first findOpeningByMoves() call and
// reused afterwards.
// ---------------------------------------------------------------------------

interface TrieNode {
  children: Map<string, TrieNode>
  // Best match at this node: variation whose path length is closest to node
  // depth (terminates at or just after this node). Ties broken by longer
  // variation, then opening name.
  match?: { opening: Opening; variation: OpeningVariation; length: number }
}

let trieRoot: TrieNode | null = null

function buildTrie(): TrieNode {
  const root: TrieNode = { children: new Map() }
  for (const opening of openings) {
    for (const variation of opening.variations) {
      let node = root
      for (let i = 0; i < variation.moves.length; i++) {
        const move = variation.moves[i]
        let child = node.children.get(move)
        if (!child) {
          child = { children: new Map() }
          node.children.set(move, child)
        }
        node = child
        const d = i + 1
        const L = variation.moves.length
        const newDiff = Math.abs(L - d)
        if (!node.match) {
          node.match = { opening, variation, length: L }
        } else {
          const old = node.match
          const oldDiff = Math.abs(old.length - d)
          let replace = false
          if (newDiff < oldDiff) replace = true
          else if (newDiff === oldDiff) {
            if (L > old.length) replace = true
            else if (L === old.length && opening.name < old.opening.name) replace = true
          }
          if (replace) {
            node.match = { opening, variation, length: L }
          }
        }
      }
    }
  }
  return root
}

function ensureTrie(): TrieNode {
  if (!trieRoot) trieRoot = buildTrie()
  return trieRoot
}

/**
 * Fast path: resolve a game (as a SAN move list) to the deepest opening
 * variation it matches. Returns `undefined` for an empty list or when no
 * prefix is recognised.
 */
export function findOpeningByMoves(moves: string[]): OpeningMatch | undefined {
  if (!moves || moves.length === 0) return undefined
  const root = ensureTrie()

  let node = root
  let best: OpeningMatch | undefined
  let ply = 0
  for (const move of moves) {
    const child = node.children.get(move)
    if (!child) break
    node = child
    ply++
    if (node.match) {
      best = { opening: node.match.opening, variation: node.match.variation, ply }
    }
  }
  return best
}

// ---------------------------------------------------------------------------
// FEN compatibility path (finals only, no trie)
//
// The precompiled dataset stores board-only FENs (piece placement only, no
// active colour / castling / en-passant). We therefore match on the piece
// placement field and treat the side to move as a wildcard: a stored board-only
// FEN matches either colour, which is exactly the "probe both colours" behaviour
// needed when a caller passes a bare placement. When both sides do carry an
// explicit colour it must agree.
// ---------------------------------------------------------------------------

function placementOf(fen: string): string {
  const space = fen.indexOf(' ')
  return space === -1 ? fen : fen.slice(0, space)
}

function colorOf(fen: string): string | undefined {
  const parts = fen.split(' ', 2)
  const color = parts[1]
  return color === 'w' || color === 'b' ? color : undefined
}

function matchesFen(
  stored: string,
  targetPlacement: string,
  targetColor: string | undefined,
): boolean {
  if (placementOf(stored) !== targetPlacement) return false
  const storedColor = colorOf(stored)
  // Board-only stored FENs match either colour (probe both).
  if (storedColor && targetColor && storedColor !== targetColor) return false
  return true
}

export function findOpeningByFen(fen: string): Opening | undefined {
  const targetPlacement = placementOf(fen)
  const targetColor = colorOf(fen)

  for (const opening of openings) {
    if (opening.fen && matchesFen(opening.fen, targetPlacement, targetColor)) {
      return opening
    }
  }
  for (const opening of openings) {
    for (const variation of opening.variations) {
      if (variation.fen && matchesFen(variation.fen, targetPlacement, targetColor)) {
        return opening
      }
    }
  }
  return undefined
}

export function findOpeningVariation(
  fen: string,
): { opening: Opening; variation: OpeningVariation } | undefined {
  const targetPlacement = placementOf(fen)
  const targetColor = colorOf(fen)

  for (const opening of openings) {
    for (const variation of opening.variations) {
      if (variation.fen && matchesFen(variation.fen, targetPlacement, targetColor)) {
        return { opening, variation }
      }
    }
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
