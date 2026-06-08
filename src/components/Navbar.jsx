import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getThemePref, toggleTheme, logout } from '../utils/storage.js'

export default function Navbar({ theme, user }) {
  const themeNow = theme ?? getThemePref()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-md transition-all duration-300 dark:border-white/5 dark:bg-obsidian/75">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red/10 border border-red/30 flex items-center justify-center">
            <span className="text-red text-sm font-black tracking-wider uppercase font-header">Eco</span>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-white/40 font-header">Ledger Protocol</div>
            <div className="text-base font-black tracking-wide text-slate-900 dark:text-white font-header">EcoTrack</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')} end>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')}>
                Dashboard
              </NavLink>
              <NavLink to="/log" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')}>
                Log
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')}>
                Analytics
              </NavLink>
              <NavLink to="/recommendations" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')}>
                Tips
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'px-3.5 py-2 rounded-xl bg-slate-200/85 text-slate-950 dark:bg-white/5 dark:text-red dark:border dark:border-red/20 font-bold text-xs tracking-wider uppercase transition-all' : 'px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all')}>
                About
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 dark:border-white/10 dark:bg-obsidian-card dark:hover:bg-white/5 dark:text-gold font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {themeNow === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-white/60">
                Hi, {user.name}
              </span>
              <button onClick={handleLogout} className="rounded-xl border border-red-500/20 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 text-xs text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer">
                Logout
              </button>
              <Link to="/log" className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red hover:opacity-90 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 transition-all shadow-md dark:shadow-red/10">
                Log
                <span aria-hidden>→</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red hover:opacity-90 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 transition-all shadow-md dark:shadow-red/10">
              Sign In
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}



