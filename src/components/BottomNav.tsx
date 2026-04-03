import { listHref, myHref, tripHref, type Route } from '../app/router'

export function BottomNav(props: { route: Route; currentTripId?: string }) {
  const { route, currentTripId } = props

  const activeName = route.name
  return (
    <nav className="bottomNav" aria-label="底部导航">
      <a className={`navBtn ${activeName === 'list' ? 'active' : ''}`} href={listHref()}>
        <span>列表</span>
      </a>

      <a
        className={`navBtn ${activeName === 'trip' ? 'active' : ''}`}
        href={currentTripId ? tripHref(currentTripId) : listHref()}
      >
        <span>详情</span>
      </a>

      <a className={`navBtn ${activeName === 'my' ? 'active' : ''}`} href={myHref()}>
        <span>我的</span>
      </a>
    </nav>
  )
}

