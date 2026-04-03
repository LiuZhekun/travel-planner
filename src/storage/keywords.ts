const STORAGE_KEY = 'travel_planner_keywords_v1'
const SCHEMA_VERSION = 1

type KeywordsState = {
  schemaVersion: number
  keywordsByTripId: Record<string, string[]> // { [tripId]: ['kw1','kw2'] }
}

function readState(): KeywordsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { schemaVersion: SCHEMA_VERSION, keywordsByTripId: {} }
    const parsed = JSON.parse(raw) as Partial<KeywordsState>
    return {
      schemaVersion: typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : SCHEMA_VERSION,
      keywordsByTripId:
        parsed.keywordsByTripId && typeof parsed.keywordsByTripId === 'object' ? parsed.keywordsByTripId : {},
    }
  } catch {
    return { schemaVersion: SCHEMA_VERSION, keywordsByTripId: {} }
  }
}

function writeState(next: KeywordsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function getTripKeywords(tripId: string, fallback: string[]): string[] {
  const state = readState()
  const saved = state.keywordsByTripId[tripId]
  if (Array.isArray(saved) && saved.length) return saved
  return fallback
}

export function setTripKeywords(tripId: string, keywords: string[]) {
  const state = readState()
  state.keywordsByTripId[tripId] = keywords
  state.schemaVersion = SCHEMA_VERSION
  writeState(state)
}

