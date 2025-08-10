import { useMemo } from 'react'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getProductNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../../components/Main'
import { ProductRarityTable } from './ProductRarityTable'
import { PAGE_TITLE_PRODUCTS_WITH_SEARCH_PARAMS_FN } from './ProductsPage.const'
import styles from './ProductsPage.module.css'
import { ProductsTable } from './ProductsTable'
import { ProductTypesTable } from './ProductTypesTable'

function useProductsPageTitle(urlSearchParams: URLSearchParams): string {
  const searchingProductName = useMemo(() => getProductNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleWithAppName(PAGE_TITLE_PRODUCTS_WITH_SEARCH_PARAMS_FN({
      productName: searchingProductName,
    }))
  }, [searchingProductName])

  return pageTitle
}

export function ProductsPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  const pageTitle = useProductsPageTitle(urlSearchParams)

  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <div className={styles.Container}>
          <div className={styles.Products}>
            <ProductsTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>

          <div className={styles.Parameters}>
            <ProductTypesTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />

            <ProductRarityTable
              urlSearchParams={urlSearchParams}
              setUrlSearchParams={setUrlSearchParams}
            />
          </div>
        </div>
      </Main>
    </>
  )
}
