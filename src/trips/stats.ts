import type { ScheduleContent, TripConfig } from '../schema/trip'

/** 统计所有日程块中的站点（时间轴条目）数量 */
export function countScheduleStops(trip: TripConfig): number {
  let n = 0
  for (const d of trip.days) {
    for (const s of d.sections) {
      if (s.kind === 'schedule' && s.content) {
        const c = s.content as ScheduleContent
        if (Array.isArray(c.items)) n += c.items.length
      }
    }
  }
  return n
}

/** 行程区块（section）总数 */
export function countSections(trip: TripConfig): number {
  return trip.days.reduce((acc, d) => acc + d.sections.length, 0)
}
