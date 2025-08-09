import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { NotificationList } from './notifications/NotificationList'

export function AppPageContentLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <NotificationList />
    </>
  )
}
