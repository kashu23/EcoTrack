import React, { useEffect, useMemo, useState } from 'react'
import { calculateEmissions } from '../utils/carbonCalculator.js'
import { addActivity } from '../utils/storage.js'

const emptyActivity = () => ({
  dateISO: new Date().toISOString().slice(0, 10),
  transport: { carKm: '', flightKm: '', publicTransportKm: '', cyclingKm: '' },
  food: { meatMeals: '', vegetarianMeals: '', veganMeals: '' },
  energy: { electricityKwh: '', gasCubicMeters: '' },
  shopping: { onlineOrders: '', newClothingItems: '' }
})

export default function ActivityForm({ onSaved }) {
  const [form, setForm] = useState(emptyActivity)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emissionsPreview = useMemo(() => {
    try {
      const emissions = calculateEmissions(form)
      return emissions
    } catch {
      return { totalKg: 0, breakdownByCategory: { transport: 0, food: 0, energy: 0, shopping: 0 } }
    }
  }, [form])

  useEffect(() => {
    // Ensure default date matches today
    setForm(f => ({ ...f, dateISO: f.dateISO || new Date().toISOString().slice(0, 10) }))
  }, [])

  function setField(path, value) {
    setForm(prev => {
      const next = structuredClone(prev)
      const [group, field] = path.split('.')
      next[group][field] = value
      return next
    })
  }

  function reset() {
    setForm(emptyActivity())
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const dateISO = form.dateISO
    if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
      setError('Please provide a valid date.')
      return
    }

    const entry = {
      dateISO,
      transport: {
        carKm: form.transport.carKm,
        flightKm: form.transport.flightKm,
        publicTransportKm: form.transport.publicTransportKm,
        cyclingKm: form.transport.cyclingKm
      },
      food: {
        meatMeals: form.food.meatMeals,
        vegetarianMeals: form.food.vegetarianMeals,
        veganMeals: form.food.veganMeals
      },
      energy: {
        electricityKwh: form.energy.electricityKwh,
        gasCubicMeters: form.energy.gasCubicMeters
      },
      shopping: {
        onlineOrders: form.shopping.onlineOrders,
        newClothingItems: form.shopping.newClothingItems
      }
    }

    const anyValue = Object.values(entry.transport).some(v => String(v).trim() !== '') ||
      Object.values(entry.food).some(v => String(v).trim() !== '') ||
      Object.values(entry.energy).some(v => String(v).trim() !== '') ||
      Object.values(entry.shopping).some(v => String(v).trim() !== '')

    if (!anyValue) {
      setError('Add at least one activity value.')
      return
    }

    setLoading(true)
    try {
      const saved = addActivity(entry)
      onSaved?.(saved)
      reset()
    } catch (err) {
      setError('Failed to save activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Log Daily Activity</h2>
          <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">EcoTrack auto-calculates carbon metric factors from your inputs.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 dark:text-white/50 font-bold uppercase tracking-wider font-header">Estimated Today</div>
          <div className="text-2xl font-black text-red-gradient font-header">{emissionsPreview.totalKg.toFixed(2)} kg</div>
          <div className="text-[10px] text-slate-400 dark:text-white/40 font-semibold uppercase tracking-wider font-header">(real-time preview)</div>
        </div>
      </div>

      <form className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={onSubmit}>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-white/70 font-header">Date</label>
          <input
            type="date"
            value={form.dateISO}
            onChange={(e) => setForm(prev => ({ ...prev, dateISO: e.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 dark:border-white/5 dark:bg-obsidian/30 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red/60 font-medium transition-all"
            required
          />
        </div>

        {/* Transport */}
        <fieldset className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-obsidian/20 transition-all">
          <legend className="px-3 text-xs text-slate-650 dark:text-white/80 font-bold uppercase tracking-wider font-header">Transport</legend>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <LabeledInput label="Car (km)" value={form.transport.carKm} onChange={(v) => setField('transport.carKm', v)} placeholder="0" />
            <LabeledInput label="Flight (km)" value={form.transport.flightKm} onChange={(v) => setField('transport.flightKm', v)} placeholder="0" />
            <LabeledInput label="Public Transport (km)" value={form.transport.publicTransportKm} onChange={(v) => setField('transport.publicTransportKm', v)} placeholder="0" />
            <LabeledInput label="Cycling (km)" value={form.transport.cyclingKm} onChange={(v) => setField('transport.cyclingKm', v)} placeholder="0" />
          </div>
        </fieldset>

        {/* Food */}
        <fieldset className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-obsidian/20 transition-all">
          <legend className="px-3 text-xs text-slate-650 dark:text-white/80 font-bold uppercase tracking-wider font-header">Food</legend>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <LabeledInput label="Meat meals" value={form.food.meatMeals} onChange={(v) => setField('food.meatMeals', v)} placeholder="0" />
            <LabeledInput label="Vegetarian meals" value={form.food.vegetarianMeals} onChange={(v) => setField('food.vegetarianMeals', v)} placeholder="0" />
            <div className="col-span-2">
              <LabeledInput label="Vegan meals" value={form.food.veganMeals} onChange={(v) => setField('food.veganMeals', v)} placeholder="0" />
            </div>
          </div>
        </fieldset>

        {/* Energy */}
        <fieldset className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-obsidian/20 transition-all">
          <legend className="px-3 text-xs text-slate-650 dark:text-white/80 font-bold uppercase tracking-wider font-header">Energy</legend>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <LabeledInput label="Electricity (kWh)" value={form.energy.electricityKwh} onChange={(v) => setField('energy.electricityKwh', v)} placeholder="0" />
            <LabeledInput label="Gas (m³)" value={form.energy.gasCubicMeters} onChange={(v) => setField('energy.gasCubicMeters', v)} placeholder="0" />
          </div>
        </fieldset>

        {/* Shopping */}
        <fieldset className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-obsidian/20 transition-all">
          <legend className="px-3 text-xs text-slate-650 dark:text-white/80 font-bold uppercase tracking-wider font-header">Shopping</legend>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <LabeledInput label="Online orders" value={form.shopping.onlineOrders} onChange={(v) => setField('shopping.onlineOrders', v)} placeholder="0" />
            <LabeledInput label="New clothing items" value={form.shopping.newClothingItems} onChange={(v) => setField('shopping.newClothingItems', v)} placeholder="0" />
          </div>
        </fieldset>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between border-t border-slate-100 dark:border-white/5 pt-4">
          {error ? (
            <div className="text-sm font-semibold text-rose-500 dark:text-red-300">{error}</div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-white/60 font-medium leading-relaxed">Tip: Even partial logs help improve recommendation accuracy.</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-header transition-all active:scale-95 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-rose-500 to-red hover:opacity-90 disabled:opacity-75 text-white dark:text-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider font-header transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {loading ? 'Saving…' : 'Save Ledger Entry'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

function LabeledInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-white/60 font-header">{label}</div>
      <input
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-white/5 dark:bg-obsidian/30 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red/60 font-medium placeholder-slate-400 dark:placeholder-slate-550 transition-all shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
      />
    </label>
  )
}


