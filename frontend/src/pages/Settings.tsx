import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { useTheme, type ThemeMode, type BoardTheme } from '../stores/themeStore'
import { useEngineConfig } from '../stores/engineStore'
import { arrowConfigAtom } from '../state/atoms/engineAtoms'
import { ArrowControls } from '../components/analysis/ArrowControls'
import { Chessboard as BaseChessboard } from 'react-chessboard'

const locales = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

const boardThemes: { id: BoardTheme; label: string; light: string; dark: string }[] = [
  { id: 'default', label: 'board.default', light: '#edeed7', dark: '#7a9a6a' },
  { id: 'blue', label: 'board.blue', light: '#dee8f0', dark: '#6a8aaa' },
  { id: 'green', label: 'board.green', light: '#d8e8d8', dark: '#5a8a5a' },
  { id: 'brown', label: 'board.brown', light: '#e8dcc8', dark: '#8a7a5a' },
]

function BoardPreview({ light, dark }: { light: string; dark: string }) {
  const boardStyle = {
    width: 160,
    height: 160,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }
  const darkSquareStyle = { backgroundColor: dark, opacity: 1 }
  const lightSquareStyle = { backgroundColor: light, opacity: 1 }

  return (
    <BaseChessboard
      options={{
        position: 'start',
        boardStyle,
        darkSquareStyle,
        lightSquareStyle,
        boardOrientation: 'white',
        allowDragging: false,
        showNotation: false,
      }}
    />
  )
}

export function Settings() {
  const { t } = useTranslation('common')
  const { mode, setMode, boardTheme, setBoardTheme, squareOpacity, setSquareOpacity, pieceShadow, setPieceShadow } = useTheme()
  const engineCfg = useEngineConfig()
  const [arrowConfig, setArrowConfig] = useAtom(arrowConfigAtom)
  const { i18n } = useTranslation()

  const currentTheme = boardThemes.find(bt => bt.id === boardTheme)!

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">{t('settings.title')}</h1>

      <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('settings.language')}</h2>
        <select
          value={i18n.language?.split('-')[0] || 'en'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        >
          {locales.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </section>

      <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('settings.theme')}</h2>
        <div className="flex gap-3">
          {(['light', 'dark', 'auto'] as ThemeMode[]).map((tm) => (
            <button
              key={tm}
              onClick={() => setMode(tm)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === tm
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg)]'
              }`}
            >
              {t(`settings.${tm}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('settings.board')}</h2>

        <div className="flex items-center gap-4">
          <BoardPreview light={currentTheme.light} dark={currentTheme.dark} />
          <div className="flex flex-wrap gap-2 flex-1">
            {boardThemes.map((bt) => (
              <button
                key={bt.id}
                onClick={() => setBoardTheme(bt.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  boardTheme === bt.id
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg)]'
                }`}
              >
                {t(bt.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>{t('board.opacity')}</span>
            <span>{Math.round(squareOpacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={squareOpacity}
            onChange={(e) => setSquareOpacity(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>

        <label className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <span>{t('board.pieceShadow')}</span>
          <input
            type="checkbox"
            checked={pieceShadow}
            onChange={(e) => setPieceShadow(e.target.checked)}
            className="rounded border-[var(--color-border)] text-[var(--color-text-secondary)] accent-[var(--color-primary)]"
          />
        </label>
      </section>

      <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('settings.engineTitle')}</h2>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>{t('settings.engineDepthLabel')}</span>
            <span>{engineCfg.depth}</span>
          </label>
          <input type="range" min="1" max="48" value={engineCfg.depth}
            onChange={(e) => engineCfg.setDepth(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)]" />
          <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">1 48</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>{t('settings.hashMemory')}</span>
            <span>{engineCfg.hash} MB</span>
          </label>
          <input type="range" min="16" max="512" value={engineCfg.hash}
            onChange={(e) => engineCfg.setHash(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)]" />
          <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">16 MB 512 MB</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>Thread</span>
            <span>{engineCfg.threads}</span>
          </label>
          <input type="range" min="1" max="16" value={engineCfg.threads}
            onChange={(e) => engineCfg.setThreads(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)]" />
          <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">1 16</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>Linee multiple (MultiPV)</span>
            <span>{engineCfg.multiPv}</span>
          </label>
          <input type="range" min="1" max="10" value={engineCfg.multiPv}
            onChange={(e) => engineCfg.setMultiPv(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)]" />
          <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">1 10</div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5 border border-[var(--color-border)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('settings.arrows')}</h2>
        <ArrowControls config={arrowConfig} onChange={setArrowConfig} />
      </section>
    </div>
  )
}
