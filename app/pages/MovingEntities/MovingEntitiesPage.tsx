import { useMemo } from 'react'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getMovingEntityNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../../components/Main'
import { PAGE_TITLE_MOVING_ENTITIES_WITH_SEARCH_PARAMS_FN } from './MovingEntitiesPage.const'
import styles from './MovingEntitiesPage.module.css'
import { MovingEntitiesTable } from './MovingEntitiesTable'
import { MovingEntityClassesTable } from './MovingEntityClassesTable'

function useMovingEntitiesPageTitle(urlSearchParams: URLSearchParams): string {
  const searchingMovingEntityName = useMemo(() => getMovingEntityNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleWithAppName(PAGE_TITLE_MOVING_ENTITIES_WITH_SEARCH_PARAMS_FN({
      movingEntityName: searchingMovingEntityName,
    }))
  }, [searchingMovingEntityName])

  return pageTitle
}

export function MovingEntitiesPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const pageTitle = useMovingEntitiesPageTitle(urlSearchParams)

  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <div className={styles.Container}>
          <div className={styles.MainTable}>
            <MovingEntitiesTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>

          <div className={styles.TableGroups}>
            <MovingEntityClassesTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>
        </div>
      </Main>
    </>
  )
}
