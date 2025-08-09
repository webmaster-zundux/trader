import type { Notification } from '~/models/notifications/Notifications'
import type { WithoutUUID } from '~/models/utils/utility-types'
import { createEntityMapStore } from '../entity-stores/createEntityMapStore'

export const useNotificationsStore = createEntityMapStore<Notification>()

export function getNotificationsSelector() {
  return useNotificationsStore.getState().items()
}

/**
 * Filter items with exact the same tags (e.g. for tags ['warn', 'export'] items with tags ['warn'] or ['warn', 'export', 'compression-error'] will be omitted).
 * If no tags were provided than only items without tags will be returned
 */
export function getNotificationsByFilterSelector(tags: Notification['tags']) {
  if (!tags) {
    return getNotificationsSelector().filter(item => !item.tags)
  }

  return getNotificationsSelector().filter((item) => {
    if (!item.tags) {
      return false
    }

    const existingItemTags = item.tags.filter(itemTag => tags.includes(itemTag))

    if (
      (existingItemTags.length === item.tags.length)
      && (existingItemTags.length === tags.length)
    ) {
      return true
    }

    return false
  })
}

export function createNotificationsAction(itemAttributes: WithoutUUID<Notification>): Notification {
  return useNotificationsStore.getState().create(itemAttributes)
}

export function deleteMultipleNotificationsAction(uuidsToDelete: string[]) {
  return useNotificationsStore.getState().deleteMultiple(uuidsToDelete)
}

/**
 * Create new item with defined tags (and delete all items with exact the same tags).
 * If no tags were provided than it add new item without tags (no another items will be deleted)
 */
export function createNotificationWithUniqTags(itemAttributes: WithoutUUID<Notification>): Notification {
  const tags = itemAttributes.tags

  if (tags?.length) {
    const itemsToDelete = getNotificationsByFilterSelector(tags)

    if (itemsToDelete.length) {
      const uuidsOfItemsToDelete = itemsToDelete.map(item => item.uuid)

      deleteMultipleNotificationsAction(uuidsOfItemsToDelete)
    }
  }

  return createNotificationsAction(itemAttributes)
}

export function deleteMultipleNotificationsWithTags(tags: Notification['tags']): void {
  const itemsToDelete = getNotificationsByFilterSelector(tags)

  if (itemsToDelete.length) {
    const uuidsOfItemsToDelete = itemsToDelete.map(item => item.uuid)

    deleteMultipleNotificationsAction(uuidsOfItemsToDelete)
  }
}
