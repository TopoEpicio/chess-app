import type { EvalInfo } from '../../engine/interface'

interface Props {
  evalInfo: EvalInfo | null
  engineReady?: boolean
  engineError?: string | null
  boardOrientation?: 'white' | 'black'
}

export function EvalBar({ evalInfo, engineReady, engineError, boardOrientation = 'white' }: Props) {
  const flipped = boardOrientation === 'black'
  let display = null
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

  const topPercent = flipped ? barPercent : 100 - barPercent
  const bottomPercent = flipped ? 100 - barPercent : barPercent

  const showText = engineReady && !engineError && display

  return (
    <div className="flex items-stretch gap-3 h-full">
      <div className="relative w-[36px] border border-sage-200 rounded-[3px] overflow-hidden flex flex-col bg-[#302e2b]">
        {!flipped ? (
          <>
            <div className="bg-[#302e2b] transition-all duration-300"
              style={{ height: `${100 - barPercent}%` }}
            />
            <div className="bg-white transition-all duration-300"
              style={{ height: `${barPercent}%` }}
            />
          </>
        ) : (
          <>
            <div className="bg-white transition-all duration-300"
              style={{ height: `${barPercent}%` }}
            />
            <div className="bg-[#302e2b] transition-all duration-300"
              style={{ height: `${100 - barPercent}%` }}
            />
          </>
        )}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/15" />
      </div>
      <div className="flex flex-col justify-center min-w-[60px]">
        {engineError ? (
          <div className="text-sm font-semibold text-red-500">Errore</div>
        ) : !engineReady ? (
          <div className="relative" style={{ width: 52, height: 24 }}>
            <div className="absolute inset-0 bg-sage-200/60 rounded animate-pulse" />
          </div>
        ) : evalInfo && showText ? (
          <>
            <div className="text-lg font-bold leading-tight text-sage-900">{display}</div>
            <div className="text-[11px] text-sage-600 leading-tight mt-0.5">
              {isWhiteBetter ? 'Bianco meglio' : 'Nero meglio'}
            </div>
          </>
        ) : (
          <div className="text-sm font-semibold text-sage-500">—</div>
        )}
      </div>
    </div>
  )
}
