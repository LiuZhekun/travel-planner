import type { TripConfig, TripMeta } from '../schema/trip'
import demoTrip from './demo'
import guangyuanTrip from './guangyuan'

export const trips: TripMeta[] = [projectMeta(guangyuanTrip), projectMeta(demoTrip)]

export const tripConfigsById: Record<string, TripConfig> = {
  [guangyuanTrip.id]: guangyuanTrip,
  [demoTrip.id]: demoTrip,
}

export function getTripConfig(tripId: string): TripConfig | null {
  return tripConfigsById[tripId] ?? null
}

function projectMeta(trip: TripConfig): TripMeta {
  const { id, title, cover, tags, searchKeywords, start, end } = trip
  return { id, title, cover, tags, searchKeywords, start, end }
}

