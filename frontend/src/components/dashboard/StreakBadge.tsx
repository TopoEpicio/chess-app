interface Props {
  days: number
}

export function StreakBadge({ days }: Props) {
  return (
    <div className="flex items-center gap-2 bg-sand-50 px-4 py-2 rounded-box">
      <span className="text-2xl font-bold">{days}</span>
      <span className="text-sm text-sage-700">giorni streak</span>
    </div>
  )
}
