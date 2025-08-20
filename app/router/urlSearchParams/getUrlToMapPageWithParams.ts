import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import { MAP_MODE_UNIVERSE, type MapMode } from '~/pages/MapPage/Map.const'
import { parsePositionFromString, positionToString } from '../../models/Position'
import type { PlanetarySystem } from '../../models/entities/PlanetarySystem'
import { PAGE_SLUG_MAP } from "~/routes"
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_LOCATION_POSITION, URL_SEARCH_PARAM_KEY_MAP_MODE, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from './UrlSearchParamsKeys.const'

export function getUrlToMapPageWithParams({
  mapMode,
  planetarySystemName,
  locationId,
  locationName,
  position,
  movingEntityId,
  movingEntityName,
}: {
  mapMode?: MapMode
  planetarySystemName?: PlanetarySystem['name']
  locationId?: Location['id']
  locationName?: Location['name']
  position?: Location['position'] | MovingEntity['position']
  movingEntityId?: MovingEntity['id']
  movingEntityName?: MovingEntity['name']
}): string | undefined {
  const urlSearchParams = new URLSearchParams()

  if ((typeof planetarySystemName !== 'string') || !planetarySystemName) {
    // note: without the planetary system name the location position does not have the origin point of coordinates
    return undefined
  }

  if (planetarySystemName) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, planetarySystemName)
  }

  if (mapMode === MAP_MODE_UNIVERSE) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_MAP_MODE, mapMode)
  } else {
    if (locationId) {
      urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_ID, locationId)
    }

    if (locationName) {
      urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_NAME, locationName)
    }

    if (movingEntityId) {
      urlSearchParams.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, movingEntityId)
    }

    if (movingEntityName) {
      urlSearchParams.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, movingEntityName)
    }
  }

  const validLocationPosition = parsePositionFromString(position)

  if (validLocationPosition) {
    urlSearchParams.set(URL_SEARCH_PARAM_KEY_LOCATION_POSITION, positionToString(validLocationPosition))
  }

  if (!urlSearchParams.size) {
    return undefined
  }

  return `${PAGE_SLUG_MAP}?${urlSearchParams.toString()}`
}
