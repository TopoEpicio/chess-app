interface Props {
  value: string | number
  label: string
}

export function StatCard({ value, label }: Props) {
  return (
    <div className="bg-surface rounded-box p-4 text-center shadow-card">
      <div className="text-2xl font-bold text-sage-900">{value}</div>
      <div className="text-sm text-sage-700">{label}</div>
    </div>
  )
}
