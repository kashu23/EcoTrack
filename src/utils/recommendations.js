import { CO2_FACTORS } from './carbonCalculator.js'

const CATEGORY_ORDER = ['transport', 'food', 'energy', 'shopping']

function pickHighestCategory(breakdownByCategory) {
  let best = { key: 'transport', value: 0 }
  for (const k of CATEGORY_ORDER) {
    const v = breakdownByCategory?.[k] ?? 0
    if (v >= best.value) best = { key: k, value: v }
  }
  return best.key
}

function scoreToLevel(score) {
  if (score <= 25) return 'low'
  if (score <= 50) return 'medium'
  return 'high'
}

function challengeFor(category, streak) {
  // Keep challenges simple and motivating.
  if (category === 'transport') return { title: 'Go car-free for 3 days', detail: 'Swap car trips for cycling, walking, or public transport.' }
  if (category === 'food') return { title: 'Plant-forward meal streak (3 days)', detail: 'Aim for 2 vegetarian or vegan meals per day.' }
  if (category === 'energy') return { title: 'Energy check: reduce usage by 10%', detail: 'Lower electricity and limit gas-heavy activities where possible.' }
  return { title: 'Mindful shopping: 2 no-buy days', detail: 'Delay non-essential purchases and consolidate orders.' }
}

function tipSetFor(category) {
  switch (category) {
    case 'transport':
      return [
        'Combine trips to reduce total distance.',
        'Choose public transport for 1 journey this week.',
        'Try cycling for short distances (under 5 km) when feasible.'
      ]
    case 'food':
      return [
        'Replace one meat meal with vegetarian or vegan today.',
        'Keep portions balanced; food emissions scale with frequency.',
        'Explore local seasonal options to cut the overall footprint.'
      ]
    case 'energy':
      return [
        'Use efficient settings: turn off unused devices and lights.',
        'Shift to electricity where possible and optimize heating/cooling.',
        'Track gas usage—small reductions add up monthly.'
      ]
    case 'shopping':
      return [
        'Consolidate online orders to reduce shipping impact.',
        'Delay new clothing purchases and consider repairs or second-hand.',
        'Set a “one-in, one-out” rule for non-essential items.'
      ]
    default:
      return ['Small changes compound over time.', 'Track your habits weekly and adjust gradually.']
  }
}

export function buildRecommendations({ monthlyBreakdown, score, streak }) {
  const topCategory = pickHighestCategory(monthlyBreakdown)
  const level = scoreToLevel(score)

  const { title, detail } = challengeFor(topCategory, streak)

  const tips = tipSetFor(topCategory)

  const dynamicTip = (() => {
    if (level === 'high') {
      return `Your biggest opportunity is **${topCategory}**. Focus here first for the fastest CO₂ reduction.`
    }
    if (level === 'medium') {
      return `You're on track. A targeted change in **${topCategory}** can push your score into the next level.`
    }
    return `Great job—keep optimizing **${topCategory}** to maintain momentum.`
  })()

  const resourceLinks = [
    { label: 'Low-carbon meal planning', url: 'https://www.un.org/en/climatechange/raising-ambition' },
    { label: 'Transport emissions guide', url: 'https://www.iea.org/topics/transport' },
    { label: 'Energy efficiency tips', url: 'https://www.iea.org/topics/energy-efficiency' }
  ]

  return {
    topCategory,
    dynamicTip,
    tips,
    challenge: { title, detail },
    resourceLinks
  }
}

