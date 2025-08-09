import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounceCallback } from '~/hooks/useDebounceCallback'
import { SearchByNameForm } from '../../forms/SearchByNameForm'

const SEARCH_VALUE_APPLYING_DEBOUNCE_DELAY = 500 // ms

interface UseSearchFormProps {
  searchFieldName: string
  searchFieldInitialValue: string
  searchFieldPlaceholderText: string
  onValueChange: (value: string) => void
}
export function useSearchForm({
  searchFieldName,
  searchFieldInitialValue,
  searchFieldPlaceholderText,
  onValueChange,
}: UseSearchFormProps) {
  const [internalSearchFieldValue, setInternalSearchFieldValue] = useState(searchFieldInitialValue)

  useEffect(function updateInternalSearchFieldValueEffect() {
    setInternalSearchFieldValue(searchFieldInitialValue)
  }, [searchFieldInitialValue, setInternalSearchFieldValue])

  const handleChangeSearchFieldValue = useCallback(function handleSearchFieldValueChange(value?: string) {
    const newValue = !value ? '' : value

    setInternalSearchFieldValue(newValue)
  }, [setInternalSearchFieldValue])

  const handleResetSearchFieldValue = useCallback(function handleResetSearchFieldValue() {
    handleChangeSearchFieldValue('')
  }, [handleChangeSearchFieldValue])

  const SearchForm = useMemo(function SearchFormMemo() {
    return (
      <SearchByNameForm
        searchFieldValue={internalSearchFieldValue}
        searchFieldName={searchFieldName}
        searchFieldPlaceholderText={searchFieldPlaceholderText}
        onSearch={handleChangeSearchFieldValue}
      />
    )
  }, [internalSearchFieldValue, searchFieldName, searchFieldPlaceholderText, handleChangeSearchFieldValue])

  useDebounceCallback(internalSearchFieldValue, SEARCH_VALUE_APPLYING_DEBOUNCE_DELAY, onValueChange)

  return {
    SearchForm,
    setValue: setInternalSearchFieldValue,
    resetValue: handleResetSearchFieldValue,
  }
}
