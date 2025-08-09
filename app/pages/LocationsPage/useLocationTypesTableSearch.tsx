import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME, getLocationTypeNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useLocationTypesTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getLocationTypeNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_LOCATION_TYPE_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by location type...`,
  })
}
