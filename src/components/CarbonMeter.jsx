import React from 'react'

export default function CarbonMeter({ scoreKg, label = 'Estimated monthly CO₂' }) {
  const score = Math.max(0, Number(scoreKg) || 0)

  // Map kg->meter percentage (heuristic): 0..500 kg -> 0..100
  const pct = Math.min(100, Math.round((score / 500) * 100))

  return (
    <section className="glass-card-3d tilt-hover p-6 rounded-3xl text-slate-800 dark:text-white transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 font-header">{label}</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-4xl font-black text-slate-900 dark:text-white font-header">{score.toFixed(1)}</div>
            <div className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">kg CO₂</div>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
            Personal emissions protocol. Lower indexes indicate optimal environmental synergy.
          </p>
        </div>
        <div className="min-w-[100px] flex flex-col items-end">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 font-header">Score Index</div>
          <div className="text-2xl font-black text-red-gradient font-header mt-1">{pct}%</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-4 w-full bg-slate-100 dark:bg-slate-900/60 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner">
          {/* Progress bar background fill */}
          <div
            className="h-full bg-gradient-to-r from-gold to-red opacity-30 dark:opacity-40"
            style={{ width: `${pct}%`, transition: 'width 400ms ease' }}
          />
          {/* Gauge needle/pointer */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-light to-gold shadow-md"
            style={{ 
              left: `calc(${pct}% - 2px)`, 
              transition: 'left 400ms ease',
              boxShadow: '0 0 8px #e2b77a'
            }}
          />
        </div>
        <div className="mt-3.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/35 font-header">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Low</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Target</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> High</span>
        </div>
      </div>
    </section>
  )
}


