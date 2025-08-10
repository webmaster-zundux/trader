import { useMemo } from 'react'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { createLocationFullNameFromParts } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { createMovingEntityFullNameFromParts } from '~/stores/simple-cache-stores/MovingEntitiesWithFullNameAsMap.store'
import { PAGE_TITLE_MAP_WITH_SEARCH_PARAMS_FN } from './MapPage.const'
import { getMapUrlSearchParams } from './useMapFilter'

export function useMapPageTitle(urlSearchParams: URLSearchParams): string {
  const searchingLocationFullName = useMemo(function searchingLocationFullNameMemo() {
    const searchingFilterValue = getMapUrlSearchParams(urlSearchParams)

    return createLocationFullNameFromParts({
      id: searchingFilterValue?.locationId,
      name: searchingFilterValue?.locationName,
      planetarySystemName: searchingFilterValue?.planetarySystemName,
    })
  }, [urlSearchParams])

  const searchingMovingEntityFullName = useMemo(function searchingMovingEntityFullNameMemo() {
    const searchingFilterValue = getMapUrlSearchParams(urlSearchParams)

    return createMovingEntityFullNameFromParts({
      id: searchingFilterValue?.movingEntityId,
      name: searchingFilterValue?.movingEntityName,
      planetarySystemName: searchingFilterValue?.planetarySystemName,
    })
  }, [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleWithAppName(PAGE_TITLE_MAP_WITH_SEARCH_PARAMS_FN({
      movingEntityName: searchingMovingEntityFullName,
      locationName: searchingLocationFullName,
    }))
  }, [searchingMovingEntityFullName, searchingLocationFullName])

  return pageTitle
}
