import type React from 'react'
import { memo, useMemo } from 'react'
import type { Promisefy } from '~/models/utils/utility-types'
import { ModalConfirmation } from './ModalConfirmation'

interface EmptyDataStorageAndSuggestionToLoadDemoDataConfirmationProps {
  onConfirm?: () => Promisefy<(string | (() => React.JSX.Element) | undefined | void)>
  onHide?: () => void
}
export const EmptyDataStorageAndSuggestionToLoadDemoDataConfirmation = memo(function EmptyDataStorageAndSuggestionToLoadDemoDataConfirmation({
  onHide,
  onConfirm,
}: EmptyDataStorageAndSuggestionToLoadDemoDataConfirmationProps) {
  const confirmationTitle = useMemo(() => (
    <>
      No data in data storage.
      <br />
      Are you want
      {' '}
      <strong>to load demo data</strong>
      ?
    </>
  ), [])

  return (
    <ModalConfirmation
      title={confirmationTitle}
      onHide={onHide}
      onConfirm={onConfirm}
      confirmButtonLabel="load demo data"
    />
  )
})
