export type Route =
  | { name: 'list' }
  | { name: 'trip'; tripId: string }
  | { name: 'my' }

export function parseRoute(hash: string): Route {
  // 约定：使用 hash 路由，避免 GitHub Pages SPA 刷新 404
  const raw = (hash || '').replace(/^#/, '')
  const path = raw.startsWith('/') ? raw : `/${raw}`

  if (path === '/' || path === '') return { name: 'list' }
  if (path.startsWith('/trip/')) {
    const tripId = decodeURIComponent(path.slice('/trip/'.length)).trim()
    if (tripId) return { name: 'trip', tripId }
  }
  if (path === '/my' || path.startsWith('/my/')) return { name: 'my' }
  return { name: 'list' }
}

export function tripHref(tripId: string) {
  return `#/trip/${encodeURIComponent(tripId)}`
}

export function listHref() {
  return '#/'
}

export function myHref() {
  return '#/my'
}

