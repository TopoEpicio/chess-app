import { useEffect, useState } from 'react'
import { StreakBadge } from '../components/dashboard/StreakBadge'
import { StatCard } from '../components/dashboard/StatCard'
import { StudyCard } from '../components/dashboard/StudyCard'
import { useApi } from '../api/provider'
import type { DailyStats, Opening } from '../types'

interface GameSummary {
  id: number
  white: string | null
  black: string | null
  result: string | null
  eco: string | null
  date: string | null
  num_moves: number
  created_at: string
}

interface PuzzleSummary {
  id: number
  fen: string
  theme: string
  difficulty: number
}

interface Props {
  onNavigate: (page: 'analysis' | 'studio' | 'puzzles' | 'partite', gameId?: number) => void
}

export function Home({ onNavigate }: Props) {
  const api = useApi()
  const [stats, setStats] = useState<DailyStats | null>(null)
  const [latestGame, setLatestGame] = useState<GameSummary | null>(null)
  const [openings, setOpenings] = useState<Opening[]>([])
  const [puzzles, setPuzzles] = useState<PuzzleSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.stats.get().catch(() => null),
      api.analysis.list().catch(() => []),
      api.openings.list().catch(() => []),
      api.puzzles.list().catch(() => []),
    ]).then(([s, g, o, p]) => {
      if (cancelled) return
      setStats(s as DailyStats | null)
      const games = g as GameSummary[]
      if (games.length > 0) setLatestGame(games[0])
      setOpenings(o as Opening[])
      setPuzzles(p as PuzzleSummary[])
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const accuracy = stats && stats.puzzlesSolved > 0
    ? Math.round((stats.puzzlesCorrect / stats.puzzlesSolved) * 100) + '%'
    : '—'

  const repertoireAcc = stats && stats.repertoireAccuracy > 0 ? stats.repertoireAccuracy + '%' : '—'

  const gamesCount = stats && stats.gamesAnalyzed > 0 ? String(stats.gamesAnalyzed) : '—'

  const firstOpening = openings.length > 0 ? openings[0] : null
  const firstPuzzle = puzzles.length > 0 ? puzzles[0] : null
  const endgamePuzzles = puzzles.filter(p => (p.theme ?? []).includes('endgame'))

  const themeLabel: Record<string, string> = {
    fork: 'Fork',
    pin: 'Inchiodatura',
    skewer: 'Infilata',
    double_attack: 'Doppio attacco',
    discovered_attack: 'Attacco di scoperta',
    checkmate: 'Scacco matto',
    endgame: 'Finale',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Buongiorno!</h1>
          <p className="text-sm text-sage-700">
            {latestGame
              ? `Ultima partita: ${latestGame.date ?? 'data sconosciuta'}`
              : loading ? 'Caricamento...' : 'Importa una partita per iniziare'}
          </p>
        </div>
        <StreakBadge days={stats?.streakDays ?? 0} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard value={accuracy} label="Accuracy puzzle" />
        <StatCard value={repertoireAcc} label="Studio" />
        <StatCard value={gamesCount} label="Partite analizzate" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StudyCard
           tag="Studio"
          title={firstOpening ? `${firstOpening.name} · ${firstOpening.ecoCode ?? ''}` : 'Nessuna apertura'}
          description={firstOpening
            ? `${firstOpening.nodeCount} mosse · ${firstOpening.side === 'white' ? 'Con il Bianco' : 'Con il Nero'}`
            : 'Importa un repertorio per iniziare'}
          onClick={() => onNavigate('studio')}
        />
        <StudyCard
          tag="Puzzle"
          title={firstPuzzle
            ? `${themeLabel[firstPuzzle.theme?.[0] ?? ''] ?? firstPuzzle.theme?.[0] ?? ''} · Difficoltà ${firstPuzzle.difficulty}`
            : 'Nessun puzzle'}
          description={firstPuzzle ? 'Allenati con i puzzle' : 'Genera i puzzle dalle tue partite'}
          onClick={() => onNavigate('puzzles')}
        />
        <StudyCard
          tag="Analisi"
          title={latestGame ? `${latestGame.white ?? '?'} vs ${latestGame.black ?? '?'}` : 'Nuova analisi'}
          description={latestGame
            ? `${latestGame.num_moves} mosse · ${latestGame.date ?? ''}`
            : 'Importa un PGN o gioca contro il bot'}
          onClick={() => onNavigate('analysis', latestGame?.id)}
        />
        <StudyCard
          tag="Finali"
          title={endgamePuzzles.length > 0
            ? `${themeLabel[endgamePuzzles[0].theme?.[0] ?? ''] ?? 'Finale'} · Difficoltà ${endgamePuzzles[0].difficulty}`
            : 'Pedoni · Base'}
          description={endgamePuzzles.length > 0
            ? `${endgamePuzzles.length} puzzle disponibili`
            : 'Puzzle tematici sui finali'}
          onClick={() => onNavigate('puzzles')}
        />
      </div>
    </div>
  )
}