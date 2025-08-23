import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { MovingEntityFilter } from '~/models/entities-filters/MovingEntityFilter'
import type { Location } from '~/models/entities/Location'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID, URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME, URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME, URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID, URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME, URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME, URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams } from '~/router/urlSearchParams/setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams'
import { getLocationByIdAndNameAndPlanetarySystemNameSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityClassByNameSelector, getMovingEntityClassByUuidSelector, useMovingEntityClassesStore } from '~/stores/entity-stores/MovingEntityClasses.store'
import { getPlanetarySystemByNameSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { useMovingEntityClassesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/MovingEntityClassesAsSelectOptionArray.store'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'

const MOVING_ENTITIES_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER = [
  URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME,

  URL_SEARCH_PARAM_KEY_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,

  URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME,

  URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME,
] as const

type MovingEntitiesTableUrlSearchParams = (Partial<Omit<MovingEntityFilter, 'name'>> & {
  className?: string

  locationId?: string
  locationName?: string
  planetarySystemName?: string

  destinationLocationId?: string
  destinationLocationName?: string
  destinationPlanetarySystemName?: string

  homeLocationId?: string
  homeLocationName?: string
  homePlanetarySystemName?: string
}) | undefined

function getMovingEntitiesTableUrlSearchParams(urlSearchParams: URLSearchParams): MovingEntitiesTableUrlSearchParams {
  const filterValueWithAllAttributes = {
    className: urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME) || undefined,

    locationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_ID) || undefined,
    locationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_NAME) || undefined,
    planetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || undefined,

    destinationLocationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID) || undefined,
    destinationLocationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME) || undefined,
    destinationPlanetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME) || undefined,

    homeLocationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID) || undefined,
    homeLocationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME) || undefined,
    homePlanetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME) || undefined,
  } satisfies MovingEntitiesTableUrlSearchParams

  return getFilterValueOnlyWithExistingAttributes(filterValueWithAllAttributes)
}

function getLocationUuidOfExistingLocationOrPlanetarySystem(
  locationId?: Location['id'],
  locationName?: Location['name'],
  planetarySystemName?: PlanetarySystem['name']
) {
  let locationUuid: PlanetarySystem['uuid'] | Location['uuid'] | undefined = undefined

  if (locationId || locationName) {
    locationUuid = getLocationByIdAndNameAndPlanetarySystemNameSelector({
      id: locationId,
      name: locationName,
      planetarySystemName
    })?.uuid
  } else if (planetarySystemName) {
    locationUuid = getPlanetarySystemByNameSelector(planetarySystemName)?.uuid
  }

  return locationUuid
}

function prepareMovingEntitiesTableFilterValue({
  filterValue,
}: {
  filterValue: MovingEntitiesTableUrlSearchParams
}): MovingEntityFilter | undefined {
  if (!filterValue) {
    return undefined
  }

  const {
    className,

    locationId,
    locationName,
    planetarySystemName,

    destinationLocationId,
    destinationLocationName,
    destinationPlanetarySystemName,

    homeLocationId,
    homeLocationName,
    homePlanetarySystemName,

    ...rest
  } = filterValue

  const movingEntityClassUuid = className
    ? getMovingEntityClassByNameSelector(className)?.uuid
    : undefined

  const locationUuid = getLocationUuidOfExistingLocationOrPlanetarySystem(locationId, locationName, planetarySystemName)
  const destinationLocationUuid = getLocationUuidOfExistingLocationOrPlanetarySystem(destinationLocationId, destinationLocationName, destinationPlanetarySystemName)
  const homeLocationUuid = getLocationUuidOfExistingLocationOrPlanetarySystem(homeLocationId, homeLocationName, homePlanetarySystemName)

  return {
    ...rest,
    movingEntityClassUuid,

    locationUuid,
    destinationLocationUuid,
    homeLocationUuid,
  } satisfies MovingEntityFilter
}

export function useMovingEntitiesTableFilter({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntityClassesStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useMovingEntityClassesAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const lastFilterValueRef = useRef<MovingEntityFilter | undefined>(undefined)
  const filterValue = useMemo(function filterValueMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const searchingFilterValue = getMovingEntitiesTableUrlSearchParams(urlSearchParams)
    const newFilterValue = prepareMovingEntitiesTableFilterValue({
      filterValue: searchingFilterValue,
    })
    const prev = lastFilterValueRef.current
    const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (areThereAnyChanges) {
      lastFilterValueRef.current = newFilterValue
      return newFilterValue
    }

    return prev
  }, [urlSearchParams, lastFilterValueRef, isLoading])

  const setFilterValueToUrlSearchParams: Dispatch<SetStateAction<MovingEntityFilter | undefined>> = useCallback(function setFilterValueToUrlSearchParams(filterValue) {
    let newFilterValue: MovingEntityFilter | undefined = undefined

    if (typeof filterValue === 'function') {
      throw new Error('MovingEntityFilterValue as setState(prev=>newState) function not supported')
    } else {
      if (!!filterValue && Object.keys(filterValue).length > 0) {
        newFilterValue = filterValue
      }
    }

    setUrlSearchParams((prev) => {
      const prevFilterValue = getMovingEntitiesTableUrlSearchParams(prev)
      const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newFilterValue)

      if (areThereAnyChanges) {
        if (!newFilterValue) {
          MOVING_ENTITIES_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER.forEach((key) => {
            prev.delete(key)
          })

          return prev
        }

        const movingEntityClassUuid = newFilterValue['movingEntityClassUuid']
        const movingEntityClassName = movingEntityClassUuid ? getMovingEntityClassByUuidSelector(movingEntityClassUuid)?.name : undefined

        if (movingEntityClassName) {
          prev.set(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME, movingEntityClassName)
        } else {
          prev.delete(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME)
        }

        const locationUuid = newFilterValue['locationUuid']

        setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams({
          urlSearchParams: prev,
          locationUuid,
          planetarySystemUuid: locationUuid,
          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_NAME,
          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
        })

        const destinationLocationUuid = newFilterValue['destinationLocationUuid']

        setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams({
          urlSearchParams: prev,
          locationUuid: destinationLocationUuid,
          planetarySystemUuid: destinationLocationUuid,
          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_DESTINATION_LOCATION_NAME,
          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_DESTINATION_PLANETARY_SYSTEM_NAME,
        })

        const homeLocationUuid = newFilterValue['homeLocationUuid']

        setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams({
          urlSearchParams: prev,
          locationUuid: homeLocationUuid,
          planetarySystemUuid: homeLocationUuid,
          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_HOME_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_HOME_LOCATION_NAME,
          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_HOME_PLANETARY_SYSTEM_NAME,
        })
      }

      return prev
    })
  }, [setUrlSearchParams])

  return {
    filterValue,
    setFilterValueToUrlSearchParams,
  }
}
