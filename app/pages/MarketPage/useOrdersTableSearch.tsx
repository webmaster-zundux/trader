import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_PRODUCT_NAME, getProductNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useOrdersTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getProductNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_PRODUCT_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_PRODUCT_NAME,
    searchFieldPlaceholderTextInSearchForm: `Start typing to search a product by name...`,
  })
}
