import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface EngineConfig {
  depth: number
  hash: number
  threads: number
  multiPv: number
  skillElo: number
}

interface EngineConfigState extends EngineConfig {
  setDepth: (v: number) => void
  setHash: (v: number) => void
  setThreads: (v: number) => void
  setMultiPv: (v: number) => void
  setSkillElo: (v: number) => void
}

const STORAGE_KEY = 'chess-engine'

const DEFAULTS: EngineConfig = {
  // 16 is the depth the analysis page historically used and stays responsive in
  // the single-threaded WASM build. It is fully overridable from Settings.
  depth: 16,
  hash: 16,
  threads: 1,
  multiPv: 3,
  skillElo: 2800,
}

function loadState(): Partial<EngineConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state: EngineConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const EngineContext = createContext<EngineConfigState | null>(null)

export function EngineConfigProvider({ children }: { children: ReactNode }) {
  const saved = loadState()
  const [depth, setDepth] = useState(saved.depth ?? DEFAULTS.depth)
  const [hash, setHash] = useState(saved.hash ?? DEFAULTS.hash)
  const [threads, setThreads] = useState(saved.threads ?? DEFAULTS.threads)
  const [multiPv, setMultiPv] = useState(saved.multiPv ?? DEFAULTS.multiPv)
  const [skillElo, setSkillElo] = useState(saved.skillElo ?? DEFAULTS.skillElo)

  useEffect(() => {
    saveState({ depth, hash, threads, multiPv, skillElo })
  }, [depth, hash, threads, multiPv, skillElo])

  return (
    <EngineContext.Provider
      value={{ depth, hash, threads, multiPv, skillElo, setDepth, setHash, setThreads, setMultiPv, setSkillElo }}
    >
      {children}
    </EngineContext.Provider>
  )
}

export function useEngineConfig(): EngineConfigState {
  const ctx = useContext(EngineContext)
  if (ctx) return ctx

  // Outside a provider (isolated hook tests, storybook, etc.) fall back to the
  // defaults so the engine still receives a complete, consistent configuration
  // instead of throwing.
  return {
    ...DEFAULTS,
    setDepth: () => {},
    setHash: () => {},
    setThreads: () => {},
    setMultiPv: () => {},
    setSkillElo: () => {},
  }
}
