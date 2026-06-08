import React, { useEffect, useMemo, useState } from 'react'
import { ensureSeedData, deleteActivity, clearAllActivities, resetToSeedData } from '../utils/storage.js'

function monthKey(iso) {
  return iso.slice(0, 7)
}

function getWeekKey(iso) {
  const d = new Date(iso + 'T00:00:00')
  const day = (d.getDay() + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - day)
  return monday.toISOString().slice(0, 10)
}

export default function Analytics() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const store = ensureSeedData()
    setHistory(store.history)
  }, [])

  const sorted = useMemo(() => [...history].sort((a, b) => b.dateISO.localeCompare(a.dateISO)), [history])

  const groupedMonthly = useMemo(() => {
    const map = new Map()
    for (const h of history) {
      const k = monthKey(h.dateISO)
      map.set(k, (map.get(k) ?? 0) + (h.emissions?.totalKg ?? 0))
    }
    const ordered = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
    return ordered.map(([k, v]) => ({ label: k.slice(5), kg: v }))
  }, [history])

  const bestWorstWeeks = useMemo(() => {
    const map = new Map()
    for (const h of history) {
      const k = getWeekKey(h.dateISO)
      map.set(k, (map.get(k) ?? 0) + (h.emissions?.totalKg ?? 0))
    }
    const weeks = [...map.entries()].map(([k, totalKg]) => ({ week: k, totalKg }))
    if (!weeks.length) {
      return { best: null, worst: null }
    }
    weeks.sort((a, b) => a.totalKg - b.totalKg)
    return {
      best: weeks[0],
      worst: weeks[weeks.length - 1]
    }
  }, [history])

  const totals = useMemo(() => {
    const res = { transport: 0, food: 0, energy: 0, shopping: 0 }
    for (const h of history) {
      const b = h.emissions?.breakdownByCategory ?? {}
      res.transport += b.transport ?? 0
      res.food += b.food ?? 0
      res.energy += b.energy ?? 0
      res.shopping += b.shopping ?? 0
    }
    const grand = res.transport + res.food + res.energy + res.shopping
    return { ...res, grand }
  }, [history])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this activity log?")) {
      const updated = deleteActivity(id)
      setHistory(updated)
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      const updated = clearAllActivities()
      setHistory(updated)
    }
  }

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset to default demo data? This will overwrite your current logs.")) {
      const updated = resetToSeedData()
      setHistory(updated)
    }
  }

  const handleExportCSV = () => {
    if (!history.length) {
      alert("No data available to export.")
      return
    }
    const headers = 'Date,Transport (kg),Food (kg),Energy (kg),Shopping (kg),Total (kg)\n'
    const rows = sorted.map(h => {
      const t = (h.emissions?.breakdownByCategory?.transport ?? 0).toFixed(2)
      const f = (h.emissions?.breakdownByCategory?.food ?? 0).toFixed(2)
      const e = (h.emissions?.breakdownByCategory?.energy ?? 0).toFixed(2)
      const s = (h.emissions?.breakdownByCategory?.shopping ?? 0).toFixed(2)
      const tot = (h.emissions?.totalKg ?? 0).toFixed(2)
      return `${h.dateISO},${t},${f},${e},${s},${tot}`
    }).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `ecotrack_emissions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const breakdownRows = [
    { label: 'Transport', key: 'transport' },
    { label: 'Food', key: 'food' },
    { label: 'Energy', key: 'energy' },
    { label: 'Shopping', key: 'shopping' }
  ]

  return (
    <div className="space-y-5 text-slate-800 dark:text-white transition-colors duration-300">
      {/* Visual summaries & Best/Worst weeks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="glass-card-3d tilt-hover p-6 rounded-3xl lg:col-span-2 transition-all duration-300">
          <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Monthly comparison (last 6 months)</h2>
          <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Aggregated carbon footprint across recent billing/logging periods.</p>
          
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {groupedMonthly.map((m) => (
              <div key={m.label} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-4 transition-all hover:border-slate-350 dark:hover:border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 font-header">{m.label}</div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <div className="text-2xl font-black text-red-gradient font-header">{m.kg.toFixed(1)}</div>
                  <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold font-header">kg</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-white/50 font-semibold mt-1">Footprint log</div>
              </div>
            ))}
            {groupedMonthly.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-slate-400 dark:text-white/50 font-medium">No monthly logs found.</div>
            )}
          </div>
        </section>

        <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Best & Worst Weeks</h2>
            <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Peak efficiency vs high-impact weeks.</p>
          </div>
          <div className="mt-5 space-y-4">
            <StatCard title="Best week" value={bestWorstWeeks.best ? bestWorstWeeks.best.totalKg.toFixed(1) : '—'} subtitle={bestWorstWeeks.best ? `Commenced: ${bestWorstWeeks.best.week}` : 'No data'} tone="gold" />
            <StatCard title="Worst week" value={bestWorstWeeks.worst ? bestWorstWeeks.worst.totalKg.toFixed(1) : '—'} subtitle={bestWorstWeeks.worst ? `Commenced: ${bestWorstWeeks.worst.week}` : 'No data'} tone="red" />
          </div>
        </section>
      </div>

      {/* Data Management Section */}
      <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
        <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Ledger Controls</h2>
        <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Download CSV spreadsheet backups, clear all history, or restore the demo data.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-header transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            title="Download logs as CSV"
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleResetData}
            className="rounded-xl border border-slate-200/80 bg-slate-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-rose-600 dark:text-red px-5 py-3 text-xs font-bold uppercase tracking-wider font-header transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            title="Restore 45-day default seed history"
          >
            🔄 Reset to Demo
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-105 dark:border-rose-950/20 dark:bg-rose-950/10 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-450 px-5 py-3 text-xs font-bold uppercase tracking-wider font-header transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            title="Clear all logs permanently"
          >
            🗑️ Clear Ledger
          </button>
        </div>
      </section>

      {/* Overall breakdown metrics */}
      <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
        <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Category share (all-time)</h2>
        <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Distribution shares computed across your entire sustainability ledger history.</p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdownRows.map((row) => {
            const v = totals[row.key] ?? 0
            const pct = totals.grand > 0 ? (v / totals.grand) * 100 : 0
            return (
              <div key={row.key} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-4 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-800 dark:text-white/80 font-bold uppercase tracking-wider font-header">{row.label}</div>
                  <div className="text-sm text-rose-600 dark:text-red font-black font-header">{pct.toFixed(0)}%</div>
                </div>
                <div className="mt-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-900/60 overflow-hidden border border-slate-200/40 dark:border-white/5">
                  <div className="h-full bg-red" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-white/60 font-semibold">{v.toFixed(1)} kg total</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* List / History Table */}
      <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Full Activity History</h2>
            <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">Review daily entries. Deleting rows updates metrics in real-time.</p>
          </div>
          <div className="text-xs text-slate-500 dark:text-white/60 font-bold bg-slate-100/80 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 font-header uppercase tracking-wider">
            Total entries: {history.length}
          </div>
        </div>

        <div className="mt-4 overflow-auto max-h-[500px] rounded-2xl border border-slate-200/60 dark:border-white/5">
          <table className="w-full min-w-[720px] text-sm text-left border-collapse">
            <thead>
              <tr className="text-slate-400 dark:text-white/40 border-b border-slate-250/60 dark:border-white/5 font-bold bg-slate-50/30 dark:bg-obsidian/20 font-header uppercase tracking-widest text-[11px]">
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Transport</th>
                <th className="py-3 px-4 font-bold">Food</th>
                <th className="py-3 px-4 font-bold">Energy</th>
                <th className="py-3 px-4 font-bold">Shopping</th>
                <th className="py-3 px-4 font-bold">Total</th>
                <th className="py-3 px-4 text-center font-bold w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 60).map((h) => (
                <tr key={h.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-3.5 px-4 text-slate-800 dark:text-white/80 font-bold font-header">{h.dateISO}</td>
                  {['transport', 'food', 'energy', 'shopping'].map((k) => (
                    <td key={k} className="py-3.5 px-4 text-slate-600 dark:text-white/60 font-medium">{(h.emissions?.breakdownByCategory?.[k] ?? 0).toFixed(2)} kg</td>
                  ))}
                  <td className="py-3.5 px-4 text-red-gradient font-black font-header">{(h.emissions?.totalKg ?? 0).toFixed(2)} kg</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="text-slate-400 hover:text-rose-500 dark:text-white/30 dark:hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                      title="Delete activity log"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 dark:text-white/50 font-semibold">No logs found. Try adding some logs on the Log page!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {history.length > 60 ? (
          <div className="mt-3.5 text-xs text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider font-header">Showing the latest 60 entries of your dataset.</div>
        ) : null}
      </section>
    </div>
  )
}

function StatCard({ title, value, subtitle, tone }) {
  const isRed = tone === 'red'
  const textColor = isRed 
    ? 'text-rose-600 dark:text-rose-400 font-black' 
    : 'text-gold-gradient font-black'
  const accentBorder = isRed 
    ? 'border-l-4 border-l-rose-500' 
    : 'border-l-4 border-l-gold'

  return (
    <div className={`rounded-2xl border border-slate-205 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-5 ${accentBorder} transition-all duration-300 shadow-sm`}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 font-header">{title}</div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <div className={`text-3xl font-black font-header ${textColor}`}>{value}</div>
        <div className="text-[10px] text-slate-450 dark:text-white/40 uppercase tracking-widest font-bold font-header">kg CO₂</div>
      </div>
      <div className="text-xs text-slate-400 dark:text-white/50 mt-2 font-medium">{subtitle}</div>
    </div>
  )
}


