import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/storage.js'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email) return
    login(name, email)
    navigate('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fadeIn">
      <div className="glass-card-3d w-full max-w-md rounded-3xl p-8 tilt-hover transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-red/10 border border-red/30 flex items-center justify-center shadow-[0_0_30px_rgba(225, 29, 72,0.2)] dark:shadow-[0_0_30px_rgba(225, 29, 72,0.1)]">
            <span className="text-red text-xl font-black tracking-wider uppercase font-header">Eco</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-center mb-2 font-header text-slate-900 dark:text-white">Welcome Back</h1>
        <p className="text-center text-slate-500 dark:text-white/50 mb-8 text-sm font-medium">Enter your details to access your EcoTrack dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 pl-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 dark:border-white/10 dark:bg-obsidian-card dark:text-white dark:placeholder-white/20 transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 pl-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 dark:border-white/10 dark:bg-obsidian-card dark:text-white dark:placeholder-white/20 transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red px-4 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(225, 29, 72,0.5)] active:translate-y-0"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
