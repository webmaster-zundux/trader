import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_SEARCH_VALUE, getMapSearchValueFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useMapSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getMapSearchValueFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_SEARCH_VALUE,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_SEARCH_VALUE,
    searchFieldPlaceholderTextInSearchForm: `Search by name or id...`,
  })
}
