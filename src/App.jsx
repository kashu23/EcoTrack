import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LogActivity from './pages/LogActivity.jsx'
import Analytics from './pages/Analytics.jsx'
import Recommendations from './pages/Recommendations.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'

import { applyThemeFromStorage, getThemePref, subscribeTheme, getCurrentUser, subscribeAuth } from './utils/storage.js'

function PrivateRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AnimatedRoutes({ user }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="animate-fadeIn">
      <Routes>
        <Route path="/" element={<PrivateRoute user={user}><Home /></PrivateRoute>} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard key={user?.email} /></PrivateRoute>} />
        <Route path="/log" element={<PrivateRoute user={user}><LogActivity key={user?.email} /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute user={user}><Analytics key={user?.email} /></PrivateRoute>} />
        <Route path="/recommendations" element={<PrivateRoute user={user}><Recommendations key={user?.email} /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute user={user}><About key={user?.email} /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => getThemePref())
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    applyThemeFromStorage()
    const unsubTheme = subscribeTheme(() => {
      setTheme(getThemePref())
      applyThemeFromStorage()
    })
    const unsubAuth = subscribeAuth(() => {
      setUser(getCurrentUser())
    })
    return () => {
      unsubTheme()
      unsubAuth()
    }
  }, [])

  const content = useMemo(() => (
    <Suspense fallback={null}>
      <AnimatedRoutes user={user} />
    </Suspense>
  ), [user])

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white font-sans">
      <Navbar theme={theme} user={user} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{content}</main>
      <Footer />

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .animate-fadeIn{animation:fadeIn 260ms ease both}`}</style>
    </div>
  )
}

