import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME, getMovingEntityNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useMovingEntitiesTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getMovingEntityNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by moving object name, id, originalId...`,
  })
}
