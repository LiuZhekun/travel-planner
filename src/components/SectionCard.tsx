import { useEffect, useState } from 'react'
import type { TripSection, ScheduleContent, CardsContent, TransportContent } from '../schema/trip'
import { getSectionNote, setSectionNote } from '../storage/notes'
import {
  ExternalJumpLink,
  resolveAmapNavHref,
  resolveXhsSearchHref,
} from '../externalLinks'
import { useImagePreview } from './ImagePreview'

// ── 时间轴圆点颜色（Kinetic Nomad 令牌）──
const dotColor: Record<string, string> = {
  sight:     'var(--color-primary)',
  meal:      'var(--color-primary-container)',
  transport: 'var(--color-secondary)',
  night:     'var(--color-tertiary)',
}

// ── 图片缩略图（可点击全屏预览） ──
function ImgThumb({ src, alt }: { src: string; alt: string }) {
  const { openPreview } = useImagePreview()
  return (
    <button
      type="button"
      className="itemThumbBtn"
      onClick={() => openPreview(src, alt)}
      aria-label={`放大查看：${alt}`}
    >
      <img
        className="itemThumb"
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </button>
  )
}

// ── 小红书参考按钮 ──
function MapNavBtn({ keyword, city = '广元' }: { keyword: string; city?: string }) {
  return (
    <ExternalJumpLink className="mapBtn" href={resolveAmapNavHref(keyword, city)}>
      导航
    </ExternalJumpLink>
  )
}

function XhsBtn({ keyword }: { keyword: string }) {
  return (
    <ExternalJumpLink className="xhsBtn" href={resolveXhsSearchHref(keyword)} aria-label="小红书图片参考">
      📕 图片参考
    </ExternalJumpLink>
  )
}

