import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveUserOpening,
  listUserOpenings,
  isDuplicateFen,
  deleteUserOpening,
} from '../userOpenings'
import { openDB, deleteDB } from 'idb'

async function clearStore() {
  await deleteDB('chess-app-user-openings')
}

describe('userOpenings', () => {
  beforeEach(async () => {
    await clearStore()
  })

  it('saves an opening and returns it with id', async () => {
    const saved = await saveUserOpening({
      name: 'Italian Game',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      eco: 'C50',
      variationName: 'Classical Variation',
    })
    expect(saved.id).toBeGreaterThan(0)
    expect(saved.name).toBe('Italian Game')
    expect(saved.createdAt).toBeTruthy()
  })

  it('lists all saved openings', async () => {
    await saveUserOpening({ name: 'Italian Game', fen: 'fen1', eco: 'C50' })
    await saveUserOpening({ name: 'Sicilian Defense', fen: 'fen2', eco: 'B20' })
    const all = await listUserOpenings()
    expect(all).toHaveLength(2)
    expect(all.map((o) => o.name).sort()).toEqual(['Italian Game', 'Sicilian Defense'])
  })

  it('detects duplicate FEN', async () => {
    const fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'
    await saveUserOpening({ name: 'Italian Game', fen, eco: 'C50' })
    expect(await isDuplicateFen(fen)).toBe(true)
    expect(await isDuplicateFen('some-other-fen')).toBe(false)
  })

  it('deletes an opening by id', async () => {
    const saved = await saveUserOpening({ name: 'Italian Game', fen: 'fen1' })
    const saved2 = await saveUserOpening({ name: 'Sicilian Defense', fen: 'fen2' })
    await deleteUserOpening(saved.id!)
    const all = await listUserOpenings()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(saved2.id)
  })

  it('handles empty store', async () => {
    const all = await listUserOpenings()
    expect(all).toEqual([])
  })
})
