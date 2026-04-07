export type Route =
  | { name: 'list' }
  | { name: 'trip'; tripId: string }
  | { name: 'expenses'; tripId: string }
  | { name: 'my' }

export function parseRoute(hash: string): Route {
  // 约定：使用 hash 路由，避免 GitHub Pages SPA 刷新 404
  const raw = (hash || '').replace(/^#/, '')
  const path = raw.startsWith('/') ? raw : `/${raw}`

  if (path === '/' || path === '') return { name: 'list' }
  if (path.startsWith('/trip/')) {
    const rest = path.slice('/trip/'.length)
    const parts = rest.split('/').filter(Boolean)
    if (parts.length >= 2 && parts[1] === 'expenses') {
      const tripId = decodeURIComponent(parts[0]).trim()
      if (tripId) return { name: 'expenses', tripId }
    }
    const tripId = decodeURIComponent(parts[0] ?? '').trim()
    if (tripId) return { name: 'trip', tripId }
  }
  if (path === '/my' || path.startsWith('/my/')) return { name: 'my' }
  return { name: 'list' }
}

export function tripHref(tripId: string) {
  return `#/trip/${encodeURIComponent(tripId)}`
}

export function expensesHref(tripId: string) {
  return `#/trip/${encodeURIComponent(tripId)}/expenses`
}

export function listHref() {
  return '#/'
}

export function myHref() {
  return '#/my'
}

