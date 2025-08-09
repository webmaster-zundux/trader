import { useMemo } from 'react'
import { usePageTitle } from '~/hooks/usePageTitle'
import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { createLocationFullNameFromParts } from '~/stores/simple-cache-stores/LocationsWithFullNameAsMap.store'
import { createMovingEntityFullNameFromParts } from '~/stores/simple-cache-stores/MovingEntitiesWithFullNameAsMap.store'
import { PAGE_TITLE_MAP_WITH_SEARCH_PARAMS_FN } from './MapPage.const'
import { getMapUrlSearchParams } from './useMapFilter'

export function useMapPageTitle(urlSearchParams: URLSearchParams) {
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
    return createPageTitleString(PAGE_TITLE_MAP_WITH_SEARCH_PARAMS_FN({
      movingEntityName: searchingMovingEntityFullName,
      locationName: searchingLocationFullName,
    }))
  }, [searchingMovingEntityFullName, searchingLocationFullName])

  usePageTitle(pageTitle)
}
