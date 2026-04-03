const STORAGE_KEY = 'travel_planner_state_v1';
const SCHEMA_VERSION = 1;

export type LastViewed = {
  tripId?: string
  dayId?: string
  sectionId?: string
  scrollY?: number
  updatedAt?: number
}

export type NotesState = {
  schemaVersion: number
  notes: Record<string, Record<string, string>> // { [tripId]: { [sectionId]: note } }
  lastViewed?: LastViewed
}

function readState(): NotesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { schemaVersion: SCHEMA_VERSION, notes: {} }
    }
    const parsed = JSON.parse(raw) as Partial<NotesState>
    if (!parsed || typeof parsed !== 'object') throw new Error('invalid state')
    return {
      schemaVersion: typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : SCHEMA_VERSION,
      notes: (parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {}) as NotesState['notes'],
      lastViewed: parsed.lastViewed,
    }
  } catch {
    return { schemaVersion: SCHEMA_VERSION, notes: {} }
  }
}

function writeState(next: NotesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function getSectionNote(tripId: string, sectionId: string): string {
  const state = readState()
  return state.notes?.[tripId]?.[sectionId] ?? ''
}

export function setSectionNote(tripId: string, sectionId: string, note: string) {
  const trimmed = String(note ?? '').slice(0, 300)
  const state = readState()
  const tripNotes = state.notes[tripId] ?? {}
  tripNotes[sectionId] = trimmed
  state.notes[tripId] = tripNotes
  state.schemaVersion = SCHEMA_VERSION
  writeState(state)
}

export function getLastViewed(): LastViewed | undefined {
  const state = readState()
  return state.lastViewed
}

export function setLastViewed(next: LastViewed) {
  const state = readState()
  state.lastViewed = { ...next, updatedAt: Date.now() }
  state.schemaVersion = SCHEMA_VERSION
  writeState(state)
}

export function clearNotes() {
  localStorage.removeItem(STORAGE_KEY)
}

