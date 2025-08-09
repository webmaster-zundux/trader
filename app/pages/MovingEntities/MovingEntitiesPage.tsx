import { useMemo } from 'react'
import { usePageTitle } from '~/hooks/usePageTitle'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getMovingEntityNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { Main } from '../../components/Main'
import { PAGE_TITLE_MOVING_ENTITIES, PAGE_TITLE_MOVING_ENTITIES_WITH_SEARCH_PARAMS_FN } from './MovingEntitiesPage.const'
import styles from './MovingEntitiesPage.module.css'
import { MovingEntitiesTable } from './MovingEntitiesTable'
import { MovingEntityClassesTable } from './MovingEntityClassesTable'

const title = createPageTitleString(PAGE_TITLE_MOVING_ENTITIES)

function useMovingEntitiesPageTitle(urlSearchParams: URLSearchParams) {
  const searchingMovingEntityName = useMemo(() => getMovingEntityNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleString(PAGE_TITLE_MOVING_ENTITIES_WITH_SEARCH_PARAMS_FN({
      movingEntityName: searchingMovingEntityName,
    }))
  }, [searchingMovingEntityName])

  usePageTitle(pageTitle)
}

export function MovingEntitiesPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  useMovingEntitiesPageTitle(urlSearchParams)

  return (
    <>
      <title>{title}</title>

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
