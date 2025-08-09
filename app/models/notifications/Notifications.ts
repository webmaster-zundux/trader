import { getAttributesNamesWithoutUuid } from '~/stores/utils/getAttributesWithoutUuid'
import type { Entity } from '../Entity'

export const ENTITY_TYPE_NOTIFICATION = 'notification' as const

export type Notification = Entity & {
  entityType: typeof ENTITY_TYPE_NOTIFICATION

  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  messages: (string | (() => React.JSX.Element))[]
  hideTimeout?: number
  tags?: string[]
}

export type NotificationAttributes = keyof Notification

export const getNotificationByUuid = (
  notificationUuid: string,
  notifications: Notification[]
) => notifications.find(notification => notification.uuid === notificationUuid)

export const NOTIFICATION_ATTRIBUTES: NotificationAttributes[] = (['uuid', 'entityType', 'type', 'tags', 'title', 'messages', 'hideTimeout'] as const) satisfies NotificationAttributes[]

export const NOTIFICATION_ATTRIBUTES_WITHOUT_UUID = getAttributesNamesWithoutUuid(NOTIFICATION_ATTRIBUTES)

export function isNotification(value: unknown): value is Notification {
  return ((value as Notification)?.entityType === ENTITY_TYPE_NOTIFICATION)
}
