/**
 * 顶栏：与参考 UI「The Kinetic Nomad」一致的玻璃拟态顶栏。
 */
export function AppHeader() {
  return (
    <header className="appTopBar" role="banner">
      <div className="appTopBarInner">
        <button type="button" className="appTopBarIconBtn" aria-label="菜单（占位）">
          <span className="material-symbols-outlined" aria-hidden>
            menu
          </span>
        </button>
        <h1 className="appTopBarBrand">旅行计划</h1>
        <span className="appTopBarIconBtn appTopBarIconBtn--static" aria-hidden title="本地数据">
          <span className="material-symbols-outlined">cloud_done</span>
        </span>
      </div>
    </header>
  )
}
