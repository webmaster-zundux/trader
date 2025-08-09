import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME, getPlanetarySystemNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function usePlanetarySystemsTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getPlanetarySystemNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_PLANETARY_SYSTEM_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by planetary system name...`,
  })
}
