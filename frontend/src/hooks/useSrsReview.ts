import { useState, useCallback, useMemo } from 'react'
import { createCard, reviewCard } from '../domain/srs/SrsEngine'
import { LocalStorageRepo } from '../persistence/LocalStorageRepo'
import type { CardState, ReviewQuality } from '../domain/srs/types'
import type { TreeState, TreeNode } from '../domain/tree/types'

const cardRepo = new LocalStorageRepo<CardState>('srs-cards')

function deriveCardsFromTree(tree: TreeState, side: 'white' | 'black'): CardState[] {
  const userTurn = side === 'white' ? 'w' : 'b'
  const cards: CardState[] = []
  const seenFens = new Set<string>()

  for (const node of Object.values(tree.nodes)) {
    if (!node.parentId) continue
    const turn = node.fen.split(' ')[1]
    if (turn !== userTurn) continue
    if (node.childrenIds.length === 0) continue

    const fenKey = node.fen.split(' ').slice(0, 4).join(' ')
    if (seenFens.has(fenKey)) continue
    seenFens.add(fenKey)

    const expectedMoves = node.childrenIds
      .map(cid => tree.nodes[cid]?.move)
      .filter(Boolean) as string[]

    cards.push(createCard({
      fenKey: node.fen,
      nodeIds: [node.id],
      expectedMoves,
    }))
  }

  return cards
}

export function useSrsReview() {
  const [cards, setCards] = useState<CardState[]>(() => {
    const all = cardRepo.getAll()
    return all.length > 0 ? all : []
  })

  const dueCards = useMemo(() =>
    cards.filter(c => c.dueDate <= Date.now()).sort((a, b) => a.dueDate - b.dueDate),
  [cards])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [history, setHistory] = useState<{ fenKey: string; quality: ReviewQuality }[]>([])
  const [sessionComplete, setSessionComplete] = useState(false)

  const currentCard = dueCards[currentIdx] ?? null

  const generateCardsFromTree = useCallback((tree: TreeState, side: 'white' | 'black', courseId: string) => {
    const newCards = deriveCardsFromTree(tree, side)
    const merged = [...cards]

    for (const nc of newCards) {
      const existing = merged.findIndex(c => c.fenKey === nc.fenKey)
      if (existing >= 0) {
        merged[existing] = {
          ...merged[existing],
          nodeIds: [...new Set([...merged[existing].nodeIds, ...nc.nodeIds])],
          expectedMoves: [...new Set([...merged[existing].expectedMoves, ...nc.expectedMoves])],
        }
      } else {
        merged.push(nc)
      }
    }

    merged.forEach(c => cardRepo.set(c.fenKey, c))
    setCards(merged)
  }, [cards])

  const submitReview = useCallback((quality: ReviewQuality) => {
    if (!currentCard) return

    const weight = 3
    const result = reviewCard(currentCard, quality, weight)
    cardRepo.set(result.state.fenKey, result.state)

    setCards(prev => prev.map(c =>
      c.fenKey === result.state.fenKey ? result.state : c,
    ))
    setHistory(prev => [...prev, { fenKey: currentCard.fenKey, quality }])

    if (currentIdx + 1 >= dueCards.length) {
      setSessionComplete(true)
    } else {
      setCurrentIdx(i => i + 1)
    }
  }, [currentCard, currentIdx, dueCards.length])

  const resetSession = useCallback(() => {
    setCurrentIdx(0)
    setHistory([])
    setSessionComplete(false)
  }, [])

  const stats = useMemo(() => ({
    total: cards.length,
    due: dueCards.length,
    reviewed: history.length,
    correct: history.filter(h => h.quality === 'correct').length,
    incorrect: history.filter(h => h.quality === 'incorrect').length,
  }), [cards, dueCards, history])

  return {
    currentCard,
    stats,
    history,
    sessionComplete,
    submitReview,
    resetSession,
    generateCardsFromTree,
    currentIdx,
    totalDue: dueCards.length,
  }
}
