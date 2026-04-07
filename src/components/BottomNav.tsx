import { listHref, myHref, tripHref, type Route } from '../app/router'

const NAV_ITEMS = [
  { name: 'list' as const, icon: 'explore', label: '行程', href: listHref() },
  { name: 'trip' as const, icon: 'timeline', label: '时间线', href: null as string | null },
  { name: 'my' as const, icon: 'person', label: '我的', href: myHref() },
]

export function BottomNav(props: { route: Route; currentTripId?: string }) {
  const { route, currentTripId } = props
  const activeName = route.name

  return (
    <nav className="bottomNav" aria-label="底部导航">
      {NAV_ITEMS.map(({ name, icon, label, href }) => {
        const to =
          name === 'trip' ? (currentTripId ? tripHref(currentTripId) : listHref()) : href!

        const active =
          name === 'trip'
            ? activeName === 'trip' || activeName === 'expenses'
            : activeName === name

        return (
          <a
            key={name}
            className={`navBtn ${active ? 'active' : ''}`}
            href={to}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <span className="material-symbols-outlined" aria-hidden>
              {icon}
            </span>
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
