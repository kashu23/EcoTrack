import React from 'react'

export default function About() {
  return (
    <div className="space-y-5 text-slate-800 dark:text-white transition-colors duration-300">
      {/* Overview Section */}
      <section className="glass-card-3d tilt-hover p-8 rounded-3xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-red-500/5 via-transparent to-transparent dark:from-red/5 dark:to-transparent">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-red/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white font-header uppercase tracking-wide">About EcoTrack</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-white/60 max-w-3xl leading-relaxed font-medium">
            EcoTrack is an interactive personal carbon accounting application designed to track, analyze, and mitigate carbon dioxide emissions from daily routines. By logging metrics across transportation, nutrition, home energy usage, and consumption, users receive actionable, data-driven recommendations to steadily lower their environmental footprint.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <InfoPill label="Software Stack" value="React, Tailwind CSS & Vite" />
            <InfoPill label="Storage Protocol" value="User-Isolated Client Sandbox" />
            <InfoPill label="Data Engine" value="Responsive SVG Charting" />
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="glass-card-3d tilt-hover p-8 rounded-3xl transition-all duration-300">
        <h3 className="text-xl font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Core Features</h3>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              t: 'Precise Carbon Accounting',
              d: 'Calculates specific CO₂ emissions across transport (car, flights, public transit), food (meat/veg meals), utilities (electricity, gas), and shopping items using standard environmental coefficient factors.'
            },
            {
              t: 'Vector Visualizations',
              d: 'Displays dynamic, custom-rendered SVG line, bar, and pie charts with interactive hover tooltips that load instantly without external tracking libraries.'
            },
            {
              t: 'Interactive Coach Challenges',
              d: 'An intelligent rules engine automatically evaluates user activity, highlights the highest-impact consumption category, and serves up actionable sustainability habits.'
            }
          ].map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-5 transition-all">
              <div className="text-red-gradient font-bold text-xs font-header uppercase tracking-wider">Feature 0{i + 1}</div>
              <div className="text-base font-bold mt-2 text-slate-800 dark:text-white font-header uppercase tracking-wide">{s.t}</div>
              <div className="text-sm text-slate-500 dark:text-white/60 mt-2.5 leading-relaxed font-medium">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="glass-card-3d tilt-hover p-8 rounded-3xl transition-all duration-300">
        <h3 className="text-xl font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">Design & Philosophy</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase font-header tracking-wider">Data Privacy First</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
              We believe in complete data autonomy. EcoTrack isolates storage sandboxes by user account directly in local browser memory. No data is shared, collected, or uploaded to third-party servers.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase font-header tracking-wider">Aesthetic Accessibility</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
              Designed with a premium glassmorphic layout and high-contrast accessibility rules. Toggling the theme converts all primary text elements cleanly between deep black and crisp white.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase font-header tracking-wider">Zero-Dependency Speed</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
              Built to load instantly. By avoiding heavy external charting packages, EcoTrack remains lightweight, loading vector graphs and calculations with zero latency.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 dark:border-white/5 dark:bg-obsidian/20 p-4 transition-all">
      <div className="text-[10px] text-slate-400 dark:text-white/50 font-bold uppercase tracking-wider font-header">{label}</div>
      <div className="text-sm font-bold text-slate-700 dark:text-white mt-1.5">{value}</div>
    </div>
  )
}
