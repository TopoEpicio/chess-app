import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, renderHook } from '@testing-library/react'
import { EngineProvider, useEngineAdapter } from '../EngineProvider'
import { MockEngineAdapter } from '../mock-adapter'
import type { EngineAdapter } from '../interface'
import { EngineConfigProvider } from '../../stores/engineStore'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <EngineConfigProvider>{children}</EngineConfigProvider>
}

function TestConsumer() {
  const { ready, error, evalInfo, analyze, bestMove, deepAnalyze } = useEngineAdapter()
  return (
    <div>
      <span data-testid="ready">{String(ready)}</span>
      <span data-testid="error">{error ?? 'null'}</span>
      <span data-testid="evalInfo">{evalInfo ? 'set' : 'null'}</span>
      <button data-testid="analyze" onClick={() => analyze('start')}>analyze</button>
      <button data-testid="bestmove" onClick={() => bestMove('start', vi.fn())}>bestMove</button>
      <button data-testid="deep" onClick={async () => { await deepAnalyze('start') }}>deep</button>
    </div>
  )
}

describe('EngineProvider', () => {
  let adapter: MockEngineAdapter

  beforeEach(() => {
    adapter = new MockEngineAdapter()
  })

  it('renders children', () => {
    render(
      <EngineConfigProvider>
        <EngineProvider adapter={adapter}>
          <div>child</div>
        </EngineProvider>
      </EngineConfigProvider>,
    )
    expect(screen.getByText('child')).toBeDefined()
  })

  it('provides adapter state to consumers', () => {
    render(
      <EngineConfigProvider>
        <EngineProvider adapter={adapter}>
          <TestConsumer />
        </EngineProvider>
      </EngineConfigProvider>,
    )
    expect(screen.getByTestId('ready').textContent).toBe('true')
    expect(screen.getByTestId('error').textContent).toBe('null')
    expect(screen.getByTestId('evalInfo').textContent).toBe('null')
  })

  it('updates evalInfo when adapter changes', () => {
    adapter.setEvalInfo({ bestMove: 'e2e4', evaluation: 0.3, mate: null, depth: 18 })
    render(
      <EngineConfigProvider>
        <EngineProvider adapter={adapter}>
          <TestConsumer />
        </EngineProvider>
      </EngineConfigProvider>,
    )
    expect(screen.getByTestId('evalInfo').textContent).toBe('set')
  })

  it('calls destroy on unmount', () => {
    const destroySpy = vi.spyOn(adapter, 'destroy')
    const { unmount } = render(
      <EngineConfigProvider>
        <EngineProvider adapter={adapter}>
          <div>child</div>
        </EngineProvider>
      </EngineConfigProvider>,
    )
    unmount()
    expect(destroySpy).toHaveBeenCalledTimes(1)
  })
})

describe('useEngineAdapter', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useEngineAdapter())).toThrow()
  })

  it('returns adapter methods inside provider', () => {
    const adapter = new MockEngineAdapter()
    const { result } = renderHook(() => useEngineAdapter(), {
      wrapper: ({ children }) => (
        <EngineConfigProvider>
          <EngineProvider adapter={adapter}>{children}</EngineProvider>
        </EngineConfigProvider>
      ),
    })
    expect(result.current.ready).toBe(true)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.analyze).toBe('function')
    expect(typeof result.current.bestMove).toBe('function')
    expect(typeof result.current.deepAnalyze).toBe('function')
  })
})
