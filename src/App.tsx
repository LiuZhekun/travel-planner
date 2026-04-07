import { useEffect, useState } from 'react'
import './styles/travel.css'
import { AppHeader } from './components/AppHeader'
import { BottomNav } from './components/BottomNav'
import { ImagePreviewProvider } from './components/ImagePreview'
import { parseRoute, type Route } from './app/router'
import { TripListPage } from './app/pages/TripListPage'
import { TripDetailPage } from './app/pages/TripDetailPage'
import { ExpensesPage } from './app/pages/ExpensesPage'
import { MyPage } from './app/pages/MyPage'

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const currentTripId =
    route.name === 'trip' || route.name === 'expenses' ? route.tripId : undefined

  return (
    <ImagePreviewProvider>
      <div className="appShell">
        <AppHeader />
        <div className="appMain">
          {route.name === 'list' ? <TripListPage /> : null}
          {route.name === 'trip' ? <TripDetailPage tripId={route.tripId} /> : null}
          {route.name === 'expenses' ? <ExpensesPage tripId={route.tripId} /> : null}
          {route.name === 'my' ? <MyPage /> : null}
        </div>
        <BottomNav route={route} currentTripId={currentTripId} />
      </div>
    </ImagePreviewProvider>
  )
}
