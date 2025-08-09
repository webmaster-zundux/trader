import { memo } from 'react'
import { useNotificationsStore } from '~/stores/notification-stores/notification.store'
import styles from './NotificationList.module.css'
import { NotificationListitem } from './NotificationListItem'
import { useShallow } from 'zustand/react/shallow'

export const NotificationList = memo(function NotificationList() {
  const notifications = useNotificationsStore(useShallow(state => state.items()))

  return (
    <div className={styles.NotificationContainer}>

      {notifications.map(notification => (
        <NotificationListitem
          key={notification.uuid}
          notification={notification}
        />
      ))}

    </div>
  )
})
