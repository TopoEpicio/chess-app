import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type BoardTheme = 'default' | 'blue' | 'green' | 'brown'

interface ThemeState {
  mode: ThemeMode
  boardTheme: BoardTheme
  squareOpacity: number
  pieceShadow: boolean
  setMode: (m: ThemeMode) => void
  setBoardTheme: (t: BoardTheme) => void
  setSquareOpacity: (o: number) => void
  setPieceShadow: (s: boolean) => void
}

const STORAGE_KEY = 'chess-theme'

function loadState(): Partial<ThemeState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state: Partial<ThemeState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const ThemeContext = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const saved = loadState()
  const [mode, setMode] = useState<ThemeMode>(saved.mode ?? 'auto')
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(saved.boardTheme ?? 'default')
  const [squareOpacity, setSquareOpacity] = useState(saved.squareOpacity ?? 1.0)
  const [pieceShadow, setPieceShadow] = useState(saved.pieceShadow ?? true)

  useEffect(() => {
    saveState({ mode, boardTheme, squareOpacity, pieceShadow })
  }, [mode, boardTheme, squareOpacity, pieceShadow])

  useEffect(() => {
    const isDark = resolveDark(mode)
    document.documentElement.classList.toggle('dark', isDark)
    if (mode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches)
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [mode])

  return (
    <ThemeContext.Provider
      value={{ mode, boardTheme, squareOpacity, pieceShadow, setMode, setBoardTheme, setSquareOpacity, setPieceShadow }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
