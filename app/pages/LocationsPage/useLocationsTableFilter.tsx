import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { LocationFilter } from '~/models/entities-filters/LocationFilter'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getLocationTypeByNameSelector, getLocationTypeByUuidSelector, useLocationTypesStore } from '~/stores/entity-stores/LocationTypes.store'
import { getPlanetarySystemByNameSelector, getPlanetarySystemByUuidSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationTypesAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationTypesAsSelectOptionArray.store'
import { usePlanetarySystemsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/PlanetarySystemsAsSelectOptionArray.store'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'

const LOCATIONS_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER = [
  URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
  URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME,
] as const

type LocationsTableUrlSearchParams = (Partial<Omit<LocationFilter, 'name'>> & {
  planetarySystemName?: string
  locationTypeName?: string
}) | undefined

function getLocationsTableUrlSearchParams(urlSearchParams: URLSearchParams): LocationsTableUrlSearchParams {
  const filterValueWithAllAttributes = {
    planetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || undefined,
    locationTypeName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME) || undefined
  } satisfies LocationsTableUrlSearchParams

  return getFilterValueOnlyWithExistingAttributes(filterValueWithAllAttributes)
}

function prepareLocationsTableFilterValue({
  filterValue,
}: {
  filterValue: LocationsTableUrlSearchParams
}): LocationFilter | undefined {
  if (!filterValue) {
    return undefined
  }

  const {
    planetarySystemName,
    locationTypeName,
    ...rest
  } = filterValue

  const planetarySystemUuid = planetarySystemName
    ? getPlanetarySystemByNameSelector(planetarySystemName)?.uuid
    : undefined

  const locationTypeUuid = locationTypeName
    ? getLocationTypeByNameSelector(locationTypeName)?.uuid
    : undefined

  return {
    ...rest,
    planetarySystemUuid,
    locationTypeUuid,
  } satisfies LocationFilter
}

export function useLocationsTableFilter({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([usePlanetarySystemsStore, useLocationTypesStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([usePlanetarySystemsAsSelectOptionArrayStore, useLocationTypesAsSelectOptionArrayStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const lastFilterValueRef = useRef<LocationFilter | undefined>(undefined)
  const filterValue = useMemo(function locationFilterValueMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const locationsTableUrlSearchParamsData = getLocationsTableUrlSearchParams(urlSearchParams)
    const newFilterValue = prepareLocationsTableFilterValue({
      filterValue: locationsTableUrlSearchParamsData,
    })
    const prev = lastFilterValueRef.current
    const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (thereAreAnyChanges) {
      lastFilterValueRef.current = newFilterValue
      return newFilterValue
    }

    return prev
  }, [urlSearchParams, lastFilterValueRef, isLoading])

  const setFilterValueToUrlSearchParams: Dispatch<SetStateAction<LocationFilter | undefined>> = useCallback(function setFilterValueToUrlSearchParams(filterValue) {
    let newFilterValue: LocationFilter | undefined = undefined

    if (typeof filterValue === 'function') {
      throw new Error('LocationValue as setState(prev=>newState) function not supported')
    } else {
      if (!!filterValue && Object.keys(filterValue).length > 0) {
        newFilterValue = filterValue
      }
    }

    setUrlSearchParams((prev) => {
      const prevFilterValue = getLocationsTableUrlSearchParams(prev)
      const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newFilterValue)

      if (thereAreAnyChanges) {
        if (!newFilterValue) {
          LOCATIONS_TABLE_URL_SEARCH_PARAM_KEYS_ALLOWED_IN_FILTER.forEach((key) => {
            prev.delete(key)
          })

          return prev
        }

        const planetarySystemUuid = newFilterValue['planetarySystemUuid']
        const planetarySystemName = planetarySystemUuid ? getPlanetarySystemByUuidSelector(planetarySystemUuid)?.name : undefined

        if (planetarySystemName) {
          prev.set(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, planetarySystemName)
        } else {
          prev.delete(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME)
        }

        const locationTypeUuid = newFilterValue['locationTypeUuid']
        const locationTypeName = locationTypeUuid ? getLocationTypeByUuidSelector(locationTypeUuid)?.name : undefined

        if (locationTypeName) {
          prev.set(URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME, locationTypeName)
        } else {
          prev.delete(URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME)
        }
      }

      return prev
    })
  }, [setUrlSearchParams])

  return {
    filterValue,
    setFilterValueToUrlSearchParams,
  }
}
