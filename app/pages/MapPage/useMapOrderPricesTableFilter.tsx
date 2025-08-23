import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { MapOrderPricesFilter } from '~/models/entities-filters/MapOrderPricesFilter'
import type { Location } from '~/models/entities/Location'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_MAX_PRICE, URL_SEARCH_PARAM_KEY_MAX_QUANTITY, URL_SEARCH_PARAM_KEY_MIN_PRICE, URL_SEARCH_PARAM_KEY_MIN_QUANTITY, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getLocationByIdAndNameAndPlanetarySystemNameSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByNameSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'
import { setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams } from '../../router/urlSearchParams/setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams'

export const ATOMIC_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER = [
  URL_SEARCH_PARAM_KEY_MIN_PRICE,
  URL_SEARCH_PARAM_KEY_MAX_PRICE,
  URL_SEARCH_PARAM_KEY_MIN_QUANTITY,
  URL_SEARCH_PARAM_KEY_MAX_QUANTITY,
] as const

export const LOCATION_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER = [
  URL_SEARCH_PARAM_KEY_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
] as const

type MapOrderPricesTableUrlSearchParams = (Partial<Omit<MapOrderPricesFilter, 'name'>> & {
  locationId?: string
  locationName?: string
  planetarySystemName?: string
}) | undefined

export function getMapOrderPricesTableUrlSearchParams(urlSearchParams: URLSearchParams): MapOrderPricesTableUrlSearchParams {
  const filterValueWithAllAttributes = {
    locationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_ID) || undefined,
    locationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_NAME) || undefined,
    planetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || undefined,

    minPrice: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MIN_PRICE) || 0) || undefined,
    maxPrice: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAX_PRICE) || 0) || undefined,
    minQuantity: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MIN_QUANTITY) || 0) || undefined,
    maxQuantity: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAX_QUANTITY) || 0) || undefined,
  } satisfies MapOrderPricesTableUrlSearchParams

  return getFilterValueOnlyWithExistingAttributes(filterValueWithAllAttributes)
}

function prepareMapOrderPricesTableFilterValue({
  filterValue,
}: {
  filterValue: MapOrderPricesTableUrlSearchParams
}): MapOrderPricesFilter | undefined {
  if (!filterValue) {
    return undefined
  }

  const {
    locationId,
    locationName,
    planetarySystemName,
    ...rest
  } = filterValue

  let locationUuid: Location['uuid'] | undefined = undefined

  if (locationId || locationName) {
    locationUuid = getLocationByIdAndNameAndPlanetarySystemNameSelector({
      id: locationId,
      name: locationName,
      planetarySystemName
    })?.uuid
  } else if (planetarySystemName) {
    locationUuid = getPlanetarySystemByNameSelector(planetarySystemName)?.uuid
  }

  return {
    ...rest,
    locationUuid,
  } satisfies MapOrderPricesFilter
}

export function useMapOrderPricesTableFilter({
  urlSearchParams,
  setUrlSearchParams
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore])
  const isLoading = isLoadingPersistStorages || isLoadingSimpleCacheStorages

  const lastMapOrderPricesFilterValueRef = useRef<MapOrderPricesFilter | undefined>(undefined)
  const mapOrderPricesFilterValue = useMemo(function mapOrderPricesFilterValueMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const searchingFilterValue = getMapOrderPricesTableUrlSearchParams(urlSearchParams)
    const newFilterValue = prepareMapOrderPricesTableFilterValue({
      filterValue: searchingFilterValue
    })
    const prev = lastMapOrderPricesFilterValueRef.current
    const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (thereAreAnyChanges) {
      lastMapOrderPricesFilterValueRef.current = newFilterValue
      return newFilterValue
    }

    return prev
  }, [urlSearchParams, lastMapOrderPricesFilterValueRef, isLoading])

  const setMapOrderPricesFilterValueToUrlSearchParams: Dispatch<SetStateAction<MapOrderPricesFilter | undefined>> = useCallback(function setMapOrderPricesFilterValueToUrlSearchParams(mapOrderPricesFilterValue) {
    let newMapOrderPricesFilterValue: MapOrderPricesFilter | undefined = undefined

    if (typeof mapOrderPricesFilterValue === 'function') {
      throw new Error('MapOrderPricesValue as setState(prev=>newState) function not supported')
    } else {
      if (!!mapOrderPricesFilterValue && Object.keys(mapOrderPricesFilterValue).length > 0) {
        newMapOrderPricesFilterValue = mapOrderPricesFilterValue
      }
    }

    setUrlSearchParams((prev) => {
      const prevFilterValue = getMapOrderPricesTableUrlSearchParams(prev)
      const thereAreAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newMapOrderPricesFilterValue)

      if (thereAreAnyChanges) {
        if (!newMapOrderPricesFilterValue) {
          ATOMIC_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER.forEach((key) => {
            prev.delete(key)
          })

          LOCATION_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER.forEach((key) => {
            prev.delete(key)
          })

          return prev
        }

        ATOMIC_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER.forEach((key) => {
          if (newMapOrderPricesFilterValue[key]) {
            prev.set(key, `${newMapOrderPricesFilterValue[key]}`)
          } else {
            prev.delete(key)
          }
        })

        const locationUuid = newMapOrderPricesFilterValue['locationUuid']

        setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams({
          urlSearchParams: prev,
          locationUuid,
          planetarySystemUuid: locationUuid,
          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_NAME,
          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
        })
      }

      return prev
    })
  }, [setUrlSearchParams])

  return {
    mapOrderPricesFilterValue,
    setMapOrderPricesFilterValueToUrlSearchParams,
  }
}
