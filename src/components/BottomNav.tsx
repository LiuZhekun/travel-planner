import { listHref, myHref, tripHref, type Route } from '../app/router'

const NAV_ITEMS = [
  { name: 'list' as const, icon: '🗺', label: '行程', href: listHref() },
  { name: 'trip' as const, icon: '📅', label: '详情', href: null },   // href 动态
  { name: 'my'   as const, icon: '👤', label: '我的', href: myHref() },
]

export function BottomNav(props: { route: Route; currentTripId?: string }) {
  const { route, currentTripId } = props
  const activeName = route.name

  return (
    <nav className="bottomNav" aria-label="底部导航">
      {NAV_ITEMS.map(({ name, icon, label, href }) => {
        // 详情 tab 指向当前行程，没有则跳列表
        const to = name === 'trip'
          ? (currentTripId ? tripHref(currentTripId) : listHref())
          : href!

        return (
          <a
            key={name}
            className={`navBtn ${activeName === name ? 'active' : ''}`}
            href={to}
            aria-label={label}
          >
            {/* 图标带弹跳动效 */}
            <span className="navIcon">{icon}</span>
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
