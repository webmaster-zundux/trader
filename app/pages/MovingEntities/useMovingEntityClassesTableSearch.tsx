import { useTableSearch } from '~/components/tables/hooks/useTableSearch'
import type { useSearchParams } from '~/hooks/useSearchParams'
import { URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME, getMovingEntityClassNameFromUrlSearchParams } from '~/router/urlSearchParams/UrlSearchParamsKeys.const'

export function useMovingEntityClassesTableSearch({
  urlSearchParams,
  setUrlSearchParams,
}: ReturnType<typeof useSearchParams>) {
  return useTableSearch({
    urlSearchParams,
    setUrlSearchParams,
    getSearchValueFromUrlSearchParams: getMovingEntityClassNameFromUrlSearchParams,
    searchValueKeyInUrlSearchParams: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME,
    searchFieldNameInSearchForm: URL_SEARCH_PARAM_KEY_MOVING_ENTITY_CLASS_NAME,
    searchFieldPlaceholderTextInSearchForm: `Search by moving object class...`,
  })
}
