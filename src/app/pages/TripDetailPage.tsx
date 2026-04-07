import { useEffect, useMemo, useState } from 'react'
import type { TocItem } from '../../components/Toc'
import { Toc } from '../../components/Toc'
import { SectionCard } from '../../components/SectionCard'
import { setLastViewed } from '../../storage/notes'
import { getTripConfig } from '../../trips/registry'
import { getTripKeywords, setTripKeywords } from '../../storage/keywords'
import { buildTripToolJumpHrefs, ExternalJumpLink } from '../../externalLinks'
import { countScheduleStops } from '../../trips/stats'

function parseKeywords(text: string) {
  return String(text)
    .split(/[，,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10)
}

export function TripDetailPage(props: { tripId: string }) {
  const { tripId } = props
  const trip = getTripConfig(tripId)

  const fallbackKeywords = useMemo(() => {
    return trip?.searchKeywords?.length ? trip.searchKeywords : [trip?.title ?? '']
  }, [trip])

  const [keywordsText, setKeywordsText] = useState('')

  useEffect(() => {
    if (!trip) return
    const saved = getTripKeywords(trip.id, fallbackKeywords)
    setKeywordsText(saved.join(', '))
  }, [trip, fallbackKeywords])

  const tocItems: TocItem[] = useMemo(() => {
    if (!trip) return []
    return trip.days.flatMap((day) => day.sections.map((sec) => ({ sectionId: sec.id, title: sec.title })))
  }, [trip])

  const stopCount = trip ? countScheduleStops(trip) : 0
  const dayCount = trip?.days.length ?? 0

  const query = useMemo(() => parseKeywords(keywordsText).join(' '), [keywordsText])
  const urls = useMemo(() => buildTripToolJumpHrefs(query), [query])

  if (!trip) {
    return (
      <div className="page">
        <p className="subtle">未找到该旅行配置：{tripId}</p>
      </div>
    )
  }

  const cfg = trip

  function onJump(sectionId: string) {
    const el = document.getElementById(`section-${sectionId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setLastViewed({ tripId, sectionId })
  }

  function saveKeywords() {
    const arr = parseKeywords(keywordsText)
    if (arr.length) setTripKeywords(cfg.id, arr)
  }

  function onExportShare() {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#/trip/${encodeURIComponent(cfg.id)}`
    if (navigator.share) {
      void navigator.share({ title: cfg.title, url }).catch(() => {
        void navigator.clipboard.writeText(url)
      })
    } else {
      void navigator.clipboard.writeText(url)
    }
  }

  const dateLine =
    cfg.start && cfg.end ? `${cfg.start} · ${cfg.end}` : cfg.start ? cfg.start : '日程一览'

  return (
    <div data-trip-id={cfg.id}>
      <div className="page" style={{ paddingTop: 4 }}>
        <header className="tripDetailHero">
          <div className="tripDetailHeroTop">
            <div>
              <span className="tripDetailKicker">进行中的冒险</span>
              <h1 className="tripDetailHeroTitle">{cfg.title}</h1>
              <p className="tripDetailHeroMeta">{dateLine}</p>
            </div>
            <button type="button" className="tripDetailExportBtn" onClick={onExportShare}>
              <span className="material-symbols-outlined">ios_share</span>
              分享
            </button>
          </div>

          <div className="tripStatsRow" aria-label="行程概览">
            <div className="tripStatChip tripStatChip--food">
              <span className="material-symbols-outlined">restaurant</span>
              <span>{stopCount} 站点</span>
            </div>
            <div className="tripStatChip tripStatChip--route">
              <span className="material-symbols-outlined">calendar_view_week</span>
              <span>{dayCount} 天</span>
            </div>
            <div className="tripStatChip tripStatChip--pay">
              <span className="material-symbols-outlined">edit_note</span>
              <span>离线备注</span>
            </div>
          </div>

          <div className="portalScroller" style={{ paddingTop: 4 }}>
            <ExternalJumpLink className="portalChip" href={urls.map}>
              <span className="portalChipIcon portalChipIcon--map">
                <span className="material-symbols-outlined">map</span>
              </span>
              <span>高德</span>
            </ExternalJumpLink>
            <ExternalJumpLink className="portalChip" href={urls.xhs}>
              <span className="portalChipIcon portalChipIcon--xhs">
                <span className="material-symbols-outlined">favorite</span>
              </span>
              <span>小红书</span>
            </ExternalJumpLink>
            <ExternalJumpLink className="portalChip" href={urls.douyin}>
              <span className="portalChipIcon portalChipIcon--douyin">
                <span className="material-symbols-outlined">bolt</span>
              </span>
              <span>抖音</span>
            </ExternalJumpLink>
          </div>
        </header>

        <Toc items={tocItems} onJump={onJump} />

        <div className="card tripToolCard">
          <div className="noteLabel" style={{ marginTop: 0 }}>
            <span>地图 / 小红书 / 抖音跳转关键词</span>
            <span className="subtle">本地存储</span>
          </div>
          <input
            className="keywordsArea"
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            onBlur={saveKeywords}
            placeholder="例：广元 昭化 皇泽寺"
          />
          <div className="actionRow">
            <ExternalJumpLink className="actionBtn" href={urls.map}>
              地图
            </ExternalJumpLink>
            <ExternalJumpLink className="actionBtn" href={urls.xhs}>
              小红书
            </ExternalJumpLink>
            <ExternalJumpLink className="actionBtn" href={urls.douyin}>
              抖音
            </ExternalJumpLink>
          </div>
        </div>

        <div className="tripTimelineShell">
          <div className="tripTimelineLine" aria-hidden />
          {cfg.days.map((day, di) => (
            <section key={day.id} className="dayBlock" style={{ animationDelay: `${di * 0.06}s` }}>
              <h2 className="dayTitle">{day.title}</h2>
              {day.sections.map((sec) => (
                <SectionCard key={sec.id} tripId={cfg.id} section={sec} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
