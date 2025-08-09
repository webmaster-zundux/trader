import { useMemo } from 'react'
import { usePageTitle } from '~/hooks/usePageTitle'
import { useSearchParams } from '~/hooks/useSearchParams'
import { getProductNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'
import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { Main } from '../../components/Main'
import { ProductRarityTable } from './ProductRarityTable'
import { PAGE_TITLE_PRODUCTS_WITH_SEARCH_PARAMS_FN } from './ProductsPage.const'
import styles from './ProductsPage.module.css'
import { ProductsTable } from './ProductsTable'
import { ProductTypesTable } from './ProductTypesTable'

function useProductsPageTitle(urlSearchParams: URLSearchParams) {
  const searchingProductName = useMemo(() => getProductNameFromUrlSearchParams(urlSearchParams), [urlSearchParams])

  const pageTitle = useMemo(function pageTitleMemo() {
    return createPageTitleString(PAGE_TITLE_PRODUCTS_WITH_SEARCH_PARAMS_FN({
      productName: searchingProductName,
    }))
  }, [searchingProductName])

  usePageTitle(pageTitle)
}

export function ProductsPage() {
  const { urlSearchParams, setUrlSearchParams } = useSearchParams()

  useProductsPageTitle(urlSearchParams)

  return (
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
  )
}
