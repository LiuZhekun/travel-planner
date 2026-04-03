import { tripHref } from '../router'
import { getLastViewed } from '../../storage/notes'
import { trips } from '../../trips/registry'

export function TripListPage() {
  const last = getLastViewed()
  const lastTripId = last?.tripId

  return (
    <>
      <div className="topbar">
        <h1 className="topbarTitle">旅行规划</h1>
        {lastTripId ? (
          <div className="subtle" style={{ marginTop: 6 }}>
            上次查看：<a href={tripHref(lastTripId)}>{lastTripId}</a>
          </div>
        ) : (
          <div className="subtle" style={{ marginTop: 6 }}>
            选择一套旅行配置开始浏览
          </div>
        )}
      </div>

      <div className="page">
        {trips.map((t) => (
          <a key={t.id} className="card tripCard" href={tripHref(t.id)} style={{ textDecoration: 'none' }}>
            <h2 className="tripCardTitle">{t.title}</h2>
            <div className="tripMetaRow">
              {t.tags?.slice(0, 3).map((tag) => (
                <span className="pill" key={tag}>
                  {tag}
                </span>
              ))}
              {t.start ? <span className="pill">{t.start}</span> : null}
              {t.end ? <span className="pill">{t.end}</span> : null}
            </div>
          </a>
        ))}
      </div>
    </>
  )
}

