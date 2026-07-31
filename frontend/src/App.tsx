import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Home } from './pages/Home'
import { Analysis } from './pages/Analysis'
import { Games } from './pages/Games'
import { GameViewer } from './pages/GameViewer'
import { Studio } from './pages/Studio'
import { CoursePlayer } from './pages/CoursePlayer'
import { SrsReview } from './pages/SrsReview'
import { RepertoireBuilder } from './pages/RepertoireBuilder'
import { Puzzles } from './pages/Puzzles'
import { Play } from './pages/Play'
import { Settings } from './pages/Settings'
import { ChevronRight, Settings as SettingsIcon } from 'lucide-react'

type Page = 'home' | 'analysis' | 'studio' | 'puzzles' | 'partite' | 'play' | 'settings' | 'course' | 'review' | 'repertoire-builder'

const pageKeys: { page: Page; labelKey: string }[] = [
  { page: 'home', labelKey: 'nav.home' },
  { page: 'play', labelKey: 'nav.play' },
  { page: 'studio', labelKey: 'nav.studio' },
  { page: 'partite', labelKey: 'nav.games' },
  { page: 'analysis', labelKey: 'nav.analysis' },
  { page: 'puzzles', labelKey: 'nav.puzzles' },
]

function App() {
  const { t } = useTranslation()
  const [page, setPage] = useState<Page>('home')
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [analyzeGameId, setAnalyzeGameId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const handleSelectGame = (id: number) => {
    setSelectedGameId(id)
    setAnalyzeGameId(null)
    setPage('partite')
  }

  const handleBackToGames = () => {
    setSelectedGameId(null)
  }

  const handleAnalyzeGame = (id: number) => {
    setAnalyzeGameId(id)
    setSelectedGameId(null)
    setPage('analysis')
  }

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setPage('course')
  }

  const handlePageChange = (p: Page) => {
    setPage(p)
    if (p !== 'analysis') setAnalyzeGameId(null)
    if (p !== 'partite') setSelectedGameId(null)
    if (p !== 'course') setSelectedCourseId(null)
  }

  const handleOpenReview = () => setPage('review')

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white border-b border-sage-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-14">
          <span className="font-bold text-lg text-sage-900"><ChevronRight size={20} className="inline-block" /> {t('app.name')}</span>
          <div className="flex gap-1">
            {pageKeys.map((item) => (
              <button
                key={item.page}
                onClick={() => handlePageChange(item.page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.page
                    ? 'bg-sage-500 text-white'
                    : 'text-sage-700 hover:bg-sage-100'
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
            <button
              onClick={() => handlePageChange('settings')}
              className={`ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === 'settings'
                  ? 'bg-sage-500 text-white'
                  : 'text-sage-700 hover:bg-sage-100'
              }`}
              title={t('nav.settings')}
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main>
        {page === 'home' && <Home onNavigate={(p, gameId) => { handlePageChange(p); if (gameId) setAnalyzeGameId(gameId); }} />}
        {page === 'analysis' && <Analysis gameId={analyzeGameId ?? undefined} onBack={() => setPage(analyzeGameId ? 'partite' : 'home')} />}
        {page === 'partite' && !selectedGameId && (
          <Games onSelectGame={handleSelectGame} onAnalyzeGame={handleAnalyzeGame} />
        )}
        {page === 'partite' && selectedGameId && (
          <GameViewer gameId={selectedGameId} onBack={handleBackToGames} onAnalyze={() => handleAnalyzeGame(selectedGameId)} />
        )}
        {page === 'studio' && <Studio onStartCourse={handleStartCourse} onOpenReview={handleOpenReview} />}
        {page === 'course' && selectedCourseId && (
          <CoursePlayer courseId={selectedCourseId} onBack={() => setPage('studio')} />
        )}
        {page === 'review' && <SrsReview onBack={() => setPage('studio')} />}
        {page === 'repertoire-builder' && <RepertoireBuilder onBack={() => setPage('studio')} />}
        {page === 'puzzles' && <Puzzles />}
        {page === 'play' && <Play onBack={() => setPage('home')} />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default App
