import { clearNotes, getLastViewed } from '../../storage/notes'

export function MyPage() {
  const last = getLastViewed()
  const lastTrip = last?.tripId

  return (
    <>
      <div className="topbar">
        <h1 className="topbarTitle">我的</h1>
      </div>

      <div className="page">
        <div className="card tripCard">
          <h2 className="tripCardTitle" style={{ marginBottom: 10 }}>
            离线与本地备注
          </h2>

          <div className="subtle">
            本应用不上传数据：备注保存在你当前浏览器的 <code>localStorage</code> 中。
          </div>

          <div style={{ marginTop: 12 }}>
            {lastTrip ? (
              <div>
                上次查看：<a href={`#/trip/${encodeURIComponent(lastTrip)}`}>{lastTrip}</a>
              </div>
            ) : (
              <div className="subtle">尚未浏览任何旅行</div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => {
                clearNotes()
                window.location.hash = '#/'
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-h)',
                fontSize: 16,
              }}
            >
              清除本地备注数据
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