// ── 时间轴区块 ──
function ScheduleSection({ content }: { content: ScheduleContent }) {
  return (
    <div className="tlRoot">
      {content.items.map((item, i) => (
        <div key={i} className="tlItem">
          {/* 左侧 */}
          <div className="tlLeft">
            <div
              className="tlDot"
              style={{ background: dotColor[item.type ?? 'sight'] ?? dotColor.sight }}
            />
            {i < content.items.length - 1 && <div className="tlLine" />}
            <div className="tlTime">{item.time}</div>
          </div>

          {/* 右侧卡片 */}
          <div className="tlCard">
            {/* 图片缩略图（有图时右上角展示） */}
            {item.image && (
              <ImgThumb src={item.image} alt={item.title} />
            )}
            <div className="tlTitle">{item.title}</div>
            {item.desc && <div className="tlDesc">{item.desc}</div>}
            <div className="tlFoot">
              <div className="tlFootLeft">
                {item.duration && <span className="tlDur">⏱ {item.duration}</span>}
                {/* 无图有关键词 → 小红书按钮 */}
                {!item.image && item.xhsKeyword && (
                  <XhsBtn keyword={item.xhsKeyword} />
                )}
              </div>
              {item.mapKeyword && <MapNavBtn keyword={item.mapKeyword} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 卡片列表区块 ──
function CardsSection({ content }: { content: CardsContent }) {
  return (
    <div className="cardsList">
      {content.items.map((item, i) => (
        <div key={i} className="cardsItem">
          <div className="cardsItemLeft">
            {item.icon && <span className="cardsIcon">{item.icon}</span>}
            <div className="cardsInfo">
              <div className="cardsTitle">
                {item.title}
                {item.badge && <span className="cardsBadge">{item.badge}</span>}
              </div>
              {item.subtitle && <div className="cardsSub">{item.subtitle}</div>}
              {item.desc && <div className="cardsDesc">{item.desc}</div>}
              {/* 按钮行 */}
              <div className="cardsActions">
                {item.mapKeyword && <MapNavBtn keyword={item.mapKeyword} />}
                {item.xhsKeyword && (
                  <XhsBtn keyword={item.xhsKeyword} />
                )}
              </div>
            </div>
          </div>
          {/* 图片缩略图（有 CDN 图时右侧展示） */}
          {item.image && (
            <ImgThumb src={item.image} alt={item.title} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── 交通卡片区块 ──
function TransportSection({ content }: { content: TransportContent }) {
  const { outbound, returnOptions, outboundNote, returnNote, returnRoute: returnRouteRaw } = content
  const outboundTitle = `${outbound.from} → ${outbound.to}`
  const returnRoute = returnRouteRaw ?? `${outbound.to} → ${outbound.from}`

  return (
    <div className="transportRoot">
      <section className="transportBlock transportBlock--out" aria-label="往程">
        <header className="transportBlockHead">
          <span className="transportPill transportPill--out">往</span>
          <div className="transportBlockHeadText">
            <div className="transportBlockTitle">去程 · 前往 {outbound.to}</div>
            <div className="transportBlockSub">{outboundTitle}{outboundNote ? ` · ${outboundNote}` : ''}</div>
          </div>
        </header>
        <div className="trainHero">
          <div className="trainNum">{outbound.num}</div>
          <div className="trainRoute">
            <div className="trainStation">
              <div className="stName">{outbound.from}</div>
              <div className="stTime">{outbound.fromTime}</div>
            </div>
            <div className="trainArrow">→</div>
            <div className="trainStation" style={{ textAlign: 'right' }}>
              <div className="stName">{outbound.to}</div>
              <div className="stTime">{outbound.toTime}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="transportBlock transportBlock--return" aria-label="返程">
        <header className="transportBlockHead">
          <span className="transportPill transportPill--return">返</span>
          <div className="transportBlockHeadText">
            <div className="transportBlockTitle">返程 · 离开 {outbound.to}</div>
            <div className="transportBlockSub">
              {returnRoute}
              {returnNote ? ` · ${returnNote}` : ''}
              {' · '}以下时间为<strong className="transportEm">广元站发车</strong>，任选其一
            </div>
          </div>
        </header>
        <div className="returnList">
          <div className="returnListHeader" aria-hidden>
            <span>车次</span>
            <span>发车</span>
            <span>说明</span>
          </div>
          {returnOptions.map((opt) => (
            <div key={opt.num} className={`returnRow ${opt.recommended ? 'recommended' : ''}`}>
              <div className="returnTag">{opt.num}</div>
              <div className="returnTime">{opt.time}</div>
              <div className="returnNote">
                {opt.recommended && <span className="recBadge">推荐</span>}
                {opt.note}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── 主 SectionCard ──
export function SectionCard(props: { tripId: string; section: TripSection }) {
  const { tripId, section } = props
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    setNote(getSectionNote(tripId, section.id))
  }, [tripId, section.id])

  function onChangeNote(next: string) {
    setNote(next)
    setSectionNote(tripId, section.id, next)
  }

  function renderContent() {
    if (section.kind === 'schedule'  && section.content) return <ScheduleSection  content={section.content as ScheduleContent}  />
    if (section.kind === 'cards'     && section.content) return <CardsSection     content={section.content as CardsContent}     />
    if (section.kind === 'transport' && section.content) return <TransportSection content={section.content as TransportContent} />
    return <p className="subtle" style={{ padding: '8px 0' }}>内容待填充（kind: {section.kind}）</p>
  }

  return (
    <article className="sectionCard card" id={`section-${section.id}`}>
      <header
        className="sectionHeader"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v) }}
      >
        <div className="sectionHeaderTitle">{section.title}</div>
        <span className={`sectionHeaderChevron ${expanded ? 'open' : ''}`}>›</span>
      </header>

      {expanded && (
        <div className="sectionBody">
          {renderContent()}

          <div className="noteLabel" style={{ marginTop: 12 }}>
            <span>本块备注</span>
            <span className="subtle">{note.length}/300</span>
          </div>
          <textarea
            className="noteArea"
            value={note}
            placeholder="离线可用；记录确认要点、临时想法…"
            onChange={(e) => onChangeNote(e.target.value)}
          />
        </div>
      )}
    </article>
  )
}
