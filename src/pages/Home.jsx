import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/40 dark:border-white/5 dark:bg-obsidian-card/30 backdrop-blur-md transition-all duration-300">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-red/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        
        <div className="relative p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gold font-header">
              <span className="h-2 w-2 rounded-full bg-red animate-ping" />
              Sustainability Hackathon Prototype v1.0
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white font-header">
              Track Your Impact. <br />
              <span className="text-red-gradient">Change Your World.</span>
            </h1>

            <p className="max-w-xl text-slate-500 dark:text-white/60 text-base md:text-lg leading-relaxed font-medium">
              EcoTrack turns everyday activities into an AI-powered sustainability score—so you can see where your CO₂ comes from and what to change next.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/dashboard"
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red hover:opacity-90 px-8 py-4 font-bold text-xs uppercase tracking-widest text-white dark:text-slate-950 inline-flex items-center justify-center gap-2 transition-all shadow-lg dark:shadow-red/10"
              >
                Enter Ledger
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/log"
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-white transition-all inline-flex items-center justify-center"
              >
                Log Today
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-red/20 to-gold/25 rounded-full blur-2xl opacity-40 animate-pulse" />
              <img 
                src="/luxury_eco_globe.png" 
                alt="EcoGlobe 3D Ledger Asset" 
                className="h-60 w-60 md:h-76 md:w-76 object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(225, 29, 72,0.25)] dark:drop-shadow-[0_30px_60px_rgba(197,168,128,0.18)]"
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}
              />
              <style>{`
                @keyframes float {
                  0% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-12px) rotate(2deg); }
                  100% { transform: translateY(0px) rotate(0deg); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card-3d tilt-hover p-8 rounded-3xl transition-all duration-300">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-header">Personal Accountability Protocol</h2>
          <p className="text-slate-500 dark:text-white/60 mt-3 leading-relaxed font-medium text-sm">
            Climate action starts with awareness. EcoTrack helps users understand their footprint by category and week—then suggests practical next steps.
          </p>
          <ul className="mt-5 space-y-2 text-xs font-bold text-slate-450 dark:text-white/40 uppercase tracking-wider">
            <li>✦ Dashboard: score, streaks, monthly overview</li>
            <li>✦ Analytics: best/worst weeks & category shares</li>
            <li>✦ Recommendations: targeted tips and eco challenges</li>
          </ul>
        </div>
        <div className="glass-card-3d tilt-hover p-8 bg-gradient-to-br from-red-500/5 to-transparent dark:from-red/5 dark:to-transparent rounded-3xl transition-all duration-300">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-header">Seeded Ledger Sandbox</h2>
          <p className="text-slate-500 dark:text-white/60 mt-3 leading-relaxed font-medium text-sm">
            No registration or credentials required. On initialization, EcoTrack seeds a realistic, deterministic 45-day history into browser storage so judges can explore immediately.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/analytics" className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white inline-flex items-center justify-center transition-all">
              Explore Analytics
            </Link>
            <Link to="/recommendations" className="rounded-xl bg-gradient-to-r from-rose-500 to-red hover:opacity-90 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 inline-flex items-center justify-center transition-all shadow-md">
              View Recommendations
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}



