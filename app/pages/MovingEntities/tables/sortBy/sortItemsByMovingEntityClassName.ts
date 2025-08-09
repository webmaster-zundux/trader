import { isUuid } from '~/models/Entity'
import { getLoadingStatusForMovingEntityClassesSelector, getMovingEntityClassByUuidSelector } from '~/stores/entity-stores/MovingEntityClasses.store'

export function sortItemsByMovingEntityClassName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const isLoading = getLoadingStatusForMovingEntityClassesSelector()

  if (isLoading) {
    return 0
  }

  const itemAName = (isUuid(aItemUuid) && getMovingEntityClassByUuidSelector(aItemUuid)?.name) || ''
  const itemBName = (isUuid(bItemUuid) && getMovingEntityClassByUuidSelector(bItemUuid)?.name) || ''

  return itemAName.localeCompare(itemBName)
}
