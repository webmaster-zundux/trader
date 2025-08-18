import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME, getProductRarityNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useProductRaritiesTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getProductRarityNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_PRODUCT_RARITY_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by product rarity name...`,
  })
}
