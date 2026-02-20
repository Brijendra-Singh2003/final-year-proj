import React from 'react'

type Props = {
  title: string
  value: string | number
  icon?: React.ReactNode
  accent?: string
}

const StatsCard: React.FC<Props> = ({ title, value, icon, accent = 'from-green-400 to-blue-500' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${accent} text-white shadow`}>
        {icon}
      </div>

      <div className="flex-1">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-semibold text-slate-800 mt-1">{value}</div>
      </div>
    </div>
  )
}

export default StatsCard
