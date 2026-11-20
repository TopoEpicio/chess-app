import { useTranslation } from 'react-i18next'
import type { EvalInfo } from '../../types/analysis'

interface Props {
  evalInfo: EvalInfo | null
  engineReady?: boolean
  engineError?: string | null
  boardOrientation?: 'white' | 'black'
  targetDepth?: number
}

export function EvalBar({ evalInfo, engineReady, engineError, boardOrientation = 'white', targetDepth }: Props) {
  const { t } = useTranslation('common')
  const flipped = boardOrientation === 'black'
  let display: string | null = null
  let barPercent = 50
  let isWhiteBetter = true

  if (evalInfo) {
    if (evalInfo.mate !== null) {
      display = `M${Math.abs(evalInfo.mate)}`
      barPercent = evalInfo.mate > 0 ? 100 : 0
      isWhiteBetter = evalInfo.mate > 0
    } else {
      const ev = evalInfo.evaluation
      display = ev > 0 ? `+${ev.toFixed(2)}` : ev.toFixed(2)
      barPercent = Math.min(100, Math.max(0, 50 + (ev / 5) * 50))
      isWhiteBetter = ev >= 0
    }
  }

  const lightColor = '#FFFFFF'
  const darkColor = '#000000'

  const gradient = flipped
    ? `linear-gradient(to bottom, ${lightColor} ${barPercent}%, ${darkColor} ${barPercent}%)`
    : `linear-gradient(to bottom, ${darkColor} ${100 - barPercent}%, ${lightColor} ${100 - barPercent}%)`

  const showText = engineReady && !engineError && display

  return (
    <div data-testid="eval-bar" className="flex flex-col items-center gap-2 h-full w-full" style={{ minHeight: 120 }}>
      <div
        data-testid="eval-bar-track"
        className="flex-1 w-full rounded-[3px] overflow-hidden"
        style={{
          minHeight: 40,
          background: gradient,
          border: '1px solid var(--color-border)',
        }}
      />
      {showText ? (
        <div className="text-center w-full">
          <div className="text-lg font-bold leading-tight text-[var(--color-text)]">{display}</div>
          <div className="text-[11px] text-[var(--color-text-secondary)] leading-tight mt-0.5">
            {isWhiteBetter ? t('analysis.whiteBetter') : t('analysis.blackBetter')}
          </div>
          {evalInfo?.depth > 0 && (
            <div
              className="text-[10px] font-mono text-[var(--color-text-muted)] leading-tight mt-0.5 whitespace-nowrap"
              title={
                targetDepth && evalInfo.depth < targetDepth
                  ? `${t('analysis.depth')} ${evalInfo.depth} / ${targetDepth}`
                  : `${t('analysis.depth')} ${evalInfo.depth}`
              }
            >
              {t('analysis.depth')} {evalInfo.depth}
              {targetDepth && evalInfo.depth < targetDepth ? ` / ${targetDepth}` : ''}
            </div>
          )}
        </div>
      ) : engineError ? (
        <div className="text-center w-full">
          <div className="text-sm font-semibold text-[var(--color-danger)]">{t('common.error')}</div>
        </div>
      ) : !engineReady ? (
        <div className="text-center w-full">
          <div className="relative" style={{ width: 52, height: 24 }}>
            <div className="absolute inset-0 bg-[var(--color-border)]/60 rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="text-center w-full">
          <div className="text-sm font-semibold text-[var(--color-text-muted)]">—</div>
        </div>
      )}
    </div>
  )
}
