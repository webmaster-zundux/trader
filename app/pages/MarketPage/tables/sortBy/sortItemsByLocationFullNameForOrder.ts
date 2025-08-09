import { isUuid } from '~/models/Entity'
import { getLocationWithFullNameByUuidSelector, getLocationsWithFullNamesSelector } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'

export function sortItemsByLocationFullName(
  aItemUuid: unknown,
  bItemUuid: unknown
): number {
  const { isProcessing: isLoading } = getLocationsWithFullNamesSelector()

  if (isLoading) {
    return 0
  }

  const locationAWithFullName = (isUuid(aItemUuid) && getLocationWithFullNameByUuidSelector(aItemUuid)) || ''
  const locationBWithFullName = (isUuid(bItemUuid) && getLocationWithFullNameByUuidSelector(bItemUuid)) || ''

  return locationAWithFullName.localeCompare(locationBWithFullName)
}
