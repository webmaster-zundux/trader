import type { LocationType } from '~/models/entities/LocationType'
import type { Location } from '../../models/entities/Location'
import type { PlanetarySystem } from '../../models/entities/PlanetarySystem'
import { PAGE_SLUG_LOCATIONS } from '../PageSlugs.const'
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from './UrlSearchParamsKeys.const'

export function getUrlToLocationsPageWithParams({
  locationId,
  locationName,
  planetarySystemName,
  locationTypeName,
}: {
  locationId?: Location['id']
  locationName?: Location['name']
  planetarySystemName?: PlanetarySystem['name']
  locationTypeName?: LocationType['name']
}): string | undefined {
  const urlSearchParams = new URLSearchParams()

  if ((typeof locationId === 'string') && !!locationId) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_ID, locationId)
  }
  if ((typeof locationName === 'string') && !!locationName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_NAME, locationName)
  }

  if ((typeof planetarySystemName === 'string') && !!planetarySystemName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, planetarySystemName)
  }

  if ((typeof locationTypeName === 'string') && !!locationTypeName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME, locationTypeName)
  }

  if (!urlSearchParams.size) {
    return undefined
  }

  return `/${PAGE_SLUG_LOCATIONS}?${urlSearchParams.toString()}`
}
