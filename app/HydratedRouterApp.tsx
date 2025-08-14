import { Outlet } from 'react-router'
import { Navbar } from './components/Navbar'
import { NotificationList } from './components/notifications/NotificationList'
import { storagesRequiredForDemo, USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA } from './stores/checkIfDemoDataCouldBeLoaded'
import { useLoadingPersistStorages } from './stores/hooks/useLoadingPersistStorages'

function PageLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <NotificationList />
    </>
  )
}

function DefaultAppRoot() {
  return (
    <PageLayout />
  )
}

function AppRootWithPersistentDataCheck() {
  useLoadingPersistStorages(storagesRequiredForDemo)

  return (
    <PageLayout />
  )
}

let HydratedRouterApp = DefaultAppRoot

if (USE_DEMO_CHECKING_EXISTENSE_OF_PERSISTED_DATA) {
  HydratedRouterApp = AppRootWithPersistentDataCheck
}

export default HydratedRouterApp
