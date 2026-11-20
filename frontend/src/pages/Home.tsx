import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { StreakBadge } from '../components/dashboard/StreakBadge'
import { StatCard } from '../components/dashboard/StatCard'
import { StudyCard } from '../components/dashboard/StudyCard'
import { api } from '../api/client'

interface OpeningNode { id: string; name: string; ecoCode: string | null; nodeCount: number; side: 'white' | 'black' }
interface Puzzle { id: string; theme: string[]; difficulty: number }
interface Game { id: string; white: string | null; black: string | null; date: string | null; num_moves: number }
interface Stats { streakDays: number }

export function Home({ onNavigate }: { onNavigate: (page: string, gameId?: number) => void }) {
  const { t } = useTranslation('common')
  const [stats, setStats] = useState<Stats | null>(null)
  const [latestGame, setLatestGame] = useState<Game | null>(null)
  const [firstOpening, setFirstOpening] = useState<OpeningNode | null>(null)
  const [firstPuzzle, setFirstPuzzle] = useState<Puzzle | null>(null)
  const [endgamePuzzles, setEndgamePuzzles] = useState<Puzzle[]>([])
  const [loading, setLoading] = useState(true)

  const themeLabel: Record<string, string> = {
    fork: t('puzzles.fork'),
    pin: t('puzzles.pin'),
    skewer: t('puzzles.skewer'),
    double_attack: t('puzzles.doubleCheck'),
    discovered_attack: t('puzzles.discoveredAttack'),
    checkmate: t('puzzles.checkmate'),
    endgame: t('puzzles.endgames'),
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.stats.get(1).then((s: any) => { if (s) setStats({ streakDays: s.streakDays ?? 0 }) }),
      api.analysis.list(1).then((g: any) => { if (g.length) setLatestGame(g[0]) }),
      api.openings.list().then((o: any) => { if (o.length) setFirstOpening(o[0]) }),
      api.puzzles.list().then((p: any) => { if (p.length) setFirstPuzzle(p[0]) }),
      api.puzzles.list({ category: 'endgame' }).then((p: any) => setEndgamePuzzles(p)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-[var(--color-text-secondary)]">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('home.buongiorno')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {latestGame
              ? t('home.lastGame', { date: latestGame.date ?? 'unknown date' })
              : loading ? t('common.loading') : t('home.importGameFirst')}
          </p>
        </div>
        <StreakBadge days={stats?.streakDays ?? 0} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard value={0} label={t('home.accuracyPuzzle')} />
        <StatCard value={0} label={t('home.study')} />
        <StatCard value={0} label={t('home.gamesAnalyzed')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StudyCard
           tag={t('studio.title')}
          title={firstOpening ? `${firstOpening.name} · ${firstOpening.ecoCode ?? ''}` : t('home.noOpening')}
          description={firstOpening
            ? `${firstOpening.nodeCount} ${t('analysis.moves')} · ${firstOpening.side === 'white' ? t('home.forWhite') : t('home.forBlack')}`
            : t('home.importRepertoire')}
          onClick={() => onNavigate('studio')}
        />
        <StudyCard
          tag={t('puzzles.title')}
          title={firstPuzzle
            ? `${themeLabel[firstPuzzle.theme?.[0] ?? ''] ?? firstPuzzle.theme?.[0] ?? ''} · ${t('play.difficulty')} ${firstPuzzle.difficulty}`
            : t('home.noPuzzle')}
          description={firstPuzzle ? t('home.trainPuzzles') : t('home.generatePuzzles')}
          onClick={() => onNavigate('puzzles')}
        />
        <StudyCard
          tag={t('analysis.title')}
          title={latestGame ? `${latestGame.white ?? '?'} vs ${latestGame.black ?? '?'}` : t('analysis.newAnalysis')}
          description={latestGame
            ? t('home.gamesCountPuzzle', { count: latestGame.num_moves, date: latestGame.date ?? '' })
            : t('home.importPgnOrBot')}
          onClick={() => onNavigate('analysis', latestGame?.id ? Number(latestGame.id) : undefined)}
        />
        <StudyCard
          tag={t('puzzles.endgames')}
          title={endgamePuzzles.length > 0
            ? `${themeLabel[endgamePuzzles[0].theme?.[0] ?? ''] ?? t('puzzles.endgames')} · ${t('play.difficulty')} ${endgamePuzzles[0].difficulty}`
            : `${t('home.for')} ${t('puzzles.endgames')} · ${t('home.forBlack')}`}
          description={endgamePuzzles.length > 0
            ? t('home.endgamePuzzlesAvailable', { count: endgamePuzzles.length })
            : `${t('home.puzzleMoves')} ${t('home.for')} ${t('puzzles.endgames')}`}
          onClick={() => onNavigate('puzzles')}
        />
      </div>
    </div>
  )
}
