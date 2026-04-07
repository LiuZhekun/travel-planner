const PREFIX = 'travel-planner-expenses:'

export type ExpenseCategory = 'food' | 'stay' | 'transport' | 'misc'

export type ExpenseItem = {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  createdAt: number
}

export type TripExpenseState = {
  budget: number | null
  items: ExpenseItem[]
}

const defaultState = (): TripExpenseState => ({ budget: null, items: [] })

function key(tripId: string) {
  return `${PREFIX}${tripId}`
}

export function loadTripExpenses(tripId: string): TripExpenseState {
  try {
    const raw = localStorage.getItem(key(tripId))
    if (!raw) return defaultState()
    const p = JSON.parse(raw) as Partial<TripExpenseState>
    if (!p || typeof p !== 'object') return defaultState()
    const budget =
      p.budget === null || p.budget === undefined
        ? null
        : typeof p.budget === 'number' && Number.isFinite(p.budget) && p.budget >= 0
          ? p.budget
          : null
    const items = Array.isArray(p.items)
      ? p.items.filter(
          (x): x is ExpenseItem =>
            x &&
            typeof x === 'object' &&
            typeof x.id === 'string' &&
            typeof x.title === 'string' &&
            typeof x.amount === 'number' &&
            Number.isFinite(x.amount) &&
            x.amount >= 0 &&
            ['food', 'stay', 'transport', 'misc'].includes(x.category) &&
            typeof x.createdAt === 'number',
        )
      : []
    return { budget, items }
  } catch {
    return defaultState()
  }
}

export function saveTripExpenses(tripId: string, state: TripExpenseState) {
  localStorage.setItem(key(tripId), JSON.stringify(state))
}

export function clearTripExpenses(tripId: string) {
  localStorage.removeItem(key(tripId))
}
