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
    return trip?.searchKeywords && trip.searchKeywords.length ? trip.searchKeywords : [trip?.title ?? '']
  }, [trip])

  const [keywordsText, setKeywordsText] = useState('')

  useEffect(() => {
    if (!trip) return
    const saved = getTripKeywords(trip.id, fallbackKeywords)
    setKeywordsText(saved.join(', '))
  }, [trip, fallbackKeywords])

  const tocItems: TocItem[] = useMemo(() => {
    if (!trip) return []
    const items: TocItem[] = []
    for (const day of trip.days) {
      for (const sec of day.sections) {
        items.push({ sectionId: sec.id, title: sec.title })
      }
    }
    return items
  }, [trip])

  if (!trip) {
    return (
      <div className="page">
        <div className="topbar">
          <h1 className="topbarTitle">旅行详情</h1>
        </div>
        <p>未找到该旅行配置：{tripId}</p>
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
    if (!arr.length) return
    setTripKeywords(trip.id, arr)
  }

  const query = useMemo(() => {
    const arr = parseKeywords(keywordsText)
    return arr.join(' ')
  }, [keywordsText])

  const urls = useMemo(() => buildShareUrls(query), [query])

  return (
    <>
      <div className="topbar">
        <div className="detailHeader">
          <div>
            <h1 className="topbarTitle">{trip.title}</h1>
            <div className="subtle" style={{ marginTop: 6 }}>
              共 {trip.days.length} 天 · {tocItems.length} 个模块
            </div>
          </div>
          <div className="subtle" style={{ textAlign: 'right' }}>
            {trip.start ? <div>起：{trip.start}</div> : null}
            {trip.end ? <div>止：{trip.end}</div> : null}
          </div>
        </div>
      </div>

      <Toc items={tocItems} onJump={onJump} />

      <div className="page">
        <div className="card tripCard">
          <div className="noteLabel" style={{ marginTop: 0 }}>
            <span>地图/小红书/抖音跳转关键词（本地保存）</span>
            <span className="subtle">逗号分隔</span>
          </div>
          <input
            className="keywordsArea"
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            onBlur={saveKeywords}
            placeholder="例如：广元 昭化 皇泽寺"
          />
          <div className="actionRow">
            <a className="actionBtn" href={urls.map} target="_blank" rel="noreferrer">
              地图
            </a>
            <a className="actionBtn" href={urls.xhs} target="_blank" rel="noreferrer">
              小红书
            </a>
            <a className="actionBtn" href={urls.douyin} target="_blank" rel="noreferrer">
              抖音
            </a>
          </div>
          <div className="subtle" style={{ marginTop: 10, fontSize: 13 }}>
            未做联网依赖：仅根据关键词生成跳转链接。
          </div>
        </div>

        {trip.days.map((day) => (
          <section key={day.id} className="dayBlock">
            <h2 className="dayTitle">{day.title}</h2>
            {day.sections.map((sec) => (
              <SectionCard key={sec.id} tripId={trip.id} section={sec} />
            ))}
          </section>
        ))}
      </div>
    </>
  )
}

