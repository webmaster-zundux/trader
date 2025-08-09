import { isUuid } from '~/models/Entity'
import { getLocationTypeByUuidSelector, getLocationTypesSelector } from '~/stores/entity-stores/LocationTypes.store'

export function sortItemsByLocationTypeName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const { isHydrating: isLoading } = getLocationTypesSelector()

  if (isLoading) {
    return 0
  }

  const nameA = (isUuid(aItemUuid) && getLocationTypeByUuidSelector(aItemUuid)?.name) || ''
  const nameB = (isUuid(bItemUuid) && getLocationTypeByUuidSelector(bItemUuid)?.name) || ''

  return nameA.localeCompare(nameB)
}
