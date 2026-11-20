import { Suspense, lazy, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppShell } from './components/layout';
import { useTranslation } from 'react-i18next';
import { useTheme } from './stores/themeStore';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Analysis = lazy(() => import('./pages/Analysis').then(m => ({ default: m.Analysis })));
const Games = lazy(() => import('./pages/Games').then(m => ({ default: m.Games })));
const GameViewer = lazy(() => import('./pages/GameViewer').then(m => ({ default: m.GameViewer })));
const Studio = lazy(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const Puzzles = lazy(() => import('./pages/Puzzles').then(m => ({ default: m.Puzzles })));
const Play = lazy(() => import('./pages/Play').then(m => ({ default: m.Play })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

// Loading fallback
function PageLoading() {
  const { t } = useTranslation('common');
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" aria-label={t('app.loading')} />
    </div>
  );
}

/** Route wrapper that reads :gameId from the URL and passes it to Analysis. */
function AnalysisRoute() {
  const { gameId } = useParams();
  return <Analysis gameId={gameId ? Number(gameId) : undefined} />;
}

/** Route wrapper that reads :id from the URL and passes it to GameViewer. */
function GameViewerRoute({ onBack, onAnalyze }: { onBack: () => void; onAnalyze: (gameId: number) => void }) {
  const { id } = useParams();
  const numericId = id ? Number(id) : 0;
  return <GameViewer gameId={numericId} onBack={onBack} onAnalyze={() => onAnalyze(numericId)} />;
}

function App() {
  const { i18n, t } = useTranslation('common');
  const { theme } = useTheme();

  // Apply theme class to document
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = i18n.language;
  }

  // Navigation configuration (inside component to use translations)
  const navGroups = [
    {
      label: t('nav.play'),
      items: [
        { label: t('nav.home'), to: '/', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )},
      { label: t('nav.play'), to: '/gioca', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )},
    ],
  },
  {
    label: t('nav.training'),
    items: [
      { label: t('nav.studio'), to: '/studio', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )},
      { label: t('nav.puzzles'), to: '/puzzle', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )},
    ],
  },
  {
    label: t('nav.analysis'),
    items: [
      { label: t('nav.games'), to: '/partite', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )},
      { label: t('nav.analysis'), to: '/analisi', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )},
    ],
  },
];

  const handleNavigate = useCallback((page: 'analysis' | 'studio' | 'puzzles' | 'partite', gameId?: number) => {
    // Navigation handled by AppShell/routes
    if (gameId && page === 'analysis') {
      window.location.href = `/analisi/${gameId}`;
    }
  }, []);

  const handleSelectGame = useCallback((gameId: number) => {
    window.location.href = `/partite/${gameId}`;
  }, []);

  const handleAnalyzeGame = useCallback((gameId: number) => {
    window.location.href = `/analisi/${gameId}`;
  }, []);

  const handleBackToGames = useCallback(() => {
    window.location.href = '/partite';
  }, []);

  return (
    <BrowserRouter>
      <AppShell navGroups={navGroups}>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/gioca" element={<Play />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/puzzle" element={<Puzzles />} />
            <Route path="/partite" element={<Games onSelectGame={handleSelectGame} onAnalyzeGame={handleAnalyzeGame} />} />
            <Route path="/partite/:id" element={<GameViewerRoute onBack={handleBackToGames} onAnalyze={handleAnalyzeGame} />} />
            <Route path="/analisi" element={<Analysis />} />
            <Route path="/analisi/:gameId" element={<AnalysisRoute />} />
            <Route path="/impostazioni" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;