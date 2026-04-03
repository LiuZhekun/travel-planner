import { useEffect, useMemo, useState } from 'react'
import type { TocItem } from '../../components/Toc'
import { Toc } from '../../components/Toc'
import { SectionCard } from '../../components/SectionCard'
import { setLastViewed } from '../../storage/notes'
import { getTripConfig } from '../../trips/registry'
import { getTripKeywords, setTripKeywords } from '../../storage/keywords'
import { buildShareUrls } from '../../utils/shareLinks'

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
    return trip.days.flatMap((day) =>
      day.sections.map((sec) => ({ sectionId: sec.id, title: sec.title }))
    )
  }, [trip])

  if (!trip) {
    return (
      <div className="page">
        <p className="subtle">未找到该旅行配置：{tripId}</p>
      </div>
    )
  }

  function onJump(sectionId: string) {
    const el = document.getElementById(`section-${sectionId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setLastViewed({ tripId, sectionId })
  }

  function parseKeywords(text: string) {
    return String(text)
      .split(/[，,]/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10)
  }

  function saveKeywords() {
    if (!trip) return
    const arr = parseKeywords(keywordsText)
    if (arr.length) setTripKeywords(trip.id, arr)
  }

  const query = useMemo(() => parseKeywords(keywordsText).join(' '), [keywordsText])
  const urls  = useMemo(() => buildShareUrls(query), [query])

  return (
    <div data-trip-id={trip.id}>
      {/* 渐变 Hero Header */}
      <div className="tripDetailHero">
        <div className="tripDetailHeroTitle">{trip.title}</div>
        <div className="tripDetailHeroMeta">
          {trip.start && (
            <span className="tripDetailHeroPill">
              📅 {trip.start}{trip.end ? ` → ${trip.end}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* 吸顶 TOC */}
      <Toc items={tocItems} onJump={onJump} />

      <div className="page">
        {/* 关键词工具卡 */}
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
            <a className="actionBtn" href={urls.map}    target="_blank" rel="noreferrer">🗺 地图</a>
            <a className="actionBtn" href={urls.xhs}    target="_blank" rel="noreferrer">📕 小红书</a>
            <a className="actionBtn" href={urls.douyin} target="_blank" rel="noreferrer">🎵 抖音</a>
          </div>
        </div>

        {/* 按天渲染 */}
        {trip.days.map((day, di) => (
          <section
            key={day.id}
            className="dayBlock"
            style={{ animationDelay: `${di * 0.07}s` }}
          >
            <h2 className="dayTitle">{day.title}</h2>
            {day.sections.map((sec) => (
              <SectionCard key={sec.id} tripId={trip.id} section={sec} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
