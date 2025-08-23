import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react'
import type { useSearchParams } from '~/hooks/useSearchParams'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { getFilterValueOnlyWithExistingAttributes } from '~/models/utils/getFilterValueOnlyWithExistingAttributes'
import { URL_SEARCH_PARAM_KEY_LOCATION_ID, URL_SEARCH_PARAM_KEY_LOCATION_NAME, URL_SEARCH_PARAM_KEY_MAP_MODE, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID, URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { getLocationByIdAndNameAndPlanetarySystemNameSelector, useLocationsStore } from '~/stores/entity-stores/Locations.store'
import { getMovingEntityByIdAndNameAndPlanetarySystemNameSelector, useMovingEntitiesStore } from '~/stores/entity-stores/MovingEntities.store'
import { getPlanetarySystemByNameSelector, usePlanetarySystemsStore } from '~/stores/entity-stores/PlanetarySystems.store'
import { useLoadingPersistStorages } from '~/stores/hooks/useLoadingPersistStorages'
import { isObjectsHaveAtLeastOneDifferentAttribute } from '~/utils/isObjectsHaveAtLeastOneDifferentAttribute'
import { setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams } from '../../router/urlSearchParams/setMovingEntityOrLocationOrPlanetarySystemToUrlSearchParams'
import { isMapMode, type MapMode } from './Map.const'

export const URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_FILTER = [
  URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID,
  URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,
  URL_SEARCH_PARAM_KEY_LOCATION_ID,
  URL_SEARCH_PARAM_KEY_LOCATION_NAME,
  URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
  URL_SEARCH_PARAM_KEY_MAP_MODE,
] as const

type MapFilter = {
  movingEntityUuid?: MovingEntity['uuid']
  locationUuid?: Location['uuid']
  planetarySystemUuid?: PlanetarySystem['uuid']
  mapMode?: MapMode
}

type MapUrlSearchParams = (Partial<Omit<MapFilter, 'name'>> & {
  movingEntityId?: string
  movingEntityName?: string
  locationId?: string
  locationName?: string
  planetarySystemName?: string
  mapMode?: MapMode
}) | undefined

export function getMapUrlSearchParams(urlSearchParams: URLSearchParams): MapUrlSearchParams {
  const suggestedMapMode = urlSearchParams.get(URL_SEARCH_PARAM_KEY_MAP_MODE) || undefined
  const mapMode = isMapMode(suggestedMapMode) ? suggestedMapMode : undefined

  const filterValueWithAllAttributes = {
    movingEntityId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID) || undefined,
    movingEntityName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME) || undefined,
    locationId: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_ID) || undefined,
    locationName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_LOCATION_NAME) || undefined,
    planetarySystemName: urlSearchParams.get(URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME) || undefined,
    mapMode: mapMode,

  } satisfies MapUrlSearchParams

  return getFilterValueOnlyWithExistingAttributes(filterValueWithAllAttributes)
}

function prepareMapFilterValue({
  filterValue,
}: {
  filterValue: MapUrlSearchParams
}): MapFilter | undefined {
  if (!filterValue) {
    return undefined
  }

  const {
    movingEntityId,
    movingEntityName,
    locationId,
    locationName,
    planetarySystemName,
    mapMode,
    ...rest
  } = filterValue

  const movingEntity = getMovingEntityByIdAndNameAndPlanetarySystemNameSelector({
    id: movingEntityId,
    name: movingEntityName,
    planetarySystemName,
  })
  const movingEntityUuid = movingEntity?.uuid

  const location = getLocationByIdAndNameAndPlanetarySystemNameSelector({
    id: locationId,
    name: locationName,
    planetarySystemName
  })
  const locationUuid = location?.uuid

  const planetarySystemUuid = location?.planetarySystemUuid
    ? location?.planetarySystemUuid
    : (!!planetarySystemName && getPlanetarySystemByNameSelector(planetarySystemName)?.uuid) || undefined

  return {
    ...rest,
    movingEntityUuid,
    locationUuid,
    planetarySystemUuid,
    mapMode
  } satisfies MapFilter
}

export function useMapFilter({
  urlSearchParams,
  setUrlSearchParams
}: ReturnType<typeof useSearchParams>) {
  const isLoadingPersistStorages = useLoadingPersistStorages([useMovingEntitiesStore, useLocationsStore, usePlanetarySystemsStore])
  const isLoading = isLoadingPersistStorages

  const lastMapFilterValueRef = useRef<MapFilter | undefined>(undefined)
  const mapFilterValue = useMemo(function mapFilterValueMemo() {
    if (isLoading || !isLoading) {
      // noop - just tracking isLoading updates
    }

    const searchingFilterValue = getMapUrlSearchParams(urlSearchParams)
    const newFilterValue = prepareMapFilterValue({
      filterValue: searchingFilterValue
    })
    const prev = lastMapFilterValueRef.current
    const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prev, newFilterValue)

    if (areThereAnyChanges) {
      lastMapFilterValueRef.current = newFilterValue
      return newFilterValue
    }

    return prev
  }, [urlSearchParams, lastMapFilterValueRef, isLoading])

  const setMapFilterValueToUrlSearchParams: Dispatch<SetStateAction<MapFilter | undefined>> = useCallback(function setMapFilterValueToUrlSearchParams(
    mapFilterValue
  ) {
    let newMapFilterValue: MapFilter | undefined = undefined

    if (typeof mapFilterValue === 'function') {
      throw new Error('MapFilterValue as setState(prev=>newState) function not supported')
    } else {
      if (!!mapFilterValue && Object.keys(mapFilterValue).length > 0) {
        newMapFilterValue = mapFilterValue
      }
    }

    setUrlSearchParams((prev) => {
      const prevFilterValue = getMapUrlSearchParams(prev)
      const areThereAnyChanges = isObjectsHaveAtLeastOneDifferentAttribute(prevFilterValue, newMapFilterValue)

      if (areThereAnyChanges) {
        if (!newMapFilterValue) {
          URL_SEARCH_PARAM_KEY_ALLOWED_IN_MAP_FILTER.forEach((key) => {
            prev.delete(key)
          })

          return prev
        }

        const movingEntityUuid = newMapFilterValue['movingEntityUuid']
        const locationUuid = newMapFilterValue['locationUuid']
        const planetarySystemUuid = newMapFilterValue['planetarySystemUuid']
        const mapMode = newMapFilterValue['mapMode']

        setMovingEntityOrLocationOrPlanetarySystemOrProductToUrlSearchParams({
          urlSearchParams: prev,

          movingEntityUuid,
          locationUuid,
          planetarySystemUuid,
          mapMode,

          movingEntityIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_ID,
          movingEntityNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,

          locationIdUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_ID,
          locationNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_LOCATION_NAME,

          planetarySystemNameUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,

          mapModeUrlSearchParamsKeyName: URL_SEARCH_PARAM_KEY_MAP_MODE,
        })
      }

      return prev
    })
  }, [setUrlSearchParams])

  return {
    mapFilterValue,
    setMapFilterValueToUrlSearchParams,
  }
}
