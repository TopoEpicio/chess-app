import { useState } from 'react'
import { Home } from './pages/Home'
import { Analysis } from './pages/Analysis'
import { Games } from './pages/Games'
import { GameViewer } from './pages/GameViewer'
import { Studio } from './pages/Studio'
import { Puzzles } from './pages/Puzzles'
import { Play } from './pages/Play'

type Page = 'home' | 'analysis' | 'studio' | 'puzzles' | 'partite' | 'play'

const navItems: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'play', label: 'Gioca' },
  { page: 'studio', label: 'Studio' },
  { page: 'partite', label: 'Partite' },
  { page: 'analysis', label: 'Analisi' },
  { page: 'puzzles', label: 'Puzzle' },
]

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [analyzeGameId, setAnalyzeGameId] = useState<number | null>(null)

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

  const handlePageChange = (p: Page) => {
    setPage(p)
    if (p !== 'analysis') setAnalyzeGameId(null)
    if (p !== 'partite') setSelectedGameId(null)
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white border-b border-sage-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-bold text-lg text-sage-900">♟ Chess Training</span>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handlePageChange(item.page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.page
                    ? 'bg-sage-500 text-white'
                    : 'text-sage-700 hover:bg-sage-100'
                }`}
              >
                {item.label}
              </button>
            ))}
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
        {page === 'studio' && <Studio />}
        {page === 'puzzles' && <Puzzles />}
        {page === 'play' && <Play onBack={() => setPage('home')} />}
      </main>
    </div>
  )
}

export default App
