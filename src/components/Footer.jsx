import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 mt-12 transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-slate-500 dark:text-white/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-header uppercase tracking-wider">
          <span className="text-slate-800 dark:text-gold font-bold">EcoTrack</span> — Personal Carbon Footprint Ledger
        </div>
        <div className="font-medium text-center md:text-right">
          Demo sandbox powered by browser LocalStorage. Developed for UOE Summer of Code 2026.
        </div>
      </div>
    </footer>
  )
}

