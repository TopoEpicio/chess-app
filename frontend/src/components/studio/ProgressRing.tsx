const SIZE = 48
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ProgressRing({
  completed,
  total,
  size = SIZE,
}: {
  completed: number
  total: number
  size?: number
}) {
  const ratio = total > 0 ? completed / total : 0
  const offset = CIRCUMFERENCE * (1 - ratio)

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-sage-100)"
        strokeWidth={STROKE}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-sage-500)"
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={size * 0.28}
        fontWeight={600}
        className="fill-sage-700"
      >
        {completed}/{total}
      </text>
    </svg>
  )
}
