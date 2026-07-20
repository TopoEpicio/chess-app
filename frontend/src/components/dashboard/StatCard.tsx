interface Props {
  value: string | number
  label: string
}

export function StatCard({ value, label }: Props) {
  return (
    <div className="bg-sage-50 rounded-box p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-sage-700">{label}</div>
    </div>
  )
}
