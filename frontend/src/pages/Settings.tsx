import { useTranslation } from 'react-i18next'
import { useTheme, type ThemeMode, type BoardTheme } from '../stores/themeStore'
import { useEngineConfig } from '../stores/engineStore'

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
  const cells = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const isLight = (r + c) % 2 === 0
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            background: isLight ? light : dark,
            width: '100%',
            aspectRatio: '1',
          }}
        />,
      )
    }
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        width: 120,
        height: 120,
        border: '2px solid #333',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {cells}
    </div>
  )
}

export function Settings() {
  const { t, i18n } = useTranslation()
  const { mode, boardTheme, squareOpacity, pieceShadow, setMode, setBoardTheme, setSquareOpacity, setPieceShadow } = useTheme()
  const engineCfg = useEngineConfig()

  const currentTheme = boardThemes.find((bt) => bt.id === boardTheme) ?? boardThemes[0]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-sage-900 dark:text-dark-text">{t('settings.title')}</h1>

      <section className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-sage-100 dark:border-dark-border space-y-3">
        <h2 className="text-lg font-semibold text-sage-800 dark:text-dark-text">{t('settings.language')}</h2>
        <select
          value={i18n.language?.split('-')[0] || 'en'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="w-full rounded-lg border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sage-900 dark:text-dark-text px-3 py-2 text-sm"
        >
          {locales.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </section>

      <section className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-sage-100 dark:border-dark-border space-y-3">
        <h2 className="text-lg font-semibold text-sage-800 dark:text-dark-text">{t('settings.theme')}</h2>
        <div className="flex gap-3">
          {(['light', 'dark', 'auto'] as ThemeMode[]).map((tm) => (
            <button
              key={tm}
              onClick={() => setMode(tm)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === tm
                  ? 'bg-sage-500 text-white border-sage-500'
                  : 'bg-white dark:bg-dark-bg text-sage-700 dark:text-dark-text border-sage-200 dark:border-dark-border hover:bg-sage-50 dark:hover:bg-dark-surface'
              }`}
            >
              {t(`settings.${tm}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-sage-100 dark:border-dark-border space-y-4">
        <h2 className="text-lg font-semibold text-sage-800 dark:text-dark-text">{t('settings.board')}</h2>

        <div className="flex items-center gap-4">
          <BoardPreview light={currentTheme.light} dark={currentTheme.dark} />
          <div className="flex flex-wrap gap-2 flex-1">
            {boardThemes.map((bt) => (
              <button
                key={bt.id}
                onClick={() => setBoardTheme(bt.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  boardTheme === bt.id
                    ? 'bg-sage-500 text-white border-sage-500'
                    : 'bg-white dark:bg-dark-bg text-sage-700 dark:text-dark-text border-sage-200 dark:border-dark-border hover:bg-sage-50 dark:hover:bg-dark-surface'
                }`}
              >
                {t(bt.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-sage-700 dark:text-dark-text">
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
            className="w-full accent-sage-500"
          />
        </div>

        <label className="flex items-center justify-between text-sm text-sage-700 dark:text-dark-text">
          <span>{t('board.pieceShadow')}</span>
          <input
            type="checkbox"
            checked={pieceShadow}
            onChange={(e) => setPieceShadow(e.target.checked)}
            className="rounded border-sage-300 text-sage-500 accent-sage-500"
          />
        </label>
      </section>

      <section className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-sage-100 dark:border-dark-border space-y-4">
        <h2 className="text-lg font-semibold text-sage-800 dark:text-dark-text">{t('settings.engine')}</h2>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-sage-700 dark:text-dark-text">
            <span>{t('settings.depth')}</span>
            <span>{engineCfg.depth}</span>
          </label>
          <input type="range" min="1" max="48" value={engineCfg.depth}
            onChange={(e) => engineCfg.setDepth(parseInt(e.target.value))}
            className="w-full accent-sage-500" />
          <div className="flex justify-between text-[11px] text-sage-400">1 48</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-sage-700 dark:text-dark-text">
            <span>{t('settings.hash')}</span>
            <span>{engineCfg.hash} MB</span>
          </label>
          <input type="range" min="16" max="512" value={engineCfg.hash}
            onChange={(e) => engineCfg.setHash(parseInt(e.target.value))}
            className="w-full accent-sage-500" />
          <div className="flex justify-between text-[11px] text-sage-400">16 MB 512 MB</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-sage-700 dark:text-dark-text">
            <span>{t('settings.threads')}</span>
            <span>{engineCfg.threads}</span>
          </label>
          <input type="range" min="1" max="16" value={engineCfg.threads}
            onChange={(e) => engineCfg.setThreads(parseInt(e.target.value))}
            className="w-full accent-sage-500" />
          <div className="flex justify-between text-[11px] text-sage-400">1 16</div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm text-sage-700 dark:text-dark-text">
            <span>{t('settings.multiPv')}</span>
            <span>{engineCfg.multiPv}</span>
          </label>
          <input type="range" min="1" max="10" value={engineCfg.multiPv}
            onChange={(e) => engineCfg.setMultiPv(parseInt(e.target.value))}
            className="w-full accent-sage-500" />
          <div className="flex justify-between text-[11px] text-sage-400">1 10</div>
        </div>
      </section>
    </div>
  )
}
