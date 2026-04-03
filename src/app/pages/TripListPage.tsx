import { tripHref } from '../router'
import { trips } from '../../trips/registry'

// 每个行程的封面 emoji（按 id 映射）
const TRIP_EMOJI: Record<string, string> = {
  'guangyuan-3d': '🏯',
  'demo':         '✈️',
}

// 问候语（按小时段）
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6)  return '夜深了，还在计划？'
  if (h < 10) return '早安，出发前再看一眼'
  if (h < 13) return '上午好，今天去哪里？'
  if (h < 18) return '下午好，旅途愉快'
  return '晚上好，规划今晚的行程'
}

export function TripListPage() {
  const greeting = getGreeting()

  return (
    <>
      {/* 欢迎区域 */}
      <div className="listHero">
        <div className="listHeroGreeting">{greeting}</div>
        <div className="listHeroTitle">我的旅行</div>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        {trips.map((t, i) => (
          <a
            key={t.id}
            className="card tripCard"
            href={tripHref(t.id)}
            data-trip-id={t.id}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* 渐变封面区 */}
            <div className="tripCardHero">
              <div className="tripCardHeroEmoji">
                {TRIP_EMOJI[t.id] ?? '🗺'}
              </div>
              <div className="tripCardHeroTitle">{t.title}</div>
            </div>

            {/* 信息区 */}
            <div className="tripCardBody">
              <div className="tripMetaRow">
                {t.tags?.slice(0, 3).map((tag) => (
                  <span className="pill" key={tag}>{tag}</span>
                ))}
                {t.start && (
                  <span className="pill accent">
                    {t.start}{t.end ? ` → ${t.end}` : ''}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
