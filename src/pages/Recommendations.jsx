import React, { useEffect, useMemo, useState } from 'react'
import RecommendationCard from '../components/RecommendationCard.jsx'
import { ensureSeedData } from '../utils/storage.js'
import { buildRecommendations } from '../utils/recommendations.js'

function isoToMonthKey(iso) {
  return iso.slice(0, 7)
}

export default function Recommendations() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const store = ensureSeedData()
    setHistory(store.history)
  }, [])

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const monthEntries = useMemo(() => history.filter(h => isoToMonthKey(h.dateISO) === currentMonthKey), [history, currentMonthKey])

  const monthlyBreakdown = useMemo(() => {
    const total = { transport: 0, food: 0, energy: 0, shopping: 0 }
    let totalKg = 0
    for (const h of monthEntries) {
      const b = h.emissions?.breakdownByCategory ?? {}
      total.transport += b.transport ?? 0
      total.food += b.food ?? 0
      total.energy += b.energy ?? 0
      total.shopping += b.shopping ?? 0
      totalKg += h.emissions?.totalKg ?? 0
    }
    return { breakdown: total, totalKg }
  }, [monthEntries])

  // Compute a sustainability score (lower kg -> higher score)
  const score = useMemo(() => {
    const kg = monthlyBreakdown.totalKg
    if (kg <= 0) return 0
    // Map 0..500 kg to 100..0 (heuristic)
    const clamped = Math.min(500, Math.max(0, kg))
    return Math.round((1 - clamped / 500) * 100)
  }, [monthlyBreakdown.totalKg])

  const streak = useMemo(() => {
    if (!history.length) return 0
    const all = history.map(h => h.emissions?.totalKg ?? 0).filter(Boolean)
    if (!all.length) return 0
    const sorted = [...all].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const byDate = new Map(history.map(h => [h.dateISO, h.emissions?.totalKg ?? 0]))
    let count = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      const v = byDate.get(iso)
      if (v == null) break
      if (v <= median) count++
      else break
    }
    return count
  }, [history])

  const rec = useMemo(() => {
    return buildRecommendations({
      monthlyBreakdown: monthlyBreakdown.breakdown,
      score,
      streak
    })
  }, [monthlyBreakdown.breakdown, score, streak])

  const carouselTips = rec.tips

  return (
    <div className="space-y-5 text-slate-800 dark:text-white transition-colors duration-300">
      <section className="glass-card-3d tilt-hover p-6 md:p-8 rounded-3xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-red-500/5 via-transparent to-transparent dark:from-red/5 dark:to-transparent">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-red/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gold font-header">
              <span className="h-2 w-2 rounded-full bg-red animate-pulse" />
              Advanced Smart Recommendation Engine
            </div>
            <h2 className="text-2xl font-black text-slate-850 dark:text-white font-header uppercase tracking-wide">Your AI Sustainability Score</h2>
            <p className="text-sm text-slate-500 dark:text-white/70 max-w-xl leading-relaxed font-medium">Heuristics model updated dynamically from your latest carbon ledger logs.</p>
            <div className="mt-4 inline-flex items-baseline gap-3 rounded-2xl border border-slate-200 bg-white/80 dark:border-white/5 dark:bg-obsidian/40 px-6 py-4 shadow-inner">
              <div className="text-5xl font-black text-red-gradient font-header">{score}</div>
              <div>
                <div className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold font-header">Sustainability Score</div>
                <div className="text-xs font-bold text-slate-700 dark:text-white/80 mt-0.5">Higher score indicates lower carbon output</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-5 w-full md:w-80 transition-colors shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 font-header">Top Impact Category</div>
            <div className="mt-2 text-2xl font-black capitalize text-red-gradient font-header">{rec.topCategory}</div>
            <div className="mt-2 text-xs text-slate-400 dark:text-white/50 leading-relaxed font-medium">Focusing mitigation actions in this category yields the highest reduction.</div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-650 dark:text-white/75 border-t border-slate-200/50 dark:border-white/5 pt-4 leading-relaxed font-medium">
          <span className="font-bold text-slate-900 dark:text-white font-header uppercase tracking-wider text-xs mr-2">Coach Advisor:</span>{' '}
          {rec.dynamicTip.replaceAll('**', '')}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecommendationCard title={rec.challenge.title} detail={rec.challenge.detail} icon="🌿" tone="red" />
        <section className="glass-card-3d tilt-hover p-6 rounded-3xl lg:col-span-2 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Personalized tips</h2>
            <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Based on your highest emission category this month.</p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/65 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-5 transition-all">
            <Carousel tips={carouselTips} />
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rec.tips.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-obsidian/20 p-4 transition-all hover:border-slate-300 dark:hover:border-white/10">
                <div className="text-[10px] text-slate-400 dark:text-white/55 font-bold uppercase tracking-wider font-header">Tip #{idx + 1}</div>
                <div className="text-sm text-slate-700 dark:text-white/80 mt-2 leading-relaxed font-medium">{t}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
        <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Climate Tech Resources</h2>
        <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">External references, reports, and methodologies for carbon footprint mitigation.</p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {rec.resourceLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/5 dark:bg-obsidian/30 dark:hover:bg-obsidian/50 p-5 block transition-all shadow-sm cursor-pointer"
            >
              <div className="text-sm font-bold text-slate-800 dark:text-white hover:text-red transition-colors font-header uppercase tracking-wide">{l.label}</div>
              <div className="text-xs text-slate-450 dark:text-white/50 mt-2.5 break-all font-medium leading-relaxed">{l.url}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

function Carousel({ tips }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!tips.length) return
    const t = setInterval(() => setIdx((i) => (i + 1) % tips.length), 4500)
    return () => clearInterval(t)
  }, [tips.length])

  const tip = tips[idx] ?? ''
  return (
    <div>
      <div className="text-[10px] text-slate-400 dark:text-white/50 font-bold uppercase tracking-wider font-header">EcoTip Highlight</div>
      <div className="mt-2.5 text-lg font-bold text-slate-850 dark:text-white leading-relaxed font-header">{tip}</div>
      <div className="mt-4 flex items-center gap-2">
        {tips.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${i === idx ? 'bg-red w-6' : 'bg-slate-300 dark:bg-white/20 w-2.5'}`}
            aria-label={`Go to tip ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}


