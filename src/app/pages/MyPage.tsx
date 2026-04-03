import { clearNotes, getLastViewed } from '../../storage/notes'

export function MyPage() {
  const last = getLastViewed()
  const lastTrip = last?.tripId

  return (
    <>
      {/* 顶栏 */}
      <div className="topbar">
        <h1 className="topbarTitle">我的</h1>
      </div>

      <div className="page">
        <div className="card myCard">
          <div className="myCardTitle">离线与本地备注</div>

          <p className="subtle" style={{ lineHeight: 1.65, marginBottom: 12 }}>
            本应用不上传数据：备注保存在浏览器的{' '}
            <code>localStorage</code> 中，离线可用。
          </p>

          {lastTrip ? (
            <p style={{ fontSize: 14, marginBottom: 14 }}>
              上次查看：
              <a href={`#/trip/${encodeURIComponent(lastTrip)}`} style={{ fontWeight: 600 }}>
                {lastTrip}
              </a>
            </p>
          ) : (
            <p className="subtle" style={{ marginBottom: 14 }}>尚未浏览任何旅行</p>
          )}

          <button
            type="button"
            className="dangerBtn"
            onClick={() => {
              if (window.confirm('确认清除本地所有备注数据？')) {
                clearNotes()
                window.location.hash = '#/'
              }
            }}
          >
            清除本地备注数据
          </button>
        </div>
      </div>
    </>
  )
}
