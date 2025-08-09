import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react'
import { useSearchForm } from '~/components/tables/hooks/useSearchForm'
import type { useSearchParams } from '~/hooks/useSearchParams'

interface useTableSearchProps extends ReturnType<typeof useSearchParams> {
  getSearchValueFromUrlSearchParams: (urlSearchParams: URLSearchParams) => string
  searchValueKeyInUrlSearchParams: string
  searchFieldNameInSearchForm: string
  searchFieldPlaceholderTextInSearchForm: string
}
export function useTableSearch({
  urlSearchParams,
  setUrlSearchParams,
  getSearchValueFromUrlSearchParams,
  searchValueKeyInUrlSearchParams,
  searchFieldNameInSearchForm,
  searchFieldPlaceholderTextInSearchForm,
}: useTableSearchProps) {
  const searchFieldValue = useMemo(function searchFieldValueMemo() {
    return getSearchValueFromUrlSearchParams(urlSearchParams)
  }, [urlSearchParams, getSearchValueFromUrlSearchParams])

  const setSearchValueToUrlSearchParams: Dispatch<SetStateAction<string | undefined>> = useCallback(function setSearchValueToUrlSearchParams(searchValue) {
    let newSearchValue: string | undefined = undefined

    if (typeof searchValue === 'function') {
      throw new Error('searchValue as setState(prev=>newState) function not supported in setSearchValueToUrlSearchParams()')
    } else {
      newSearchValue = searchValue
    }

    setUrlSearchParams((prev) => {
      const prevSearchValue = getSearchValueFromUrlSearchParams(prev)

      if (newSearchValue !== prevSearchValue) {
        if (!newSearchValue) {
          prev.delete(searchValueKeyInUrlSearchParams)
        } else {
          prev.set(searchValueKeyInUrlSearchParams, newSearchValue)
        }
      }

      return prev
    })
  }, [setUrlSearchParams, getSearchValueFromUrlSearchParams, searchValueKeyInUrlSearchParams])

  const {
    SearchForm,
    resetValue: resetSearchFieldValue,
  } = useSearchForm({
    searchFieldInitialValue: searchFieldValue,
    searchFieldName: searchFieldNameInSearchForm,
    onValueChange: setSearchValueToUrlSearchParams,
    searchFieldPlaceholderText: searchFieldPlaceholderTextInSearchForm,
  })

  return {
    searchFieldValue,
    SearchForm,
    resetSearchFieldValue,
  }
}
