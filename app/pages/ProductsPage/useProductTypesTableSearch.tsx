import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME, getProductTypeNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useProductTypesTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getProductTypeNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_PRODUCT_TYPE_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by product type...`,
  })
}
