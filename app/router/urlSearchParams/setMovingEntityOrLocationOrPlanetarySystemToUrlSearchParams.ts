import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import type { MapMode } from '~/pages/MapPage/Map.const'
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_MAP_MODE, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getLocationByUuidSelector } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityByUuidSelector } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemByUuidSelector } from '~/stores/entity-stores/PlanetarySystems.store'

function setPlanetarySystemToUrlSearchParams(
  urlSearchParams: URLSearchParams,
  planetarySystemUuid?: PlanetarySystem['uuid'],
  planetarySystemNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME
): void {
  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined
  const planetarySystemName = planetarySystem?.name

  if (planetarySystemName) {
    urlSearchParams.set(planetarySystemNameUrlSearchParamsKeyName, planetarySystemName)
  } else {
    urlSearchParams.delete(planetarySystemNameUrlSearchParamsKeyName)
  }
}

function setLocationToUrlSearchParams(
  urlSearchParams: URLSearchParams,
  locationUuid?: Location['uuid'] | PlanetarySystem['uuid'],
  locationIdUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_ID,
  locationNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  planetarySystemNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME
): void {
  const location = locationUuid ? getLocationByUuidSelector(locationUuid) : undefined
  const locationId = location?.id
  const locationName = location?.name

  if (locationId) {
    urlSearchParams.set(locationIdUrlSearchParamsKeyName, locationId)
  } else {
    urlSearchParams.delete(locationIdUrlSearchParamsKeyName)
  }

  if (locationName) {
    urlSearchParams.set(locationNameUrlSearchParamsKeyName, locationName)
  } else {
    urlSearchParams.delete(locationNameUrlSearchParamsKeyName)
  }

  setPlanetarySystemToUrlSearchParams(urlSearchParams, location?.planetarySystemUuid || locationUuid, planetarySystemNameUrlSearchParamsKeyName)
}

function setMovingEntityToUrlSeachParams(
  urlSearchParams: URLSearchParams,
  movingEntityUuid?: MovingEntity['uuid'],
  movingEntityIdUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID,
  movingEntityNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,
  locationIdUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_ID,
  locationNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  planetarySystemNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME
): void {
  const movingEntity = movingEntityUuid ? getMovingEntityByUuidSelector(movingEntityUuid) : undefined
  const movingEntityId = movingEntity?.id
  const movingEntityName = movingEntity?.name

  if (movingEntityId) {
    urlSearchParams.set(movingEntityIdUrlSearchParamsKeyName, movingEntityId)
  } else {
    urlSearchParams.delete(movingEntityIdUrlSearchParamsKeyName)
  }

  if (movingEntityName) {
    urlSearchParams.set(movingEntityNameUrlSearchParamsKeyName, movingEntityName)
  } else {
    urlSearchParams.delete(movingEntityNameUrlSearchParamsKeyName)
  }

  setLocationToUrlSearchParams(
    urlSearchParams,
    movingEntity?.locationUuid,
    locationIdUrlSearchParamsKeyName,
    locationNameUrlSearchParamsKeyName,
    planetarySystemNameUrlSearchParamsKeyName
  )
}

function removeMovingEntityFromUrlSearchParams(
  urlSearchParams: URLSearchParams,
  movingEntityIdUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID,
  movingEntityNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME
) {
  [
    movingEntityIdUrlSearchParamsKeyName,
    movingEntityNameUrlSearchParamsKeyName,
  ].forEach((key) => {
    urlSearchParams.delete(key)
  })
}

function removeLocationFromUrlSearchParams(
  urlSearchParams: URLSearchParams,
  locationIdUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_ID,
  locationNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_LOCATION_NAME
) {
  [
    locationIdUrlSearchParamsKeyName,
    locationNameUrlSearchParamsKeyName,
  ].forEach((key) => {
    urlSearchParams.delete(key)
  })
}

function removePlanetarySystemFromUrlSearchParams(
  urlSearchParams: URLSearchParams,
  planetarySystemNameUrlSearchParamsKeyName: string = URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME
) {
  [
    planetarySystemNameUrlSearchParamsKeyName,
  ].forEach((key) => {
    urlSearchParams.delete(key)
  })
}

export function setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams({
  urlSearchParams,

  movingEntityUuid,
  locationUuid,
  planetarySystemUuid,
  mapMode,

  movingEntityIdUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID,
  movingEntityNameUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,

  locationIdUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_LOCATION_ID,
  locationNameUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_LOCATION_NAME,

  planetarySystemNameUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,

  mapModeUrlSearchParamsKeyName = URL_SEARCH_PARAM_KEY_MAP_MODE,
}: {
  urlSearchParams: URLSearchParams

  locationUuid?: Location['uuid']
  movingEntityUuid?: MovingEntity['uuid']
  planetarySystemUuid?: PlanetarySystem['uuid']
  mapMode?: MapMode

  movingEntityIdUrlSearchParamsKeyName?: string
  movingEntityNameUrlSearchParamsKeyName?: string

  locationIdUrlSearchParamsKeyName?: string
  locationNameUrlSearchParamsKeyName?: string

  planetarySystemNameUrlSearchParamsKeyName?: string

  mapModeUrlSearchParamsKeyName?: string
}): void {
  const movingEntity = movingEntityUuid ? getMovingEntityByUuidSelector(movingEntityUuid) : undefined

  if (movingEntity) {
    urlSearchParams.delete(mapModeUrlSearchParamsKeyName)
    setMovingEntityToUrlSeachParams(
      urlSearchParams,
      movingEntityUuid,
      movingEntityIdUrlSearchParamsKeyName,
      movingEntityNameUrlSearchParamsKeyName,
      locationIdUrlSearchParamsKeyName,
      locationNameUrlSearchParamsKeyName,
      planetarySystemNameUrlSearchParamsKeyName
    )
    return
  } else {
    removeMovingEntityFromUrlSearchParams(urlSearchParams, movingEntityIdUrlSearchParamsKeyName, movingEntityNameUrlSearchParamsKeyName)
  }

  const location = locationUuid ? getLocationByUuidSelector(locationUuid) : undefined

  if (location) {
    urlSearchParams.delete(mapModeUrlSearchParamsKeyName)
    setLocationToUrlSearchParams(
      urlSearchParams,
      locationUuid,
      locationIdUrlSearchParamsKeyName,
      locationNameUrlSearchParamsKeyName,
      planetarySystemNameUrlSearchParamsKeyName
    )
    return
  } else {
    removeLocationFromUrlSearchParams(urlSearchParams, locationIdUrlSearchParamsKeyName, locationNameUrlSearchParamsKeyName)
  }

  const planetarySystem = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid) : undefined

  if (planetarySystem) {
    if (mapMode) {
      urlSearchParams.set(mapModeUrlSearchParamsKeyName, mapMode)
    } else {
      urlSearchParams.delete(mapModeUrlSearchParamsKeyName)
    }
    setPlanetarySystemToUrlSearchParams(urlSearchParams, planetarySystemUuid, planetarySystemNameUrlSearchParamsKeyName)
    return
  } else {
    urlSearchParams.delete(mapModeUrlSearchParamsKeyName)
    removePlanetarySystemFromUrlSearchParams(urlSearchParams, planetarySystemNameUrlSearchParamsKeyName)
  }
}
