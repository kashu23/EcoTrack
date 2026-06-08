import React, { useState } from 'react'
import ActivityForm from '../components/ActivityForm.jsx'
import { ensureSeedData } from '../utils/storage.js'

export default function LogActivity() {
  const [savedCount, setSavedCount] = useState(0)

  // Seed on page load
  ensureSeedData()

  return (
    <div className="space-y-5 text-slate-800 dark:text-white transition-colors duration-300">
      <ActivityForm onSaved={() => setSavedCount(c => c + 1)} />

      <section className="glass-card-3d tilt-hover p-6 rounded-3xl transition-all duration-300">
        <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Your Ledger History</h2>
        <p className="text-sm text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-medium">
          Saved entries instantly update the Dashboard metrics, visual Analytics tables, and AI Recommendations.
        </p>
        <div className="mt-4 text-sm text-slate-750 dark:text-white/80 font-semibold font-header uppercase tracking-wider">
          Total logs registered this session: <span className="text-red-gradient font-black">{savedCount}</span>
        </div>
      </section>
    </div>
  )
}

