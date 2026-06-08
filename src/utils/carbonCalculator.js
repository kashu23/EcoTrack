export const CO2_FACTORS = {
  transport: {
    car: 0.21,
    flight: 0.255,
    publicTransport: 0.089,
    cycling: 0
  },
  food: {
    meat: 6.61,
    vegetarian: 1.69,
    vegan: 0.94
  },
  energy: {
    electricity: 0.233,
    gas: 2.04
  },
  shopping: {
    onlineOrder: 0.5,
    clothingItem: 10
  }
}

export function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function calculateEmissions(activity) {
  // activity: { dateISO, transport, food, energy, shopping }
  const t = activity?.transport ?? {}
  const f = activity?.food ?? {}
  const e = activity?.energy ?? {}
  const s = activity?.shopping ?? {}

  const car = toNumber(t.carKm) * CO2_FACTORS.transport.car
  const flight = toNumber(t.flightKm) * CO2_FACTORS.transport.flight
  const publicTransport = toNumber(t.publicTransportKm) * CO2_FACTORS.transport.publicTransport
  const cycling = toNumber(t.cyclingKm) * CO2_FACTORS.transport.cycling

  const meat = toNumber(f.meatMeals) * CO2_FACTORS.food.meat
  const vegetarian = toNumber(f.vegetarianMeals) * CO2_FACTORS.food.vegetarian
  const vegan = toNumber(f.veganMeals) * CO2_FACTORS.food.vegan

  const electricity = toNumber(e.electricityKwh) * CO2_FACTORS.energy.electricity
  const gas = toNumber(e.gasCubicMeters) * CO2_FACTORS.energy.gas

  const onlineOrder = toNumber(s.onlineOrders) * CO2_FACTORS.shopping.onlineOrder
  const clothingItem = toNumber(s.newClothingItems) * CO2_FACTORS.shopping.clothingItem

  const total = car + flight + publicTransport + cycling + meat + vegetarian + vegan + electricity + gas + onlineOrder + clothingItem

  const breakdownByCategory = {
    transport: car + flight + publicTransport + cycling,
    food: meat + vegetarian + vegan,
    energy: electricity + gas,
    shopping: onlineOrder + clothingItem
  }

  return {
    totalKg: total,
    breakdownByCategory
  }
}

