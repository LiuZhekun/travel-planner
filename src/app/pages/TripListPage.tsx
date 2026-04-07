import { useMemo } from 'react'
import { tripHref } from '../router'
import { getTripConfig, trips } from '../../trips/registry'
import { buildTripToolJumpHrefs, ExternalJumpLink } from '../../externalLinks'
import { countScheduleStops } from '../../trips/stats'
import type { TripMeta } from '../../schema/trip'

const TRIP_EMOJI: Record<string, string> = {
  'guangyuan-3d': '🏯',
  demo: '✈️',
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6) return '夜深了，还在计划？'
  if (h < 10) return '早安，出发前再看一眼'
  if (h < 13) return '上午好，今天去哪里？'
  if (h < 18) return '下午好，旅途愉快'
  return '晚上好，规划今晚的行程'
}

function formatDateRange(t: TripMeta): string {
  if (t.start && t.end) return `${t.start} — ${t.end}`
  if (t.start) return t.start
  return '日期待定'
}

function listBadge(t: TripMeta): { className: string; text: string } {
  if (t.id === 'demo') {
    return { className: 'tripCardBadge tripCardBadge--draft', text: '示例' }
  }
  const end = t.end
  if (end && /^\d{4}-\d{2}-\d{2}$/.test(end)) {
    const d = new Date(`${end}T12:00:00`)
    if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) {
      return { className: 'tripCardBadge tripCardBadge--done', text: '已完成' }
    }
  }
  return { className: 'tripCardBadge tripCardBadge--upcoming', text: '即将出发' }
}

export function TripListPage() {
  const greeting = getGreeting()

  const portalUrls = useMemo(() => {
    const kw =
      trips
        .flatMap((x) => x.searchKeywords ?? [])
        .filter(Boolean)
        .slice(0, 4)
        .join(' ') || '广元'
    return buildTripToolJumpHrefs(kw)
  }, [])

  return (
    <div className="page">
      <header className="listHero">
        <p className="listHeroGreeting">{greeting}</p>
        <h2 className="listHeroTitle">我的旅程</h2>
      </header>

      <section aria-label="地图与内容门户">
        <div className="portalScroller">
          <ExternalJumpLink className="portalChip" href={portalUrls.map}>
            <span className="portalChipIcon portalChipIcon--map">
              <span className="material-symbols-outlined">explore</span>
            </span>
            <span>高德地图</span>
          </ExternalJumpLink>
          <ExternalJumpLink className="portalChip" href={portalUrls.xhs}>
            <span className="portalChipIcon portalChipIcon--xhs">
              <span className="material-symbols-outlined">favorite</span>
            </span>
            <span>小红书</span>
          </ExternalJumpLink>
          <ExternalJumpLink className="portalChip" href={portalUrls.douyin}>
            <span className="portalChipIcon portalChipIcon--douyin">
              <span className="material-symbols-outlined">bolt</span>
            </span>
            <span>抖音</span>
          </ExternalJumpLink>
        </div>
      </section>

      <section className="addJourneyCard" aria-label="新建行程占位">
        <div className="addJourneyIcon" aria-hidden>
          <span className="material-symbols-outlined">add</span>
        </div>
        <h3 className="addJourneyTitle">开启下一段旅程</h3>
        <p className="addJourneySub">在代码中新增行程配置即可出现在此列表</p>
      </section>

      <section className="tripListSection" aria-label="行程列表">
        {trips.map((t, i) => {
          const full = getTripConfig(t.id)
          const stops = full ? countScheduleStops(full) : 0
          const badge = listBadge(t)

          return (
            <a
              key={t.id}
              className="tripCard"
              href={tripHref(t.id)}
              data-trip-id={t.id}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="tripCardCover">
                {t.cover ? (
                  <img className="tripCardCoverImg" src={t.cover} alt="" loading="lazy" />
                ) : (
                  <div className="tripCardCoverFallback" aria-hidden>
                    <span className="tripCardCoverEmoji">{TRIP_EMOJI[t.id] ?? '🗺'}</span>
                  </div>
                )}
                <span className={badge.className}>{badge.text}</span>
              </div>
              <div className="tripCardBody">
                <div className="tripCardTitleRow">
                  <h3 className="tripCardTitle">{t.title}</h3>
                  <span className="tripCardPin">
                    <span className="material-symbols-outlined">pin_drop</span>
                    {stops}
                  </span>
                </div>
                <p className="tripCardDate">
                  <span className="material-symbols-outlined">calendar_month</span>
                  {formatDateRange(t)}
                </p>
                {t.tags && t.tags.length > 0 ? (
                  <div className="tripMetaRow">
                    {t.tags.slice(0, 4).map((tag) => (
                      <span className="pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </a>
          )
        })}
      </section>
    </div>
  )
}
