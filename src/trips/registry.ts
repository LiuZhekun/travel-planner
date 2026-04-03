import type { TripConfig, TripMeta } from '../schema/trip'
import demoTrip from './demo'

export const trips: TripMeta[] = [projectMeta(demoTrip)]

export const tripConfigsById: Record<string, TripConfig> = {
  [demoTrip.id]: demoTrip,
}

export function getTripConfig(tripId: string): TripConfig | null {
  return tripConfigsById[tripId] ?? null
}

function projectMeta(trip: TripConfig): TripMeta {
  const { id, title, cover, tags, searchKeywords, start, end } = trip
  return { id, title, cover, tags, searchKeywords, start, end }
}

