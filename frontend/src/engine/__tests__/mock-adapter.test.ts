import { describe, it, expect } from 'vitest'
import { MockEngineAdapter } from '../mock-adapter.ts'

describe('MockEngineAdapter', () => {
  it('starts ready', () => {
    const adapter = new MockEngineAdapter()
    expect(adapter.ready).toBe(true)
    expect(adapter.error).toBeNull()
  })

  it('analyze sets evalInfo', () => {
    const adapter = new MockEngineAdapter()
    adapter.analyze('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(adapter.evalInfo).not.toBeNull()
    expect(adapter.evalInfo!.bestMove).toBe('e2e4')
  })

  it('bestMove calls callback', async () => {
    const adapter = new MockEngineAdapter()
    const result = await new Promise((resolve) => {
      adapter.bestMove('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', resolve)
    })
    expect(result).toHaveProperty('bestMove', 'e2e4')
  })

  it('deepAnalyze returns lines', async () => {
    const adapter = new MockEngineAdapter()
    const result = await adapter.deepAnalyze('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(result).toHaveLength(2)
    expect(result[0].san).toBe('e4')
    expect(result[1].san).toBe('d4')
  })

  it('stop and destroy are no-ops', () => {
    const adapter = new MockEngineAdapter()
    expect(() => { adapter.stop(); adapter.destroy() }).not.toThrow()
  })
})
