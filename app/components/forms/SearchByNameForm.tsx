import type { ChangeEventHandler, FormEventHandler } from 'react'
import { memo, useCallback, useRef } from 'react'
import { Button } from '../Button'
import styles from './SearchByNameForm.module.css'
import { InputField } from './fields/InputField'

interface SearchByNameFormProps {
  searchFieldValue: string
  searchFieldName?: string
  searchFieldPlaceholderText?: string
  onSearch: (searchTerm?: string) => void
}

export const SearchByNameForm = memo(function SearchByNameForm({
  searchFieldValue,
  searchFieldPlaceholderText = 'Type to search...',
  searchFieldName = 'q',
  onSearch,
}: SearchByNameFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const searchItemByTerm = useCallback(() => {
    const form = formRef.current

    if (!form) {
      return
    }

    const searchData = Object.fromEntries(
      new FormData(form).entries()
    )

    onSearch(searchData?.[searchFieldName] as string)
  }, [onSearch, searchFieldName])

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault()
    searchItemByTerm()
  }, [searchItemByTerm])

  const handleChangeSearchTerm: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const searchTerm = event.target.value

    onSearch(searchTerm)
  }, [onSearch])

  const handleReset = useCallback(() => {
    onSearch(undefined)
  }, [onSearch])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={styles.SearchByNameForm}
    >
      <div className={styles.SearchField}>
        <InputField
          type="text"
          name={searchFieldName}
          required={false}
          autoComplete="on"
          spellCheck="false"
          placeholder={searchFieldPlaceholderText}
          value={searchFieldValue}
          onChange={handleChangeSearchTerm}
        />

        <Button
          type="reset"
          title="clear search field value"
        >
          <i className="icon icon-clear"></i>
        </Button>
      </div>

    </form>
  )
})
