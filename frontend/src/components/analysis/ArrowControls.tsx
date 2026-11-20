import type { ArrowConfig } from '../../types/analysis'
import { DEFAULT_ARROW_CONFIG } from '../../types/analysis'
import { useTranslation } from 'react-i18next'

interface Props {
  config: ArrowConfig
  onChange: (config: ArrowConfig) => void
}

const ARROW_COLORS = {
  best: 'var(--color-success)',
  second: 'var(--color-primary)',
  third: 'var(--color-warning)',
  threat: 'var(--color-danger)',
}

export function ArrowControls({ config, onChange }: Props) {
  const { t } = useTranslation('common')
  const toggle = (key: keyof ArrowConfig) => {
    onChange({ ...config, [key]: !config[key] })
  }

  const arrowDefs = [
    { key: 'showBestMove' as const, label: t('analysis.arrows.best.label'), color: ARROW_COLORS.best, desc: t('analysis.arrows.best.desc') },
    { key: 'showSecondBest' as const, label: t('analysis.arrows.second.label'), color: ARROW_COLORS.second, desc: t('analysis.arrows.second.desc') },
    { key: 'showThirdBest' as const, label: t('analysis.arrows.third.label'), color: ARROW_COLORS.third, desc: t('analysis.arrows.third.desc') },
    { key: 'showThreats' as const, label: t('analysis.arrows.threats.label'), color: ARROW_COLORS.threat, desc: t('analysis.arrows.threats.desc') },
  ]

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {t('analysis.arrows.title')}
        </div>
        <button
          onClick={() => onChange(DEFAULT_ARROW_CONFIG)}
          className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline"
        >
          {t('common.reset')}
        </button>
      </div>

      <div className="space-y-2">
        {arrowDefs.map(({ key, label, color, desc }) => (
          <label
            key={key}
            className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-bg)] cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={config[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
            />
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col">
              <span className="text-sm text-[var(--color-text)] font-medium">{label}</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">{desc}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)] pt-3 mt-3 text-[10px] text-[var(--color-text-muted)]">
        {t('analysis.arrows.help')}
        {config.showThreats && (
          <span className="block mt-1 text-[var(--color-danger)]">
            {t('analysis.arrows.threatsActive')}
          </span>
        )}
      </div>
    </div>
  )
}