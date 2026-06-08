import React, { useEffect, useMemo, useState } from 'react'
import CarbonMeter from '../components/CarbonMeter.jsx'
import { CategoryPieChart, WeeklyMonthlyChart } from '../components/Charts.jsx'
import { ensureSeedData } from '../utils/storage.js'

function isoToMonthKey(iso) {
  return iso.slice(0, 7) // YYYY-MM
}

function getWeekKey(iso) {
  // Simple week key based on ISO date -> nearest Monday
  const d = new Date(iso + 'T00:00:00')
  const day = (d.getDay() + 6) % 7 // Monday=0
  const monday = new Date(d)
  monday.setDate(d.getDate() - day)
  const y = monday.getFullYear()
  const m = String(monday.getMonth() + 1).padStart(2, '0')
  const dd = String(monday.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export default function Dashboard() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const store = ensureSeedData()
    setHistory(store.history)
  }, [])

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const monthEntries = useMemo(() => history.filter(h => isoToMonthKey(h.dateISO) === currentMonthKey), [history, currentMonthKey])
  const monthTotalKg = useMemo(() => monthEntries.reduce((sum, x) => sum + (x.emissions?.totalKg ?? 0), 0), [monthEntries])

  // CO2 saved this month: compare against a baseline derived from sample pattern.
  const baselinePerDay = 18.5 // demo baseline kg/day
  const baselineTotal = baselinePerDay * Math.max(1, monthEntries.length || new Date().getDate())
  const co2SavedKg = Math.max(0, baselineTotal - monthTotalKg)

  const streak = useMemo(() => {
    // Eco-friendly day defined as <= median of all days in history.
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

  const weekly = useMemo(() => {
    // last 8 weeks
    const keys = new Set()
    const byWeek = new Map()

    for (const h of history) {
      const wk = getWeekKey(h.dateISO)
      keys.add(wk)
      byWeek.set(wk, (byWeek.get(wk) ?? 0) + (h.emissions?.totalKg ?? 0))
    }

    const ordered = [...keys].sort().slice(-8)
    return ordered.map(k => ({ label: k.slice(5), value: byWeek.get(k) ?? 0 }))
  }, [history])

  const monthly = useMemo(() => {
    // last 6 months
    const keys = new Set()
    const byMonth = new Map()

    for (const h of history) {
      const mk = isoToMonthKey(h.dateISO)
      keys.add(mk)
      byMonth.set(mk, (byMonth.get(mk) ?? 0) + (h.emissions?.totalKg ?? 0))
    }

    const ordered = [...keys].sort().slice(-6)
    return ordered.map(k => ({ label: k.slice(5), value: byMonth.get(k) ?? 0 }))
  }, [history])

  const breakdown = useMemo(() => {
    const totalByCat = { transport: 0, food: 0, energy: 0, shopping: 0 }
    for (const h of monthEntries) {
      const b = h.emissions?.breakdownByCategory ?? {}
      totalByCat.transport += b.transport ?? 0
      totalByCat.food += b.food ?? 0
      totalByCat.energy += b.energy ?? 0
      totalByCat.shopping += b.shopping ?? 0
    }
    return totalByCat
  }, [monthEntries])

  return (
    <div className="space-y-5 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <CarbonMeter scoreKg={monthTotalKg} label="This month CO₂ footprint" />

        <section className="glass-card-3d tilt-hover p-6 rounded-3xl lg:col-span-2 transition-all duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">This Month Highlights</h2>
              <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Eco-friendly indicators derived from logged metrics.</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 font-header">Ledger Streak</div>
              <div className="text-3xl font-black text-red-gradient font-header">{streak} day{streak === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-4 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 font-header">Total CO₂ Saved (vs baseline)</div>
              <div className="mt-2.5 flex items-end gap-2">
                <div className="text-3xl font-black text-red-gradient font-header">{co2SavedKg.toFixed(1)}</div>
                <div className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold font-header mb-1">kg</div>
              </div>
              <div className="mt-2.5 text-xs text-slate-400 dark:text-white/50 leading-relaxed font-medium">Standard baseline benchmark.</div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-4 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 font-header">Total Logged Days</div>
              <div className="mt-2.5 flex items-end gap-2">
                <div className="text-3xl font-black text-slate-800 dark:text-white font-header">{monthEntries.length}</div>
                <div className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold font-header mb-1">days</div>
              </div>
              <div className="mt-2.5 text-xs text-slate-400 dark:text-white/50 leading-relaxed font-medium">Higher fidelity enhances AI accuracy.</div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyMonthlyChart title="Last 8 weeks CO₂ (bar)" data={weekly.map(x => ({ label: x.label, kg: x.value }))} mode="bar" dataKeyKg="kg" />
        <WeeklyMonthlyChart title="Last 6 months CO₂ (line)" data={monthly.map(x => ({ label: x.label, kg: x.value }))} mode="line" dataKeyKg="kg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategoryPieChart title="Category breakdown (this month)" breakdownKg={breakdown} />
        <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
          <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Where your CO₂ comes from</h2>
          <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed">Focus on your highest-impact category for the fastest reduction.</p>
          <div className="mt-4 space-y-3">
            {[
              { k: 'transport', label: 'Transport', v: breakdown.transport },
              { k: 'food', label: 'Food', v: breakdown.food },
              { k: 'energy', label: 'Energy', v: breakdown.energy },
              { k: 'shopping', label: 'Shopping', v: breakdown.shopping }
            ].map(x => {
              const pct = monthTotalKg > 0 ? (x.v / monthTotalKg) * 100 : 0
              return (
                <div key={x.k} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-4 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-800 dark:text-white/80 font-bold uppercase tracking-wider font-header">{x.label}</div>
                    <div className="text-sm text-rose-600 dark:text-red font-black font-header">{pct.toFixed(0)}%</div>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-900/60 overflow-hidden border border-slate-200/40 dark:border-white/5">
                    <div className="h-full bg-red" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-white/60 font-semibold">{x.v.toFixed(1)} kg this month</div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}


