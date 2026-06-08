import React, { useMemo, useState } from 'react'

// NOTE: Recharts had dependency-resolution issues in this environment.
// To keep the demo fully working, we implement lightweight interactive
// charting with SVG + tooltips (still interactive on hover).

function Tooltip({ x, y, children }) {
  if (x == null || y == null) return null
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 10, top: y + 10 }}
    >
      <div className="rounded-xl border border-slate-200 bg-white/95 text-slate-800 dark:border-white/10 dark:bg-dark/90 dark:text-white/80 backdrop-blur px-3 py-2 text-xs shadow-lg transition-colors duration-150">
        {children}
      </div>
    </div>
  )
}

export function WeeklyMonthlyChart({ title, data, mode = 'bar', dataKeyKg }) {
  const [tip, setTip] = useState({ x: null, y: null, label: '', value: 0 })

  const max = useMemo(() => Math.max(1, ...data.map(d => Number(d[dataKeyKg] ?? 0))), [data, dataKeyKg])

  const width = 720
  const height = 240
  const padding = 34
  const plotW = width - padding * 2
  const plotH = height - padding * 2

  const points = useMemo(() => {
    return data.map((d, i) => {
      const v = Number(d[dataKeyKg] ?? 0)
      const x = padding + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW)
      const y = padding + (1 - v / max) * plotH
      return { x, y, label: d.label, v }
    })
  }, [data, dataKeyKg, max])

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <section className="glass-card-3d tilt-hover p-6 rounded-3xl text-slate-800 dark:text-white transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">{title}</h2>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 font-header">Hover for tooltips</div>
      </div>

      <div className="h-72 mt-4">
        <div className="w-full h-full flex items-center">
          <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              {/* Grid */}
              {[0, 1, 2, 3].map((i) => {
                const y = padding + (i / 3) * plotH
                return (
                  <line
                    key={i}
                    x1={padding}
                    x2={width - padding}
                    y1={y}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-white/10"
                    strokeDasharray="4 4"
                  />
                )
              })}

              {/* Axes labels */}
              <text x={padding} y={height - 10} className="fill-slate-500 dark:fill-white/60 font-medium" fontSize="11">kg</text>

              {mode === 'line' ? (
                <>
                  <polyline fill="none" stroke="#e11d48" strokeWidth="3" points={polyline} strokeLinejoin="round" strokeLinecap="round" />
                  {points.map((p, idx) => (
                    <g
                      key={idx}
                      onMouseMove={(e) => {
                        setTip({ x: e.clientX, y: e.clientY, label: p.label, value: p.v })
                      }}
                      onMouseLeave={() => setTip({ x: null, y: null, label: '', value: 0 })}
                    >
                      <circle cx={p.x} cy={p.y} r={6} fill="#e11d48" className="hover:scale-125 transition-transform cursor-pointer" opacity={0.95} />
                    </g>
                  ))}
                </>
              ) : (
                <>
                  {points.map((p, idx) => {
                    const barW = plotW / Math.max(1, data.length) * 0.65
                    const x = p.x - barW / 2
                    const h = (p.v / max) * plotH
                    const y = padding + (plotH - h)
                    return (
                      <g
                        key={idx}
                        onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, label: p.label, value: p.v })}
                        onMouseLeave={() => setTip({ x: null, y: null, label: '', value: 0 })}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={barW}
                          height={Math.max(2, h)}
                          rx={6}
                          fill="#e11d48"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                          opacity={0.92}
                        />
                      </g>
                    )
                  })}
                </>
              )}
            </svg>

            <Tooltip x={tip.x} y={tip.y}>
              <div className="font-semibold">{tip.label}</div>
              <div className="text-rose-600 dark:text-red font-medium mt-0.5">{Number(tip.value).toFixed(1)} kg CO₂</div>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CategoryPieChart({ title, breakdownKg }) {
  const [tip, setTip] = useState({ x: null, y: null, label: '', value: 0, pct: 0 })

  const data = [
    { name: 'Transport', key: 'transport', value: breakdownKg?.transport ?? 0, color: '#e11d48' },
    { name: 'Food', key: 'food', value: breakdownKg?.food ?? 0, color: '#fb7185' },
    { name: 'Energy', key: 'energy', value: breakdownKg?.energy ?? 0, color: '#e11d48' },
    { name: 'Shopping', key: 'shopping', value: breakdownKg?.shopping ?? 0, color: '#2dd4bf' }
  ]

  const total = data.reduce((s, d) => s + d.value, 0) || 1

  const cx = 160
  const cy = 130
  const r = 86

  // SVG arc helper
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0)
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    }
  }

  function describeArc(startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
      'L', cx, cy,
      'Z'
    ].join(' ')
  }

  let current = 0
  const slices = data.map((d) => {
    const startAngle = current
    const sliceAngle = (d.value / total) * 360
    const endAngle = current + sliceAngle
    current = endAngle
    return { ...d, startAngle, endAngle }
  })

  return (
    <section className="glass-card-3d tilt-hover p-6 rounded-3xl text-slate-800 dark:text-white transition-all duration-300">
      <h2 className="text-base font-bold text-slate-850 dark:text-white font-header uppercase tracking-wider">{title}</h2>
      <div className="mt-4 h-72">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 320 260" className="w-full h-full">
            {slices.map((s) => {
              const pct = (s.value / total) * 100
              return (
                <path
                  key={s.key}
                  d={describeArc(s.startAngle, s.endAngle)}
                  fill={s.color}
                  opacity={0.92}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, label: s.name, value: s.value, pct })}
                  onMouseLeave={() => setTip({ x: null, y: null, label: '', value: 0, pct: 0 })}
                />
              )
            })}

            <circle cx={cx} cy={cy} r={44} className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-white/10 transition-colors duration-200" />
            <text x={cx} y={cy - 4} fill="#e11d48" fontSize="22" fontWeight="700" textAnchor="middle">
              {Math.round(total)}
            </text>
            <text x={cx} y={cy + 20} className="fill-slate-500 dark:fill-white/65 font-medium" fontSize="12" textAnchor="middle">
              kg
            </text>
          </svg>

          <Tooltip x={tip.x} y={tip.y}>
            <div className="font-semibold">{tip.label}</div>
            <div className="text-rose-600 dark:text-red font-medium mt-0.5">{tip.pct.toFixed(0)}% • {Number(tip.value).toFixed(1)} kg CO₂</div>
          </Tooltip>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((d) => {
          const pct = (d.value / total) * 100
          return (
            <div key={d.key} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-obsidian/30 p-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-800 dark:text-white/80 font-bold flex items-center gap-2 font-header uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
                <div className="text-sm text-rose-600 dark:text-red font-black font-header">{pct.toFixed(0)}%</div>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-white/60 font-semibold">{d.value.toFixed(1)} kg</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}



