import { memo, useCallback, useState, type AnimationEvent } from 'react'
import type { Notification } from '~/models/notifications/Notifications'
import { useNotificationsStore } from '~/stores/notification-stores/notification.store'
import { cn } from '~/utils/ui/ClassNames'
import styles from './NotificationListItem.module.css'

function hasTimeout(hideTimeout?: number): hideTimeout is number {
  if (
    typeof hideTimeout !== 'number'
    || !Number.isFinite(hideTimeout)
    || hideTimeout <= 0
  ) {
    return false
  }

  return true
}

interface NotificationListitemProps {
  notification: Notification
}
export const NotificationListitem = memo(function NotificationListitem({
  notification,
}: NotificationListitemProps) {
  const { type, hideTimeout } = notification
  const [isInDisapperState, setIsInDisapperState] = useState(false)
  const deleteNotification = useNotificationsStore(state => state.delete)

  const handleTimeoutAnimationEnd = useCallback(function handleTimeoutAnimationEnd() {
    setIsInDisapperState(true)
  }, [setIsInDisapperState])

  const handleDisappearAnimationEnd = useCallback(function handleDisappearAnimationEnd(
    event: AnimationEvent
  ) {
    if (
      (event.type === 'animationend')
      && (event.animationName === styles.AnimationSmoothDisappear)
    ) {
      deleteNotification(notification)
    }
  }, [notification, deleteNotification])

  return (
    <div
      className={cn([
        styles.Notification,
        (type === 'success') && styles.NotificationSuccess,
        (type === 'error') && styles.NotificationFailure,
        (type === 'warning') && styles.NotificationWarning,
        (type === 'info') && styles.NotificationInfo,
        isInDisapperState && styles.InDisapperState
      ])}
      onAnimationEnd={handleDisappearAnimationEnd}
      role={type === 'error' ? 'alert' : 'log'}
    >
      {hasTimeout(hideTimeout) && (
        <div
          className={styles.TimeoutProgressBar}
          style={{ animationDuration: `${hideTimeout}ms` }}
          onAnimationEnd={handleTimeoutAnimationEnd}
        >
        </div>
      )}

      <div className={styles.NotificationContent}>
        {!!notification.title && (
          <div className={styles.NotificationTitle}>
            {notification.title}
          </div>
        )}

        {!!notification.messages.length && (
          <div className={styles.MessageList}>
            {(notification.messages?.length) && notification.messages.map((message, index) =>
              (
                <div key={index} className={styles.MessageListItem}>
                  {typeof message === 'function' ? message() : message}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
})
