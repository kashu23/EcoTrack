import React from 'react'

export default function RecommendationCard({ title, detail, icon, tone = 'red' }) {
  const toneClass = tone === 'red' 
    ? 'bg-red-50/75 border-red-200 text-slate-900 dark:bg-red/15 dark:border-red/30 dark:text-white' 
    : 'bg-white border-slate-200 text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-white'

  return (
    <div className={`rounded-2xl border ${toneClass} p-5 transition-colors duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500 dark:text-white/60">{icon ? <span aria-hidden>{icon}</span> : null}</div>
          <h3 className="text-lg font-bold mt-1">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-white/70 mt-2 leading-relaxed">{detail}</p>
        </div>
      </div>
    </div>
  )
}

