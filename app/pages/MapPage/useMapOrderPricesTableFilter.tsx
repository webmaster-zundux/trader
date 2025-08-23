import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { MapOrderPricesFilter } from '~/models/entities-filters/MapOrderPricesFilter'
import type { Location } from '~/models/entities/Location'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_MAX_PRICE, URL_SEARCH_PARAM_KEY_MAX_QUANTITY, URL_SEARCH_PARAM_KEY_MIN_PRICE, URL_SEARCH_PARAM_KEY_MIN_PROFIT, URL_SEARCH_PARAM_KEY_MIN_QUANTITY, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, URL_SEARCH_PARAM_KEY_PRODUCT_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getLocationByIdAndNameAndPlanetarySystemNameSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getPlanetarySystemByNameSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { useLoadingSimpleCacheStorages } from '~/stores/hooks/useLoadingSimpleCacheStorages'
import { useLocationsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/LocationsAsSelectOptionArray.store'
import { useLocationsWithFullNameAsMapStore } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'
import { setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams } from '../../router/urlSearchParams/setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams'
import { getProductByNameSelector, useProductsStore } from '~/stores/entity-stores/Products.store'
import type { Product } from '~/models/entities/Product'
import { useProductsAsSelectOptionArrayStore } from '~/stores/simple-cache-stores/ProductsAsSelectOptionArray.store'

export const ATOMIC_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER = [
  URL_SEARCH_PARAM_KEY_MIN_PRICE,
  URL_SEARCH_PARAM_KEY_MAX_PRICE,
  URL_SEARCH_PARAM_KEY_MIN_QUANTITY,
  URL_SEARCH_PARAM_KEY_MAX_QUANTITY,
  URL_SEARCH_PARAM_KEY_MIN_PROFIT,
] as const

export const LOCATION_URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_ORDER_PRICES_FILTER = [
  URL_SEARCH_PARAM_KEY_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
  URL_SEARCH_PARAM_KEY_PRODUCT_NAME,
] as const

type MapOrderPricesTableUrlSearchParams = (Partial<Omit<MapOrderPricesFilter, 'name'>> & {
  locationId?: string
  locationName?: string
  planetarySystemName?: string
  productName?: string
}) | undefined

export function getMapOrderPricesTableUrlSearchParams(urlSearchParams: URLSearchParams): MapOrderPricesTableUrlSearchParams {
  const filterValueWithAllAttributes = {
    locationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_ID) || undefined,
    locationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_NAME) || undefined,
    planetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || undefined,
    productName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PRODUCT_NAME) || undefined,

    minPrice: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MIN_PRICE) || 0) || undefined,
    maxPrice: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAX_PRICE) || 0) || undefined,
    minQuantity: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MIN_QUANTITY) || 0) || undefined,
    maxQuantity: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAX_QUANTITY) || 0) || undefined,
    minProfit: +(urlSearchParams.get(URL_SEARCH_PARAM_KEY_MIN_PROFIT) || 0) || undefined,
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
    productName,
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

  let productUuid: Product['uuid'] | undefined = undefined

  if (productName) {
    productUuid = getProductByNameSelector(productName)?.uuid
  }

  return {
    ...rest,
    locationUuid,
    productUuid,
  } satisfies MapOrderPricesFilter
}

export function useMapOrderPricesTableFilter({
  urlSearchParams,
  setUrlSearchParams
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useLocationsStore, usePlanetarySystemsStore, useProductsStore])
  const isLoadingSimpleCacheStorages = useLoadingSimpleCacheStorages([useLocationsAsSelectOptionArrayStore, useLocationsWithFullNameAsMapStore, useProductsAsSelectOptionArrayStore])
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
    const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (areThereAnyChanges) {
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
      const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newMapOrderPricesFilterValue)

      if (areThereAnyChanges) {
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
        const productUuid = newMapOrderPricesFilterValue['productUuid']

        setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams({
          urlSearchParams: prev,
          locationUuid,
          planetarySystemUuid: locationUuid,
          productUuid,
          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_NAME,
          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
          productNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_PRODUCT_NAME,
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
