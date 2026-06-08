import { calculateEmissions } from './carbonCalculator.js'

const LS_KEY = 'ecotrack.v1'
const LS_THEME_KEY = 'ecotrack.theme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'

const subscribers = new Set()

export function getThemePref() {
  const stored = localStorage.getItem(LS_THEME_KEY)
  if (stored) return stored
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemDark ? THEME_DARK : THEME_LIGHT
}

export function subscribeTheme(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

export function toggleTheme() {
  const cur = getThemePref()
  const next = cur === THEME_DARK ? THEME_LIGHT : THEME_DARK
  localStorage.setItem(LS_THEME_KEY, next)
  document.documentElement.classList.toggle('dark', next === THEME_DARK)
  emitTheme()
}

function emitTheme() {
  for (const cb of subscribers) cb()
}

export function applyThemeFromStorage() {
  const theme = getThemePref()
  const root = document.documentElement
  if (theme === THEME_DARK) {
    root.classList.add('dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0f172a') // obsidian color
  } else {
    root.classList.remove('dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8fafc') // slate-50
  }
}

function stableId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export function getStore() {
  const user = getCurrentUser()
  const key = user ? `${LS_KEY}.${user.email}` : LS_KEY
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveStore(store) {
  const user = getCurrentUser()
  const key = user ? `${LS_KEY}.${user.email}` : LS_KEY
  localStorage.setItem(key, JSON.stringify(store))
}

function buildSeedHistory() {
  // Create ~45 days of realistic demo activity.
  const now = new Date()
  const days = 45
  const history = []

  function isoDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const weekday = d.getDay()

    // Deterministic-ish pseudo pattern
    const transportCar = weekday === 0 || weekday === 6 ? 6 + (i % 9) : (i % 6)
    const transportPublic = weekday === 1 || weekday === 3 ? 5 + (i % 7) : (i % 3)
    const transportFlight = (i % 17 === 0) ? 900 : 0
    const transportCycling = (i % 10 === 0) ? 4 + (i % 5) : 0

    const meatMeals = weekday === 2 ? 1 : 0
    const vegMeals = (weekday === 4 || weekday === 5) ? 1 : 0
    const veganMeals = (i % 9 === 0) ? 1 : 0

    const electricity = 9 + (i % 8)
    const gas = 0.08 + (i % 7) * 0.01

    const onlineOrders = (i % 8 === 0) ? 1 : (i % 15 === 0 ? 2 : 0)
    const clothingItems = (i % 26 === 0) ? 1 : 0

    const activity = {
      id: stableId(),
      dateISO: isoDate(d),
      transport: {
        carKm: transportCar,
        flightKm: transportFlight,
        publicTransportKm: transportPublic,
        cyclingKm: transportCycling
      },
      food: {
        meatMeals,
        vegetarianMeals: vegMeals,
        veganMeals
      },
      energy: {
        electricityKwh: electricity,
        gasCubicMeters: gas
      },
      shopping: {
        onlineOrders,
        newClothingItems: clothingItems
      },
      createdAt: Date.now() - i * 86400000
    }

    const emissions = calculateEmissions(activity)
    activity.emissions = {
      totalKg: emissions.totalKg,
      breakdownByCategory: emissions.breakdownByCategory
    }

    history.push(activity)
  }

  return history
}

export function ensureSeedData() {
  const existing = getStore()
  if (existing?.history?.length) return existing

  const store = {
    version: 1,
    createdAt: Date.now(),
    history: buildSeedHistory()
  }

  saveStore(store)
  return store
}

export function addActivity(entry) {
  const store = ensureSeedData()
  const history = store.history ?? []

  const emissions = calculateEmissions(entry)
  const enriched = {
    ...entry,
    id: entry.id ?? stableId(),
    emissions: {
      totalKg: emissions.totalKg,
      breakdownByCategory: emissions.breakdownByCategory
    },
    createdAt: entry.createdAt ?? Date.now()
  }

  const idx = history.findIndex(h => h.dateISO === enriched.dateISO)
  if (idx >= 0) {
    // Overwrite same day to keep UX simple.
    history[idx] = enriched
  } else {
    history.push(enriched)
  }

  store.history = history
  saveStore(store)
  return enriched
}

export function deleteActivity(id) {
  const store = ensureSeedData()
  const history = store.history ?? []
  store.history = history.filter(h => h.id !== id)
  saveStore(store)
  return store.history
}

export function clearAllActivities() {
  const store = ensureSeedData()
  store.history = []
  saveStore(store)
  return []
}

export function resetToSeedData() {
  const user = getCurrentUser()
  const key = user ? `${LS_KEY}.${user.email}` : LS_KEY
  localStorage.removeItem(key)
  const store = ensureSeedData()
  return store.history
}

// --- Auth Mock ---
const LS_AUTH_KEY = 'ecotrack.auth'
const authSubscribers = new Set()

export function subscribeAuth(cb) {
  authSubscribers.add(cb)
  return () => authSubscribers.delete(cb)
}

function emitAuth() {
  for (const cb of authSubscribers) cb()
}

export function getCurrentUser() {
  const stored = localStorage.getItem(LS_AUTH_KEY)
  return stored ? JSON.parse(stored) : null
}

export function login(name, email) {
  const user = { name, email, token: stableId() }
  localStorage.setItem(LS_AUTH_KEY, JSON.stringify(user))
  emitAuth()
  return user
}

export function logout() {
  localStorage.removeItem(LS_AUTH_KEY)
  emitAuth()
}

