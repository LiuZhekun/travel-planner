import { useEffect, useState } from 'react'
import './styles/travel.css'
import { BottomNav } from './components/BottomNav'
import { parseRoute, type Route } from './app/router'
import { TripListPage } from './app/pages/TripListPage'
import { TripDetailPage } from './app/pages/TripDetailPage'
import { MyPage } from './app/pages/MyPage'

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const currentTripId = route.name === 'trip' ? route.tripId : undefined

  return (
    <div className="appShell">
      {route.name === 'list' ? <TripListPage /> : null}
      {route.name === 'trip' ? <TripDetailPage tripId={route.tripId} /> : null}
      {route.name === 'my' ? <MyPage /> : null}

      <BottomNav route={route} currentTripId={currentTripId} />
    </div>
  )
}
