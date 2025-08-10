import { useMemo } from 'react'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getLocationNameFromUrlSearchParams, getPlanetarySystemNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../../components/Main'
import { LocationTypesTable } from './LocationTypesTable'
import { PAGE_TITLE_LOCATIONS_WITH_SEARCH_PARAMS_FN } from './LocationsPage.const'
import styles from './LocationsPage.module.css'
import { LocationsTable } from './LocationsTable'
import { PlanetarySystemsTable } from './PlanetarySystemsTable'

function useLocationsPageTitle(urlSearchParams: URLSearchParams): string {
  const searchingPlanetarySystemName = useMemo(() => getPlanetarySystemNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])
  const searchingLocationName = useMemo(() => getLocationNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleWithAppName(PAGE_TITLE_LOCATIONS_WITH_SEARCH_PARAMS_FN({
      locationName: searchingLocationName,
      planetarySystemName: searchingPlanetarySystemName,
    }))
  }, [searchingLocationName, searchingPlanetarySystemName])

  return pageTitle
}

export function LocationsPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const pageTitle = useLocationsPageTitle(urlSearchParams)

  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <div className={styles.Container}>
          <div className={styles.TableGroups}>
            <PlanetarySystemsTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />

            <LocationTypesTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>

          <div className={styles.MainTable}>
            <LocationsTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>
        </div>
      </Main>
    </>
  )
}
