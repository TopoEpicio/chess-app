import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ApiProvider, useApi } from '../provider'
import { MockApiClient } from '../mock-client'

describe('ApiProvider', () => {
  it('provides FetchApiClient by default', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: ({ children }) => <ApiProvider>{children}</ApiProvider>,
    })
    expect(result.current.health).toBeDefined()
    expect(result.current.puzzles).toBeDefined()
    expect(result.current.repertoire).toBeDefined()
  })

  it('accepts MockApiClient injection', async () => {
    const mock = new MockApiClient()
    mock.setPuzzles([
      { id: '1', userId: '1', fen: 'test', solution: ['e4'], theme: 'fork', difficulty: 3, source: 'auto', sourceGameId: null, phase: 'opening', createdAt: '' },
    ])

    const { result } = renderHook(() => useApi(), {
      wrapper: ({ children }) => <ApiProvider client={mock}>{children}</ApiProvider>,
    })

    const puzzles = await result.current.puzzles.list()
    expect(puzzles).toHaveLength(1)
    expect(puzzles[0].fen).toBe('test')
  })
})
