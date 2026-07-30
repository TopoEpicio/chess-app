import type { CardState, ReviewInput, ReviewResult, ReviewQuality } from './types'

const INITIAL_EASE = 2.5
const MIN_EASE = 1.3
const MAX_EASE = 3.0
const EASE_BOOST = 0.15
const EASE_PENALTY = 0.2
const WEIGHT_FACTORS: Record<number, number> = {
  5: 0.6, 4: 0.8, 3: 1.0, 2: 1.2, 1: 1.4,
}

export function createCard(input: ReviewInput): CardState {
  return {
    fenKey: input.fenKey,
    nodeIds: [...input.nodeIds],
    expectedMoves: [...input.expectedMoves],
    interval: 0,
    ease: INITIAL_EASE,
    consecutiveCorrect: 0,
    forgets: 0,
    dueDate: Date.now(),
    totalReviews: 0,
    totalCorrect: 0,
  }
}

export function reviewCard(card: CardState, quality: ReviewQuality, weight = 3): ReviewResult {
  const prevEase = card.ease

  if (quality === 'correct') {
    const next = scheduleNext(card, weight)
    return {
      state: {
        ...card,
        interval: next,
        ease: Math.min(MAX_EASE, card.ease + EASE_BOOST),
        consecutiveCorrect: card.consecutiveCorrect + 1,
        dueDate: Date.now() + next * 86400000,
        totalReviews: card.totalReviews + 1,
        totalCorrect: card.totalCorrect + 1,
      },
      quality,
      previousEase: prevEase,
    }
  }

  if (quality === 'incorrect') {
    return {
      state: {
        ...card,
        interval: 0,
        ease: Math.max(MIN_EASE, card.ease - EASE_PENALTY),
        consecutiveCorrect: 0,
        forgets: card.forgets + 1,
        dueDate: Date.now(),
        totalReviews: card.totalReviews + 1,
      },
      quality,
      previousEase: prevEase,
    }
  }

  return {
    state: {
      ...card,
      consecutiveCorrect: 0,
      dueDate: Date.now(),
      totalReviews: card.totalReviews + 1,
      totalCorrect: card.totalCorrect + 1,
    },
    quality,
    previousEase: prevEase,
  }
}

function scheduleNext(card: CardState, weight: number): number {
  let interval: number
  if (card.consecutiveCorrect === 0) {
    interval = 1
  } else if (card.consecutiveCorrect === 1) {
    interval = 3
  } else {
    interval = Math.round(card.interval * card.ease)
  }
  const factor = WEIGHT_FACTORS[weight] ?? 1.0
  return Math.max(1, Math.round(interval * factor))
}

export function deriveCardsFromTree(
  treeNodes: { id: string; fen: string; childrenIds: string[]; parentId: string | null }[],
  userSide: 'w' | 'b',
): ReviewInput[] {
  const cardMap = new Map<string, ReviewInput>()

  for (const node of treeNodes) {
    if (!node.parentId) continue
    const turn = node.fen.split(' ')[1]
    if (turn !== userSide) continue
    if (node.childrenIds.length === 0) continue

    const fenKey = node.fen.split(' ').slice(0, 4).join(' ')

    if (!cardMap.has(fenKey)) {
      cardMap.set(fenKey, {
        fenKey,
        nodeIds: [],
        expectedMoves: [],
      })
    }
    const card = cardMap.get(fenKey)!
    card.nodeIds.push(node.id)
    card.expectedMoves.push(...node.childrenIds.map((cid) => {
      const parent = treeNodes.find((n) => n.id === node.id)
      return parent?.id ?? ''
    }))
  }

  return Array.from(cardMap.values())
}
