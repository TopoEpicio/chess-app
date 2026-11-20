import { type ReactNode } from 'react';

export interface EngineLine {
  rank: number;
  evaluation: number;
  mate?: number | null;
  pv: string[];
  depth: number;
}

interface EngineLinesProps {
  lines: EngineLine[];
  fen: string;
  onLineSelect?: (line: EngineLine) => void;
  className?: string;
}

const pieceSymbols: Record<string, string> = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

function formatPV(pv: string[]): string {
  return pv.map((move, i) => `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} ${move}`).join(' ').trim();
}

function formatEval(evalNum: number, mate?: number | null): string {
  if (mate !== null && mate !== undefined) {
    return mate > 0 ? `M${mate}` : `M${mate}`;
  }
  const sign = evalNum >= 0 ? '+' : '';
  return `${sign}${evalNum.toFixed(2)}`;
}

export function EngineLines({ lines, fen, onLineSelect, className = '' }: EngineLinesProps) {
  return (
    <div className={`space-y-2 ${className}`} role="list" aria-label="Linee motore">
      {lines.map((line, index) => (
        <button
          key={index}
          role="listitem"
          onClick={() => onLineSelect?.(line)}
          className={`
            w-full text-left p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius)]
            transition-all duration-150 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
            ${index === 0 ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : ''}
          `}
          aria-current={index === 0 ? 'true' : 'false'}
        >
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <span className="text-sm font-semibold text-[var(--color-primary)]">#{line.rank}</span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${line.evaluation >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {formatEval(line.evaluation, line.mate)}
            </span>
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap break-words">
            {formatPV(line.pv)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--color-primary)]">Depth {line.depth}</span>
            <div className="w-24 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (line.depth / 40) * 100)}%` }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}